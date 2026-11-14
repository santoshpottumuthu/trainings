export function asSafeHttpsUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}
