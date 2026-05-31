import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const key = `link:${id}`;

  try {
    // Look up the target URL in Vercel KV
    const targetUrl: string | null = await kv.get(key);

    if (targetUrl) {
      // Redirect to the pasted link
      return NextResponse.redirect(targetUrl);
    } else {
      // Link expired, closed, or never existed
      return new NextResponse('Link not found or expired', { status: 404 });
    }
  } catch (error) {
    return new NextResponse('Error fetching link', { status: 500 });
  }
}
