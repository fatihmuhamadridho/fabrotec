import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Keep this light-weight; in production this can be forwarded to analytics/storage.
  if (process.env.NODE_ENV !== 'production') {
    console.info('[web-vitals]', req.body);
  }

  return res.status(204).end();
}
