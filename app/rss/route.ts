import { baseUrl } from 'app/sitemap'
import { getBlogPosts } from 'app/post/utils'

// baseURL/rss

// RSS (Really Simple Syndication)
// - 웹사이트의 컨텐츠를 쉽게 구독할 수 있게 해주는 표준화된 피드 형식
// - 블로그 포스트, 뉴스 기사, 팟캐스트 등 정기적으로 업데이트되는 컨텐츠에 주로 사용
// - RSS 리더를 통해 여러 사이트의 업데이트된 컨텐츠를 한 곳에서 확인 가능
// - XML 형식을 사용하여 기계가 읽을 수 있는 표준화된 형태로 제공
//
// 주요 태그 설명:
// <channel> - RSS 피드의 웹사이트 정보를 담는 컨테이너
// <item> - 개별 컨텐츠 항목 (예: 블로그 포스트)
// <title> - 제목
// <link> - 원본 컨텐츠 URL
// <description> - 컨텐츠 요약
// <pubDate> - 발행일
// <language> - 피드 언어
// <lastBuildDate> - 피드 마지막 업데이트 시간

export async function GET() {
 let allBlogs = await getBlogPosts()

 const itemsXml = allBlogs
  .sort((a, b) => {
   if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
    return -1
   }
   return 1
  })
  .map(
   (post) =>
    `<item>
          <title>${post.metadata.title}</title>
          <link>${baseUrl}/post/${post.slug}</link>
          <description>${post.metadata.summary || ''}</description>
          <pubDate>${new Date(
           post.metadata.publishedAt,
          ).toUTCString()}</pubDate>
        </item>`,
  )
  .join('\n')

 const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>박성택 개발 블로그</title>
        <link>${baseUrl}</link>
        <description>박성택의 개발 블로그 RSS 피드</description>
        <language>ko-kr</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${itemsXml}
    </channel>
  </rss>`

 return new Response(rssFeed, {
  headers: {
   'Content-Type': 'text/xml',
  },
 })
}
