"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
}

const LanguageContext = createContext<LanguageContextType>({ lang: "en" });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lang: Lang = pathname.startsWith("/ar") ? "ar" : "en";

  useEffect(() => {
    const root = document.documentElement;
    if (lang === "ar") {
      root.setAttribute("dir", "rtl");
      root.setAttribute("lang", "ar");
    } else {
      root.setAttribute("dir", "ltr");
      root.setAttribute("lang", "en");
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
