'use client'

import dynamic from 'next/dynamic'

const FingerprintForm = dynamic(() => import('@/components/fingerprint-form'), {
  ssr: false,
  loading: () => <p className="text-xl">Loading...</p>,
})

export default function Page() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 p-16 font-sans dark:bg-black">
      <FingerprintForm />
    </div>
  )
}
