// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A flow to suggest a task for a new agent based on user profile.
 *
 * - suggestAgentTask - A function that suggests a task for a new agent.
 * - SuggestAgentTaskInput - The input type for the suggestAgentTask function.
 * - SuggestAgentTaskOutput - The return type for the suggestAgentTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAgentTaskInputSchema = z.object({
  userProfile: z
    .string()
    .describe('A description of the user profile, including their skills, interests, and goals.'),
});
export type SuggestAgentTaskInput = z.infer<typeof SuggestAgentTaskInputSchema>;

const SuggestAgentTaskOutputSchema = z.object({
  taskSuggestion: z.string().describe('A suggestion for a task that the agent can perform.'),
  reasoning: z.string().describe('The reasoning behind the task suggestion.'),
});
export type SuggestAgentTaskOutput = z.infer<typeof SuggestAgentTaskOutputSchema>;

export async function suggestAgentTask(input: SuggestAgentTaskInput): Promise<SuggestAgentTaskOutput> {
  return suggestAgentTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAgentTaskPrompt',
  input: {schema: SuggestAgentTaskInputSchema},
  output: {schema: SuggestAgentTaskOutputSchema},
  prompt: `You are an AI task suggestion expert for the NexOS operating system.  A user has just signed up for NexOS and is going through the onboarding wizard.  Based on their user profile, suggest a single task that their first agent can perform. Also explain your reasoning for the task suggestion.

User Profile: {{{userProfile}}}

Task Suggestion (describe the task and provide reasoning for your suggestion):`,
});

const suggestAgentTaskFlow = ai.defineFlow(
  {
    name: 'suggestAgentTaskFlow',
    inputSchema: SuggestAgentTaskInputSchema,
    outputSchema: SuggestAgentTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
