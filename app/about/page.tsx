import Link from 'next/link'
import { FaGithub, FaInstagram } from 'react-icons/fa'
import { RiNotionFill } from 'react-icons/ri'
import CanvasHeroName from './components/CanvasHeroName'
import AnimatedAccordion from './components/AnimatedAccordion'
import DynamicTextFlow from './components/DynamicTextFlow'

export const metadata = {
 title: 'About',
 description: 'About me.',
}

const accordionSections = [
 {
  title: '원프레딕트 — Frontend Developer (2021.01 - 2024.07)',
  content:
   '신규 프로젝트 개발 및 유지보수를 담당했습니다. 라이브러리를 활용한 대시보드 서비스 개발, 실시간 데이터 기반 보고서 다운로드 기능 개발, i18n을 통한 국제화 서비스 개발, 디자인 시스템 개발, monorepo 개발 환경 구축 등을 경험했습니다.',
  defaultOpen: true,
 },
 {
  title: 'Skills',
  content:
   'TypeScript, JavaScript, React, Next.js, Vue.js, Tailwind CSS, HTML/CSS, Node.js, Git, GitHub Actions, Storybook, Jest, Testing Library, Turborepo, pnpm, Docker, Nginx, Figma',
 },
 {
  title: 'Interests',
  content:
   'AI 기반 개발 도구와 워크플로우 자동화에 관심이 많습니다. 개발 생산성을 높이는 도구를 만들고, 사용자 경험을 개선하는 프론트엔드 기술을 탐구합니다. 최근에는 Claude Code, MCP 서버, 에이전트 기반 개발 환경에 대해 연구하고 있습니다.',
 },
]

export default function Page() {
 return (
  <section className="max-w-2xl mx-auto py-12">
   <div className="space-y-10">
    {/* Hero: Canvas-rendered name with pretext */}
    <div className="border-b pb-8">
     <CanvasHeroName />

     {/* Social Links */}
     <div className="flex gap-6 pt-6">
      <Link
       href="https://github.com/stoic-park"
       title="GitHub"
       target="_blank"
       rel="noopener noreferrer"
       className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
       <FaGithub size={24} />
      </Link>
      <Link
       href="https://mulberry-floss-1f4.notion.site/Frontend-Developer-239032b7629f801ea4cce0cb9cd412cf?source=copy_link"
       title="Resume"
       target="_blank"
       rel="noopener noreferrer"
       className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
       <RiNotionFill size={24} />
      </Link>
      <Link
       href="https://www.instagram.com/lama_meal/"
       title="Instagram"
       target="_blank"
       rel="noopener noreferrer"
       className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
      >
       <FaInstagram size={24} />
      </Link>
     </div>
    </div>

    {/* Bio: Dynamic text flow around profile image */}
    <div>
     <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      About Me
     </h2>
     <DynamicTextFlow />
    </div>

    {/* Experience/Skills: Animated accordion with pretext height calculation */}
    <div>
     <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      Experience & Skills
     </h2>
     <AnimatedAccordion sections={accordionSections} />
    </div>

    {/* Pretext attribution */}
    <p className="text-xs text-gray-400 dark:text-gray-600 text-center pt-4">
     Text layout powered by{' '}
     <Link
      href="https://github.com/chenglou/pretext"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-gray-600 dark:hover:text-gray-400"
     >
      @chenglou/pretext
     </Link>
    </p>
   </div>
  </section>
 )
}
