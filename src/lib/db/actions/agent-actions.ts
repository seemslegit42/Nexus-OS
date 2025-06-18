// src/lib/db/actions/agent-actions.ts
'use server';

import { db } from '@/lib/db';
import { deployedAgentInstances } from '@/lib/db/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const DeployAgentSchema = z.object({
  marketplaceAgentId: z.string().min(1, 'Marketplace Agent ID is required.'),
  instanceName: z.string().min(1, 'Instance name is required.'),
  instanceDescription: z.string().optional(),
  // In a real app, this would come from the authenticated user session
  userId: z
    .number()
    .int()
    .positive('User ID must be a positive integer.')
    .default(1),
  config: z.record(z.any()).optional().default({}), // Placeholder for config
});

export type DeployAgentInput = z.infer<typeof DeployAgentSchema>;

export interface DeployAgentResult {
  success: boolean;
  message?: string;
  instanceId?: number;
}

export async function deployAgentInstance(
  input: DeployAgentInput
): Promise<DeployAgentResult> {
  try {
    const validatedInput = DeployAgentSchema.safeParse(input);
    if (!validatedInput.success) {
      return {
        success: false,
        message: validatedInput.error.flatten().fieldErrors.toString(),
      };
    }

    const {
      marketplaceAgentId,
      instanceName,
      instanceDescription,
      userId,
      config,
    } = validatedInput.data;

    const newInstance = await db
      .insert(deployedAgentInstances)
      .values({
        userId: userId, // Placeholder: Replace with actual authenticated user ID
        marketplaceAgentId: marketplaceAgentId,
        instanceName: instanceName,
        // For the description, we don't have a dedicated column, so it could go into metadata or config
        // For simplicity, let's assume config might hold it or it's just for the UI for now
        // Let's add it to metadata for now if it exists
        metadata: instanceDescription
          ? { description: instanceDescription }
          : undefined,
        config: config,
        status: 'pending_config', // Default status
      })
      .returning({ id: deployedAgentInstances.id });

    if (newInstance && newInstance.length > 0) {
      // Revalidate paths that might display this new data
      revalidatePath('/agents'); // User's agent console
      revalidatePath(`/explore/agents/${marketplaceAgentId}`); // Agent detail page might change its "Deploy" button state if it checks DB

      return {
        success: true,
        instanceId: newInstance[0].id,
        message: 'Agent instance deployment initiated.',
      };
    } else {
      return {
        success: false,
        message: 'Failed to create agent instance in the database.',
      };
    }
  } catch (error) {
    console.error('Error deploying agent instance:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred during deployment.';
    return { success: false, message: `Database error: ${errorMessage}` };
  }
}
