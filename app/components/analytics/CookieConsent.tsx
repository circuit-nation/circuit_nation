import { useState, useEffect } from "react";
import { initGA4 } from "~/lib/analytics";
import { Button } from "../ui/button";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cookie_consent") === null) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    const ga4Id = import.meta.env.VITE_GA4_ID;
    if (ga4Id) initGA4(ga4Id);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-12 md:bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-cn-line bg-cn-bg px-6 py-4">
        <p className="text-sm text-cn-muted max-w-xl text-center md:text-left">
          We use cookies to understand how you use Circuit Nation and improve
          your experience.{" "}
        </p>
        <div className="flex gap-3 shrink-0 justify-center md:justify-around">
          <Button onClick={decline} variant={"ghost"}>
            Decline
          </Button>
          <Button onClick={accept} variant={"cn-primary"}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
