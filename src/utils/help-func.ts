export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const generateNameFromEmail = (email: string) => {
  const localPart = email.split('@')[0]
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
}
