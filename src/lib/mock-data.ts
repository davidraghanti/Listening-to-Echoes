import { Story, ArchivePost, Resource } from './types';

export const INITIAL_STORIES: Story[] = [
  {
    id: '1',
    title: 'The Silent Desk in the Back',
    content: 'In third grade, I felt invisible. The teacher never looked at the back row. This narrative explores the feeling of isolation in early education and how one librarian finally saw me through the books I borrowed.',
    submittedAt: '2024-03-01T10:00:00Z',
    status: 'approved',
    tags: ['isolation', 'elementary school', 'mentorship'],
  },
  {
    id: '2',
    title: 'Calculus and Connection',
    content: 'Failing my first midterm was the best thing that happened to me. It forced me to join a study group that became my lifeline throughout university.',
    submittedAt: '2024-03-05T14:30:00Z',
    status: 'approved',
    tags: ['university', 'failure', 'community'],
  },
  {
    id: 'pending-1',
    title: 'The Lunchroom Divide',
    content: 'My name is John Doe and I lived at 123 Maple St. I remember the high school cafeteria clearly. The social hierarchies were built on where you sat.',
    submittedAt: '2024-03-10T09:00:00Z',
    status: 'pending',
    tags: [],
  }
];

export const ARCHIVE_POSTS: ArchivePost[] = [
  {
    id: 'p1',
    title: 'The Echoes of Isolation',
    excerpt: 'An analysis of recent submissions highlighting a trend in "back-row invisibility" among contemporary learners.',
    content: 'Our archive has seen a 20% increase in stories regarding social isolation in classroom settings...',
    type: 'article',
    publishedAt: '2024-03-12T12:00:00Z',
    relatedTags: ['isolation', 'trends', 'meta-analysis'],
  },
  {
    id: 'p2',
    title: 'Echoes Podcast: Resilience',
    excerpt: 'Episode 12: Listening to the stories of those who turned educational failure into communal success.',
    content: 'Today we discuss the "Calculus and Connection" submission...',
    type: 'podcast',
    publishedAt: '2024-03-15T08:00:00Z',
    relatedTags: ['resilience', 'podcast', 'university'],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  }
];

export const RESOURCES: Resource[] = [
  {
    id: 'r1',
    name: 'National Suicide Prevention Lifeline',
    description: '24/7, free and confidential support for people in distress.',
    contact: '988',
    category: 'Crisis',
  },
  {
    id: 'r2',
    name: 'The Trevor Project',
    description: 'Support for LGBTQ young people.',
    contact: '1-866-488-7386',
    category: 'Mental Health',
  },
  {
    id: 'r3',
    name: 'NAMI HelpLine',
    description: 'Information, resource referrals and support to people living with a mental health condition.',
    contact: '1-800-950-NAMI',
    category: 'Support Groups',
  }
];