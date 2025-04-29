import { getBlogPosts } from 'app/post/utils'

export const baseUrl = 'https://stoic-park.vercel.app'

export default async function sitemap() {
 let blogs = getBlogPosts().map((post) => ({
  url: `${baseUrl}/post/${post.slug}`,
  lastModified: post.metadata.publishedAt,
 }))

 // '', 홈라우트 제거
 let routes = ['/post'].map((route) => ({
  url: `${baseUrl}${route}`,
  lastModified: new Date().toISOString().split('T')[0],
 }))

 return [...routes, ...blogs]
}
