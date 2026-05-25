import { uploadImageToCloudinary } from '../services/cloudinary'

/** Upload activity proof image to Cloudinary. */
export async function generateProofUrl(file: File): Promise<string> {
  return uploadImageToCloudinary(file, { folder: 'maar/proofs' })
}

/** Upload student/teacher signature image to Cloudinary. */
export async function generateSignatureUrl(file: File): Promise<string> {
  return uploadImageToCloudinary(file, { folder: 'maar/signatures' })
}
