const MAX_REDIRECTS = 10;
const FETCH_TIMEOUT_MS = 9000;
const TEXT_LIMIT = 3500;

export interface ScrapeResult {
  originalUrl: string;
  finalUrl: string;
  redirectCount: number;
  redirectChain: string[];
  statusCode: number;
  pageTitle: string;
  metaDescription: string;
  pageText: string;
  domainChanged: boolean;
  error: string | null;
}

const PRIVATE_IP = /^https?:\/\/(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i;

function originalDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return url; }
}

function stripHtml(html: string): string {
  return html
    .replace(/<(script|style|head|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractTag(html: string, tag: string): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? stripHtml(m[1]).slice(0, 200) : '';
}

function extractMeta(html: string, name: string): string {
  const m = html.match(
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i') ??
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'),
  );
  return m ? m[1].slice(0, 300) : '';
}

export async function scrapeUrl(rawUrl: string): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    originalUrl: rawUrl,
    finalUrl: rawUrl,
    redirectCount: 0,
    redirectChain: [rawUrl],
    statusCode: 0,
    pageTitle: '',
    metaDescription: '',
    pageText: '',
    domainChanged: false,
    error: null,
  };

  // Block private/local URLs (SSRF prevention)
  if (PRIVATE_IP.test(rawUrl)) {
    result.error = 'Private/local URLs are not allowed';
    return result;
  }

  // Ensure valid URL
  let currentUrl = rawUrl;
  try { new URL(currentUrl); } catch {
    if (!currentUrl.startsWith('http')) currentUrl = 'https://' + currentUrl;
    try { new URL(currentUrl); } catch { result.error = 'Invalid URL'; return result; }
  }
  result.originalUrl = currentUrl;
  result.redirectChain = [currentUrl];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    let response: Response | null = null;

    for (let i = 0; i <= MAX_REDIRECTS; i++) {
      if (PRIVATE_IP.test(currentUrl)) {
        result.error = 'Redirected to private address';
        return result;
      }
      const r = await fetch(currentUrl, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ShieldScanner/1.0; +https://brainhack.sg)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      if (r.status >= 300 && r.status < 400) {
        const location = r.headers.get('location');
        if (!location) { response = r; break; }
        const next = new URL(location, currentUrl).toString();
        currentUrl = next;
        result.redirectChain.push(currentUrl);
        result.redirectCount++;
      } else {
        response = r;
        break;
      }
    }

    if (!response) { result.error = 'Too many redirects'; return result; }

    result.finalUrl = currentUrl;
    result.statusCode = response.status;
    result.domainChanged = originalDomain(result.originalUrl) !== originalDomain(result.finalUrl);

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      result.error = `Non-HTML response (${contentType.split(';')[0]})`;
      return result;
    }

    const html = await response.text();
    result.pageTitle = extractTag(html, 'title');
    result.metaDescription = extractMeta(html, 'description');
    result.pageText = stripHtml(html).slice(0, TEXT_LIMIT);
  } catch (err) {
    result.error = (err as Error).message ?? 'Fetch failed';
  } finally {
    clearTimeout(timer);
  }

  return result;
}
