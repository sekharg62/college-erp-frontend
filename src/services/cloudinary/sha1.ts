/** SHA-1 hex digest for Cloudinary signed uploads (browser-safe). */
export function sha1Hex(message: string): string {
  const msg = new TextEncoder().encode(message)
  const words: number[] = []
  for (let i = 0; i < msg.length; i++) {
    words[i >> 2] |= msg[i]! << (24 - (i % 4) * 8)
  }
  words[msg.length >> 2] |= 0x80 << (24 - (msg.length % 4) * 8)
  words[(((msg.length + 8) >> 6) + 1) * 16 - 1] = msg.length * 8

  let a = 0x67452301
  let b = 0xefcdab89
  let c = 0x98badcfe
  let d = 0x10325476
  let e = 0xc3d2e1f0

  const rotl = (n: number, s: number) => (n << s) | (n >>> (32 - s))

  for (let i = 0; i < words.length; i += 16) {
    const w = new Array<number>(80)
    for (let t = 0; t < 16; t++) w[t] = words[i + t] ?? 0
    for (let t = 16; t < 80; t++) {
      w[t] = rotl(w[t - 3]! ^ w[t - 8]! ^ w[t - 14]! ^ w[t - 16]!, 1)
    }

    let aa = a
    let bb = b
    let cc = c
    let dd = d
    let ee = e

    for (let t = 0; t < 80; t++) {
      let f: number
      let k: number
      if (t < 20) {
        f = (bb & cc) | (~bb & dd)
        k = 0x5a827999
      } else if (t < 40) {
        f = bb ^ cc ^ dd
        k = 0x6ed9eba1
      } else if (t < 60) {
        f = (bb & cc) | (bb & dd) | (cc & dd)
        k = 0x8f1bbcdc
      } else {
        f = bb ^ cc ^ dd
        k = 0xca62c1d6
      }
      const temp = (rotl(aa, 5) + f + ee + k + w[t]!) >>> 0
      ee = dd
      dd = cc
      cc = rotl(bb, 30) >>> 0
      bb = aa
      aa = temp
    }

    a = (a + aa) >>> 0
    b = (b + bb) >>> 0
    c = (c + cc) >>> 0
    d = (d + dd) >>> 0
    e = (e + ee) >>> 0
  }

  return [a, b, c, d, e]
    .map((n) => n.toString(16).padStart(8, '0'))
    .join('')
}
