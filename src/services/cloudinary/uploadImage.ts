import { sha1Hex } from './sha1'

export type CloudinaryUploadResponse = {
  secure_url: string
  url: string
  public_id: string
  format: string
  width: number
  height: number
  bytes: number
}

export type UploadImageOptions = {
  /** Cloudinary folder, e.g. `maar/proofs` */
  folder?: string
  /** Override upload preset (unsigned uploads) */
  uploadPreset?: string
}

function getCloudinaryConfig() {
  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME
  const apiKey = import.meta.env.CLOUDINARY_API_KEY
  const apiSecret = import.meta.env.CLOUDINARY_API_SECRET
  const uploadPreset = import.meta.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName) {
    throw new Error(
      'Missing CLOUDINARY_CLOUD_NAME in .env. Add your Cloudinary cloud name.',
    )
  }

  return { cloudName, apiKey, apiSecret, uploadPreset }
}

function buildSignature(
  params: Record<string, string | number>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return sha1Hex(toSign + apiSecret)
}

function parseCloudinaryError(body: unknown): string {
  if (
    body &&
    typeof body === 'object' &&
    'error' in body &&
    body.error &&
    typeof body.error === 'object' &&
    'message' in body.error &&
    typeof body.error.message === 'string'
  ) {
    return body.error.message
  }
  return 'Cloudinary upload failed'
}

/**
 * Uploads an image file to Cloudinary and returns the HTTPS URL (`secure_url`).
 *
 * Uses an unsigned upload preset when `CLOUDINARY_UPLOAD_PRESET` is set.
 * Otherwise signs the request with `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`.
 *
 * Prefer an unsigned preset in production so the API secret stays off the client.
 */
export async function uploadImageToCloudinary(
  file: File,
  options: UploadImageOptions = {},
): Promise<string> {
  const { cloudName, apiKey, apiSecret, uploadPreset } = getCloudinaryConfig()
  const preset = options.uploadPreset ?? uploadPreset

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const form = new FormData()
  form.append('file', file)

  if (preset) {
    form.append('upload_preset', preset)
    if (options.folder) form.append('folder', options.folder)
  } else {
    if (!apiKey || !apiSecret) {
      throw new Error(
        'Set CLOUDINARY_UPLOAD_PRESET (unsigned) or CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.',
      )
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const signParams: Record<string, string | number> = { timestamp }
    if (options.folder) signParams.folder = options.folder

    form.append('api_key', apiKey)
    form.append('timestamp', String(timestamp))
    form.append('signature', buildSignature(signParams, apiSecret))
    if (options.folder) form.append('folder', options.folder)
  }

  const response = await fetch(endpoint, { method: 'POST', body: form })
  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(parseCloudinaryError(data))
  }

  const result = data as CloudinaryUploadResponse
  if (!result?.secure_url) {
    throw new Error('Cloudinary did not return a secure_url')
  }

  return result.secure_url
}
