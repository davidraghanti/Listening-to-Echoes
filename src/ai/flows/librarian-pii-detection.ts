'use server';
/**
 * @fileOverview This file implements a Genkit flow for detecting Personally Identifiable Information (PII)
 * in submitted stories, to help librarians identify and redact sensitive information.
 *
 * - detectPiiInStory - A function that handles the PII detection process.
 * - LibrarianPiiDetectionInput - The input type for the detectPiiInStory function.
 * - LibrarianPiiDetectionOutput - The return type for the detectPiiInStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PiiDetailSchema = z.object({
  type: z.enum(['NAME', 'LOCATION', 'DATE', 'OTHER']).describe('The type of PII detected.'),
  value: z.string().describe('The detected PII string.'),
});

const LibrarianPiiDetectionInputSchema = z.object({
  storyText: z.string().describe('The text of the submitted story to scan for PII.'),
});
export type LibrarianPiiDetectionInput = z.infer<typeof LibrarianPiiDetectionInputSchema>;

const LibrarianPiiDetectionOutputSchema = z.object({
  hasPii: z.boolean().describe('Whether potentially revealing personal details were found in the story.'),
  detectedPii: z.array(PiiDetailSchema).describe('A list of detected PII instances.'),
});
export type LibrarianPiiDetectionOutput = z.infer<typeof LibrarianPiiDetectionOutputSchema>;

export async function detectPiiInStory(input: LibrarianPiiDetectionInput): Promise<LibrarianPiiDetectionOutput> {
  return librarianPiiDetectionFlow(input);
}

const piiDetectionPrompt = ai.definePrompt({
  name: 'piiDetectionPrompt',
  input: {schema: LibrarianPiiDetectionInputSchema},
  output: {schema: LibrarianPiiDetectionOutputSchema},
  prompt: `You are an AI assistant tasked with detecting Personally Identifiable Information (PII) in submitted stories.
Your goal is to identify names, specific locations, dates, and any other details that could potentially reveal personal information about individuals mentioned in the story.
Analyze the following story text and identify any potential PII. Ensure you adhere strictly to the output JSON format.

Output a JSON object with a 'hasPii' boolean indicating if any PII was found, and a 'detectedPii' array listing each detected PII instance with its 'type' (NAME, LOCATION, DATE, OTHER) and 'value'. If no PII is found, 'hasPii' should be false and 'detectedPii' should be an empty array.

Story:
{{{storyText}}}`,
});

const librarianPiiDetectionFlow = ai.defineFlow(
  {
    name: 'librarianPiiDetectionFlow',
    inputSchema: LibrarianPiiDetectionInputSchema,
    outputSchema: LibrarianPiiDetectionOutputSchema,
  },
  async (input) => {
    const {output} = await piiDetectionPrompt(input);
    return output!;
  }
);
