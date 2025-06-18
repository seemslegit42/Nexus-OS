'use server';
/**
 * @fileOverview Generates a brief insight for a given sales lead.
 *
 * - generateLeadInsight - A function that analyzes lead name and email to provide an insight.
 * - GenerateLeadInsightInput - The input type for the generateLeadInsight function.
 * - GenerateLeadInsightOutput - The return type for the generateLeadInsight function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLeadInsightInputSchema = z.object({
  name: z.string().describe('The name of the sales lead.'),
  email: z.string().email().describe('The email address of the sales lead.'),
});
export type GenerateLeadInsightInput = z.infer<
  typeof GenerateLeadInsightInputSchema
>;

const GenerateLeadInsightOutputSchema = z.object({
  insight: z
    .string()
    .describe('A short, actionable insight or suggestion about the lead.'),
});
export type GenerateLeadInsightOutput = z.infer<
  typeof GenerateLeadInsightOutputSchema
>;

export async function generateLeadInsight(
  input: GenerateLeadInsightInput
): Promise<GenerateLeadInsightOutput> {
  return generateLeadInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLeadInsightPrompt',
  input: { schema: GenerateLeadInsightInputSchema },
  output: { schema: GenerateLeadInsightOutputSchema },
  prompt: `You are a helpful sales assistant AI. Given a lead's name and email, provide a concise (1-2 sentences) and actionable insight or suggestion. 
Focus on potential industry, company size if inferable from email domain, or general engagement tips. Avoid making definitive statements if information is scarce.

Lead Name: {{{name}}}
Lead Email: {{{email}}}

Insight:`,
});

const generateLeadInsightFlow = ai.defineFlow(
  {
    name: 'generateLeadInsightFlow',
    inputSchema: GenerateLeadInsightInputSchema,
    outputSchema: GenerateLeadInsightOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('No output received from the AI model for lead insight.');
    }
    return output;
  }
);
