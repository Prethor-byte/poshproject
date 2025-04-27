import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="m-4 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-xl w-full flex flex-col md:flex-row items-center gap-4 pointer-events-auto">
        <div className="flex-1 text-gray-800 dark:text-gray-200 text-base">
          We use cookies to enhance your experience and analyze site usage. By clicking "Accept", you consent to our use of cookies. Read our <a href="/legal/privacy" className="underline text-primary">Privacy Policy</a>.
        </div>
        <button
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors"
          onClick={acceptCookies}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
