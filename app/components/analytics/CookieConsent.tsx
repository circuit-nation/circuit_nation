import { useState, useEffect } from "react"
import { initGA4 } from "~/lib/analytics"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('cookie_consent') === null) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    const ga4Id = import.meta.env.VITE_GA4_ID
    if (ga4Id) initGA4(ga4Id)
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-(--cn-maxw) mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[16px] border border-cn-line bg-cn-bg px-6 py-4">
        <p className="text-sm text-cn-muted max-w-[560px]">
          We use cookies to understand how you use Circuit Nation and improve your experience.{" "}
          <span className="text-cn-text">Microsoft Clarity runs without cookies.</span>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm text-cn-muted hover:text-cn-text transition-colors px-4 py-2"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm font-medium bg-cn-red text-white rounded-full px-5 py-2 hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
