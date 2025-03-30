import { BlogPosts } from 'app/components/posts'
//TODO: home -> post로 변경, home 삭제!
export default function Page() {
  return (
    <section>
      {/* <p>4년차, 코드와 사람을 잇는 프론트엔드 개발자 박성택입니다.</p>
      <br />
      <p>
        단순한 개발을 넘어, 함께하는 사람들과 소통을 중심으로 보다 나은 결과를
        향해 나아가고 싶습니다
      </p> */}
      <div className="my-8">
        <div className="mb-2">최신 포스트</div>
        <BlogPosts />
      </div>
    </section>
  )
}
