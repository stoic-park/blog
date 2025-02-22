import { baseUrl } from 'app/sitemap'
import { MetadataRoute } from 'next'

// Robots의 타입 한번 훑어봐
export default function robots() : MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
