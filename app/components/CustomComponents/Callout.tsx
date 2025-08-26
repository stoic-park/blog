import { ReactNode } from 'react'

export const TipCallout = ({ children }: { children: ReactNode }) => {
 return (
  <div className="bg-green-300/20 dark:bg-green-700/30 border-l-4 border-green-500 rounded-md px-5 pb-5 mb-5 text-neutral-800 dark:text-neutral-200">
   <div className="flex items-center pt-5">
    <span className="font-extrabold">Tip</span>
   </div>
   {children}
  </div>
 )
}

export const NoteCallout = ({ children }: { children: ReactNode }) => {
 return (
  <div className="bg-blue-300/20 dark:bg-blue-700/30 border-l-4 border-blue-500 rounded-md px-5 pb-5 mb-5 text-neutral-800 dark:text-neutral-200">
   <div className="flex items-center pt-5">
    <span className="font-extrabold">Note</span>
   </div>
   {children}
  </div>
 )
}

export const WarningCallout = ({ children }: { children: ReactNode }) => {
 return (
  <div className="bg-yellow-300/20 dark:bg-yellow-700/30 border-l-4 border-yellow-500 rounded-md px-5 pb-5 mb-5 text-neutral-800 dark:text-neutral-200">
   <div className="flex items-center pt-5">
    <span className="font-extrabold">Warning</span>
   </div>
   {children}
  </div>
 )
}

export const ErrorCallout = ({ children }: { children: ReactNode }) => {
 return (
  <div className="bg-red-300/20 dark:bg-red-700/30 border-l-4 border-red-500 rounded-md px-5 pb-5 mb-5 text-neutral-800 dark:text-neutral-200">
   <div className="flex items-center pt-5">
    <span className="font-extrabold">Error</span>
   </div>
   {children}
  </div>
 )
}

export const InfoCallout = ({ children }: { children: ReactNode }) => {
 return (
  <div className="bg-indigo-300/20 dark:bg-indigo-700/30 border-l-4 border-indigo-500 rounded-md px-5 pb-5 mb-5 text-neutral-800 dark:text-neutral-200">
   <div className="flex items-center pt-5">
    <span className="font-extrabold">Info</span>
   </div>
   {children}
  </div>
 )
}
