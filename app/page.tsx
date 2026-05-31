'use client';

import { useState } from 'react';

export default function Home() {
  const [password, setPassword] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [expiresIn, setExpiresIn] = useState(''); // in seconds
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        targetUrl,
        customPath,
        expiresInSeconds: expiresIn ? parseInt(expiresIn) : null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      const fullUrl = `${window.location.origin}${data.shortUrl}`;
      setResult(`Success! Your link is: ${fullUrl}`);
    } else {
      setResult(`Error: ${data.error}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold mb-6 text-center">Link Transfer Admin</h1>
        
        <form onSubmit={handleCreateLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Admin Password (Env Var)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. test@123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Redirect Target URL</label>
            <input
              type="url"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/very/long/url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Custom Link String (Optional)</label>
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank for random"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expire In (Seconds - Optional)</label>
            <input
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank for lifetime"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Creating...' : 'Create Transfer Link'}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-sm text-center border break-words">
            {result}
          </div>
        )}
      </div>
    </main>
  );
}
