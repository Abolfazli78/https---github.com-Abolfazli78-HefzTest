import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://hefztest.ir").replace(/\/+$/, "");
  const now = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${baseUrl}/</loc>
<lastmod>${now}</lastmod>
<changefreq>weekly</changefreq>
<priority>1</priority>
</url>
<url>
<loc>${baseUrl}/about</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/features</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/pricing</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/contact</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/faq</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/demo</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/legal/terms</loc>
<lastmod>${now}</lastmod>
<changefreq>yearly</changefreq>
<priority>0.3</priority>
</url>
<url>
<loc>${baseUrl}/legal/privacy</loc>
<lastmod>${now}</lastmod>
<changefreq>yearly</changefreq>
<priority>0.3</priority>
</url>
<url>
<loc>${baseUrl}/azmoon-online-hifz-quran</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>${baseUrl}/bank-soal-azmoon-hifz</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>${baseUrl}/gozaresh-pishraft-hafizan-quran</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>${baseUrl}/rahnama-azmoon-hifz-quran</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/rahnama-samane-test-hefz</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/hefz-5-joz</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/hefz-10-joz</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/hefz-20-joz</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/hefz-kamel</loc>
<lastmod>${now}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
