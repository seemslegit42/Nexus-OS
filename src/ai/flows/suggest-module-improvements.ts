'use server';

/**
 * @fileOverview A Genkit flow that suggests improvements for module efficiency and security.
 *
 * - suggestModuleImprovements - A function that suggests improvements for module efficiency and security using GenAI.
 * - SuggestModuleImprovementsInput - The input type for the suggestModuleImprovements function.
 * - SuggestModuleImprovementsOutput - The return type for the suggestModuleImprovements function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestModuleImprovementsInputSchema = z.object({
  moduleCode: z.string().describe('The code of the module to be improved.'),
  moduleDescription: z
    .string()
    .optional()
    .describe('A description of what the module does.'),
});
export type SuggestModuleImprovementsInput = z.infer<
  typeof SuggestModuleImprovementsInputSchema
>;

const SuggestModuleImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Suggestions for improving the module, covering efficiency, security, and best practices.'
    ),
});
export type SuggestModuleImprovementsOutput = z.infer<
  typeof SuggestModuleImprovementsOutputSchema
>;

export async function suggestModuleImprovements(
  input: SuggestModuleImprovementsInput
): Promise<SuggestModuleImprovementsOutput> {
  return suggestModuleImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestModuleImprovementsPrompt',
  input: { schema: SuggestModuleImprovementsInputSchema },
  output: { schema: SuggestModuleImprovementsOutputSchema },
  prompt: `You are an AI expert in code optimization and security best practices.

  You will receive a module's code and description (if provided).

  Your goal is to provide suggestions for improving the module's efficiency and security, adhering to the following guidelines:

  - **Efficiency**: Identify potential performance bottlenecks and suggest optimizations.
  - **Security**: Identify potential vulnerabilities and suggest mitigation strategies.
  - **Best Practices**: Ensure the code follows industry best practices for readability, maintainability, and security.

  Module Description: {{{moduleDescription}}}

  Module Code:
  \`\`\`
  {{{moduleCode}}}
  \`\`\`
  `,
});

const suggestModuleImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestModuleImprovementsFlow',
    inputSchema: SuggestModuleImprovementsInputSchema,
    outputSchema: SuggestModuleImprovementsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
