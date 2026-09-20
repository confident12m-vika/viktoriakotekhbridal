// Free, no-signup, on-demand translation for user-written text (Lost & Found
// reports). Only called when someone explicitly clicks "Translate", never
// automatically, so there's no ongoing cost or rate-limit risk.
//
// Admin-authored content (articles, jokes, site text) does NOT use this: it's
// written directly by the admin in English and falls back to English for
// other languages, same as before. This utility is only for text that
// visitors themselves typed in whatever language they chose.

export async function translateText(text, targetLang) {
  if (!text) return text
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translation failed')
  const data = await res.json()
  // Response shape: [[[translatedChunk, originalChunk, ...], ...], ...]
  return data[0].map((chunk) => chunk[0]).join('')
}