// Summarizes system logs using GenAI to provide a quick understanding of system activity and potential issues.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLogsInputSchema = z.object({
  logs: z.string().describe('The system logs to summarize.'),
});
export type SummarizeLogsInput = z.infer<typeof SummarizeLogsInputSchema>;

const SummarizeLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the system logs.'),
});
export type SummarizeLogsOutput = z.infer<typeof SummarizeLogsOutputSchema>;

export async function summarizeLogs(input: SummarizeLogsInput): Promise<SummarizeLogsOutput> {
  return summarizeLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLogsPrompt',
  input: {schema: SummarizeLogsInputSchema},
  output: {schema: SummarizeLogsOutputSchema},
  prompt: `You are an expert system administrator.  Summarize the following logs so that a user can quickly understand system activity and identify potential issues.  Be concise, accurate, and thorough.

Logs:
{{logs}}`,
});

const summarizeLogsFlow = ai.defineFlow(
  {
    name: 'summarizeLogsFlow',
    inputSchema: SummarizeLogsInputSchema,
    outputSchema: SummarizeLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
