declare global {
  namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {
      PORT?: string;
    }
  }
}

export {};
