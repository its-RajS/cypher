export function extractApiKey(apiKey: string): string | null {
  if (!apiKey || !apiKey.startsWith('CYPH_')) {
    return null;
  }

  const parts = apiKey.split('_');
  if (parts.length !== 3 || parts[0] !== 'CYPH') {
    return null;
  }

  const keyId = parts[1];
  if (!/^[a-f-0-9]{32}$/i.test(keyId)) return null;

  return keyId;
};