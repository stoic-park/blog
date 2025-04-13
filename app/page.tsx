import { BlogPosts } from 'app/components/posts'
//TODO: home -> post로 변경, home 삭제!
export default function Page() {
 return (
  <section>
   <div>
    {/* <div className="mb-8">최신 포스트</div> */}
    <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Latest</h1>
    <BlogPosts />
   </div>
  </section>
 )
}
