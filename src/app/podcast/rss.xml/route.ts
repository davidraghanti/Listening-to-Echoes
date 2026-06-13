
import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * Generates an RSS 2.0 feed for the Listening to Echoes podcast.
 * Links to audio files in your dedicated Google Cloud Storage bucket.
 */
export async function GET() {
  const { db } = initializeFirebase();
  const storiesRef = collection(db, 'stories');
  
  // Fetch approved stories that have an audio URL
  const q = query(
    storiesRef,
    where('status', '==', 'approved'),
    orderBy('submittedAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const items = querySnapshot.docs.filter(doc => !!doc.data().audioUrl).map(doc => {
    const data = doc.data();
    
    // Construct the full URL for your bucket
    const fullAudioUrl = data.audioUrl.startsWith('http') 
      ? data.audioUrl 
      : `https://storage.googleapis.com/${firebaseConfig.audioBucketId}/${data.audioUrl}`;

    return `
      <item>
        <title><![CDATA[${data.title}]]></title>
        <description><![CDATA[${data.content}]]></description>
        <pubDate>${new Date(data.submittedAt).toUTCString()}</pubDate>
        <link>https://listening-to-echoes.web.app/archive</link>
        <guid isPermaLink="false">${doc.id}</guid>
        <enclosure url="${fullAudioUrl}" length="0" type="audio/mpeg" />
        <itunes:author>Listening to Echoes</itunes:author>
        <itunes:summary><![CDATA[${data.content}]]></itunes:summary>
      </item>
    `;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" 
      xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" 
      xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>Listening to Echoes</title>
        <description>A qualitative repository of educational experiences, accomplishments, and tribulations.</description>
        <link>https://listening-to-echoes.web.app</link>
        <language>en-us</language>
        <itunes:author>David Raghanti</itunes:author>
        <itunes:type>episodic</itunes:type>
        <itunes:owner>
          <itunes:name>David Raghanti</itunes:name>
          <itunes:email>davidraghanti@gmail.com</itunes:email>
        </itunes:owner>
        <itunes:image href="https://listening-to-echoes.web.app/logo-large.png" />
        <itunes:category text="Education" />
        ${items}
      </channel>
    </rss>
  `;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
