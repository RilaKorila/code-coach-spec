import { VertexAI } from '@google-cloud/vertexai';

import { getApiEnv } from '../config/env.js';

export type GeneratedQuestion = {
  questionId: string;
  category: string;
  questionText: string;
  answerType: 'free_text' | 'single_choice';
  choices?: string[];
};

export async function generateLearningQuestion(_input: {
  rawPrompt?: string;
  rawCode?: string;
  categoryHint?: string;
}): Promise<GeneratedQuestion> {
  // NOTE(MVP): The real implementation will call Gemini via Vertex AI.
  // We keep a deterministic placeholder here until prompt design is finalized.
  const env = getApiEnv();
  void env;

  // TODO: Implement actual model call.
  return {
    questionId: crypto.randomUUID(),
    category: _input.categoryHint ?? 'code-reading',
    questionText: 'このコードの目的を一言で説明してください。',
    answerType: 'free_text',
  };
}

export function getVertexAiClient(): VertexAI {
  const env = getApiEnv();
  return new VertexAI({ project: env.googleCloudProject, location: env.vertexAiLocation });
}


