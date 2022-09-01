declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      PORT: string
      JWT_SECRET: string;
      JWT_ACCESS_TOKEN_EXPIRATION: string;
      DATABASE_URL: string;
    }
  }
}

export {}
