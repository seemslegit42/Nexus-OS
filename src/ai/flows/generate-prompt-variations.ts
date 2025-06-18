// src/ai/flows/generate-prompt-variations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating variations of a given prompt.
 *
 * - generatePromptVariations - A function that takes a prompt and generates variations of it.
 * - GeneratePromptVariationsInput - The input type for the generatePromptVariations function.
 * - GeneratePromptVariationsOutput - The output type for the generatePromptVariations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePromptVariationsInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate variations for.'),
  numVariations: z
    .number()
    .min(1)
    .max(5)
    .default(3)
    .describe('The number of prompt variations to generate.'),
});
export type GeneratePromptVariationsInput = z.infer<
  typeof GeneratePromptVariationsInputSchema
>;

const GeneratePromptVariationsOutputSchema = z.object({
  variations: z.array(z.string()).describe('The generated prompt variations.'),
});
export type GeneratePromptVariationsOutput = z.infer<
  typeof GeneratePromptVariationsOutputSchema
>;

export async function generatePromptVariations(
  input: GeneratePromptVariationsInput
): Promise<GeneratePromptVariationsOutput> {
  return generatePromptVariationsFlow(input);
}

const generatePromptVariationsPrompt = ai.definePrompt({
  name: 'generatePromptVariationsPrompt',
  input: { schema: GeneratePromptVariationsInputSchema },
  output: { schema: GeneratePromptVariationsOutputSchema },
  prompt: `You are an AI prompt engineer. Generate {{numVariations}} variations of the following prompt, designed to test different phrasings and approaches. Return the variations in the requested JSON format.

Original Prompt: {{{prompt}}}`,
});

const generatePromptVariationsFlow = ai.defineFlow(
  {
    name: 'generatePromptVariationsFlow',
    inputSchema: GeneratePromptVariationsInputSchema,
    outputSchema: GeneratePromptVariationsOutputSchema,
  },
  async input => {
    const { output } = await generatePromptVariationsPrompt(input);
    return output!;
  }
);
