/** Simulates uploading a file and returns a proof URL. Replace with real upload API later. */
export async function generateProofUrl(file: File): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  const safeName = encodeURIComponent(file.name.replace(/\s+/g, '-'))
  return `https://example.com/proof/${safeName}-${Date.now()}`
}

/** Simulates uploading a teacher signature image. Replace with real upload API later. */
export async function generateSignatureUrl(file: File): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  const safeName = encodeURIComponent(file.name.replace(/\s+/g, '-'))
  return `https://example.com/signature/${safeName}-${Date.now()}`
}
