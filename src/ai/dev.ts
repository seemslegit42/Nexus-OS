
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-prompt-variations.ts';
import '@/ai/flows/explain-security-vulnerability.ts';
import '@/ai/flows/suggest-agent-task.ts';
import '@/ai/flows/suggest-module-improvements.ts';
import '@/ai/flows/summarize-logs.ts';
import '@/ai/flows/generate-lead-insight.ts'; // Added new flow
