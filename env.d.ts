declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      PORT: string
      JWT_SECRET: string;
      JWT_ACCESS_TOKEN_EXPIRATION: string;
      MAX_AGE: number;
      DATABASE_URL: string;
      CLOUDINARY_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
    }
  }
}

export {}
