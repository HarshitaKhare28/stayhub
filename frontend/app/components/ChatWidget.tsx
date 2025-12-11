'use client';

import { useState } from 'react';

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/hf/default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: input, parameters: { max_new_tokens: 200 } }),
      });
      const text = await res.text();
      // backend proxies HF raw response; show raw string if JSON parsing fails
      let assistant = '';
      try {
        const json = JSON.parse(text);
        // attempt common shapes
        if (Array.isArray(json) && json[0]?.generated_text) assistant = json[0].generated_text;
        else if (json.generated_text) assistant = json.generated_text;
        else assistant = JSON.stringify(json);
      } catch (e) {
        assistant = text;
      }
      setMessages((m) => [...m, { role: 'assistant', content: assistant }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error contacting chat server.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded shadow-lg p-4 z-50">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border px-3 py-2 rounded" />
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
