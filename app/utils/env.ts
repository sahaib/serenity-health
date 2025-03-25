export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const getApiKeys = () => {
  return {
    openrouter: getEnv('OPENROUTER_API_KEY'),
    groq: getEnv('GROQ_API_KEY'),
  };
};

export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; 