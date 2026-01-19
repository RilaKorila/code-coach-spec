export type WebEnv = {
  apiBaseUrl: string;
};

export function getWebEnv(): WebEnv {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) throw new Error('Missing required env var: API_BASE_URL');
  return { apiBaseUrl };
}


