/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly CLOUDINARY_CLOUD_NAME?: string
  readonly CLOUDINARY_API_KEY?: string
  readonly CLOUDINARY_API_SECRET?: string
  readonly CLOUDINARY_UPLOAD_PRESET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  /** Latest auto-submit payload (debug / extension fallback) */
  __MAAR_AUTO_SUBMIT__?: import('./utils/maarAutoSubmitBridge').MaarAutoSubmitPayload
}
