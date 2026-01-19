export type ApiEnv = {
  googleCloudProject: string;
  vertexAiLocation: string;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function getApiEnv(): ApiEnv {
  return {
    googleCloudProject: requireEnv('GOOGLE_CLOUD_PROJECT'),
    vertexAiLocation: process.env.VERTEX_AI_LOCATION ?? 'us-central1',
  };
}


