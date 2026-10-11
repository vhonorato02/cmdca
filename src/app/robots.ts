import type { MetadataRoute } from 'next'

import { absoluteUrl, getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl()

  if (process.env.SITE_INDEXABLE !== 'true') {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.origin,
  }
}
