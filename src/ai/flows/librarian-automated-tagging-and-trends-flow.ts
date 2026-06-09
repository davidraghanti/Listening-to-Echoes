'use server';
/**
 * @fileOverview This file defines a Genkit flow for librarians to automate tagging and identify trends in submitted stories.
 *
 * - librarianAutomatedTaggingAndTrends - A function that triggers the AI analysis for story tagging and trend identification.
 * - LibrarianAutomatedTaggingAndTrendsInput - The input type for the flow, containing the story content.
 * - LibrarianAutomatedTaggingAndTrendsOutput - The output type for the flow, containing suggested thematic tags and trending keywords.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LibrarianAutomatedTaggingAndTrendsInputSchema = z.object({
  storyText: z.string().describe('The full text content of the submitted story.'),
});
export type LibrarianAutomatedTaggingAndTrendsInput = z.infer<
  typeof LibrarianAutomatedTaggingAndTrendsInputSchema
>;

const LibrarianAutomatedTaggingAndTrendsOutputSchema = z.object({
  thematicTags: z
    .array(z.string())
    .describe('A list of suggested thematic tags relevant to the story content.'),
  trendingKeywords: z
    .array(z.string())
    .describe('A list of identified trending topics or keywords from the story.'),
});
export type LibrarianAutomatedTaggingAndTrendsOutput = z.infer<
  typeof LibrarianAutomatedTaggingAndTrendsOutputSchema
>;

export async function librarianAutomatedTaggingAndTrends(
  input: LibrarianAutomatedTaggingAndTrendsInput
): Promise<LibrarianAutomatedTaggingAndTrendsOutput> {
  return librarianAutomatedTaggingAndTrendsFlow(input);
}

const analyzeStoryPrompt = ai.definePrompt({
  name: 'analyzeStoryPrompt',
  input: {schema: LibrarianAutomatedTaggingAndTrendsInputSchema},
  output: {schema: LibrarianAutomatedTaggingAndTrendsOutputSchema},
  prompt: `You are an expert archivist and librarian tasked with categorizing and identifying key insights from personal human experience stories related to education.

Your goal is to analyze the provided story and suggest relevant thematic tags and identify emerging trending topics or keywords from its content. Focus on educational experiences, emotional impact, and key themes.

Story: {{{storyText}}}
`,
});

const librarianAutomatedTaggingAndTrendsFlow = ai.defineFlow(
  {
    name: 'librarianAutomatedTaggingAndTrendsFlow',
    inputSchema: LibrarianAutomatedTaggingAndTrendsInputSchema,
    outputSchema: LibrarianAutomatedTaggingAndTrendsOutputSchema,
  },
  async input => {
    const {output} = await analyzeStoryPrompt(input);
    return output!;
  }
);
