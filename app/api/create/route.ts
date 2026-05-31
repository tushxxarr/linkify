import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { targetUrl, customPath, password, expiresInSeconds } = await req.json();

    // 1. Direct Password Check against Env Variable (No Hashing)
    if (password !== process.env.PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized: Incorrect Password' }, { status: 401 });
    }

    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    // 2. Generate or use custom string
    const shortId = customPath || nanoid(6); 
    const key = `link:${shortId}`;

    // 3. Check if link already exists
    const exists = await kv.exists(key);
    if (exists) {
      return NextResponse.json({ error: 'This custom link is already in use.' }, { status: 400 });
    }

    // 4. Save to Vercel KV with optional expiration
    if (expiresInSeconds && expiresInSeconds > 0) {
      // Set with expiration (Manual set of time)
      await kv.set(key, targetUrl, { ex: expiresInSeconds });
    } else {
      // Valid for lifetime (until you manually delete it)
      await kv.set(key, targetUrl);
    }

    return NextResponse.json({ success: true, shortUrl: `/${shortId}` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
