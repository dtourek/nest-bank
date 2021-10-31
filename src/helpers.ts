type EnvironmentVariables = 'PORT' | 'DB_HOST' | 'DB_PORT' | 'DB_USERNAME' | 'DB_PASSWORD' | 'DB_SYNCHRONIZE' | 'JWT_SECRET';

export const getEnvironmentVariable = (name: EnvironmentVariables): string | undefined => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} not set!`);
  }
  return value;
};
