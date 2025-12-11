/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production';
  readonly VITE_APP_GOOGLE_ANALYTICS: string;
  readonly VITE_APP_FIREBASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
