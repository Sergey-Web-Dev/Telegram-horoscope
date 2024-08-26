"use client";

import React from "react";
import { useEffect } from "react";

const TelegramSDK = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.ready();
        } else {
          console.error("Telegram WebApp is not available on window.");
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);
  return <>{children}</>;
};

export default TelegramSDK;
