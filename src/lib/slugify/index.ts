export interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
  strict?: boolean;
  trim?: boolean;
}

export function slugify(input: string, options: SlugifyOptions = {}): string {
  const {
    separator = "-",
    lowercase = true,
    strict = true,
    trim = true,
  } = options;

  if (!input) return "";

  let slug = input;

  // Normalize unicode (é → e)
  slug = slug.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Remove invalid characters
  slug = strict
    ? slug.replace(/[^a-z0-9\s-]/g, "")
    : slug.replace(/[^\w\s-]/g, "");

  // Replace whitespace with separator
  slug = slug.replace(/\s+/g, separator);

  // Collapse multiple separators
  const sepRegex = new RegExp(`${separator}+`, "g");
  slug = slug.replace(sepRegex, separator);

  if (trim) {
    const trimRegex = new RegExp(`^${separator}+|${separator}+$`, "g");
    slug = slug.replace(trimRegex, "");
  }

  return slug;
}
