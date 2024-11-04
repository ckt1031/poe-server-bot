export async function fetchPrompt(url: string) {
  const res = await fetch(url);
  const data = await res.text();
  return data;
}
