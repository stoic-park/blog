import Link from 'next/link'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa' // Font Awesome icons
import { RiNotionFill } from 'react-icons/ri'

export const metadata = {
 title: 'About',
 description: 'About me.',
}

export default function Page() {
 return (
  <section className="max-w-2xl mx-auto py-12">
   <div className="space-y-8">
    {/* Header Section */}
    <div className="border-b pb-8 text-center">
     <h1 className="text-4xl font-bold tracking-tight mb-4">박성택</h1>
     <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
      프론트엔드 개발자
     </p>
     {/* Social Links */}
     <div className="flex justify-center gap-6 pt-4">
      <Link
       href="https://github.com/stoic-park"
       title="github"
       target="_blank"
       rel="noopener noreferrer"
       className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
       <FaGithub size={28} />
      </Link>
      <Link
       href="https://mulberry-floss-1f4.notion.site/Frontend-Developer-1f6032b7629f80269864ccdfa5e054fb?source=copy_link"
       title="resume"
       target="_blank"
       rel="noopener noreferrer"
       className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
       <RiNotionFill size={28} />
      </Link>
      {/* <Link
       href="https://www.linkedin.com/in/sungtaek-park-8734341a8/"
       title="linkedIn"
       target="_blank"
       rel="noopener noreferrer"
       className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
       <FaLinkedin size={28} />
      </Link> */}
      <Link
       href="https://www.instagram.com/lama_meal/"
       title="linkedIn"
       target="_blank"
       rel="noopener noreferrer"
       className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
       <FaInstagram size={28} />
      </Link>
     </div>
    </div>

    {/* Experience Section */}
    <div className="space-y-12">
     <div>
      <h2 className="text-2xl font-bold mb-8">Work Experience</h2>
      <div className="space-y-6">
       <div className="group">
        <div className="mb-4">
         <div>
          <h3 className="text-xl font-semibold">
           원프레딕트, Frontend Developer
          </h3>
         </div>
         <span className="text-sm text-gray-500">2021.01 - 2024.07</span>
        </div>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
         <p>- 신규 프로젝트 개발 및 유지보수</p>
         <p>
          - 라이브러리를 활용한 <strong>대시보드 서비스</strong> 개발
         </p>
         <p>
          - 실시간 데이터기반 <strong>보고서 다운로드</strong> 기능 개발
         </p>
         <p>
          - <strong>i18n</strong>을 통한 국제화 서비스 개발 경험
         </p>
         <p>
          - <strong>디자인 시스템</strong> 개발 경험
         </p>
         <p>
          - <strong>monorepo</strong> 개발 환경 경험
         </p>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </section>
 )
}
