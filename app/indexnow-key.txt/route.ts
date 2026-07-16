/**
 * IndexNow key file endpoint.
 *
 * IndexNow (https://www.indexnow.org/) is a protocol supported by Yandex,
 * Bing, Naver, Sogou and other engines that allows instant URL submission
 * instead of waiting for the crawler to discover new/updated pages.
 *
 * How to set up:
 *   1. Generate a random UUID as your key (e.g. https://www.uuidgenerator.net/)
 *   2. Set the env var:  INDEXNOW_KEY=<your-uuid>
 *   3. Verify the key is live:  https://vv19.com/indexnow-key.txt
 *   4. Run the submission script after each deployment:
 *        node scripts/submit-indexnow.mjs
 *
 * The key file is hosted at /indexnow-key.txt (not /{key}.txt as the default
 * spec suggests) so its location is passed as the `keyLocation` parameter
 * during URL submissions.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return new Response('', { status: 404 });
  }

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Cache for 1 hour — engines only verify occasionally, no need to be fresh every request
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
