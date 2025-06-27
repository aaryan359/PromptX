// utils/streaming.ts
export const streamLLMResponse = async (
  endpoint: string,
  body: object,
  onChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error('Stream failed');

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (reader) {
    const { done, value } = await reader.read();
    if (done) {
      onComplete();
      break;
    }
    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};