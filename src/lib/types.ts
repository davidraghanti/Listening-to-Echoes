export type StoryStatus = 'pending' | 'approved' | 'rejected';

export interface Story {
  id: string;
  title: string;
  content: string;
  authorName?: string;
  submittedAt: string;
  status: StoryStatus;
  audioUrl?: string;
  tags: string[];
  piiDetected?: boolean;
  tone: number; // 0 to 100 scale for visual/audio modulation
}

export interface ArchivePost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: 'article' | 'podcast';
  publishedAt: string;
  relatedTags: string[];
  audioUrl?: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  contact: string;
  category: 'Mental Health' | 'Support Groups' | 'Crisis' | 'Academic';
}
