"use client";

import { useEffect, useState } from "react";
import { horoscopes } from "./cards/data_horoscope";
import HoroscopeCard from "./cards/horoscopeCard";

const translations: any = {
  en: {
    chooseSign: "Choose your Sign:",
    back: "Back",
    closeApp: "Close App",
    loading: "Loading...",
    horoscopeUnavailable: "Unable to load horoscope.",
    errorLoading: "Error loading horoscope.",
  },
  ru: {
    chooseSign: "Выберите свой знак:",
    back: "Назад",
    closeApp: "Закрыть приложение",
    loading: "Загрузка...",
    horoscopeUnavailable: "Невозможно загрузить гороскоп.",
    errorLoading: "Ошибка загрузки гороскопа.",
  },
};

const availableLanguages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

const Home = () => {
  const [horoscope, setHoroscope] = useState<string>("");
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const userLang =
        window.Telegram.WebApp.initDataUnsafe?.user?.language_code;
      if (userLang && translations[userLang]) {
        setLanguage(userLang);
      }
    }
  }, []);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;

    if (selectedSign && telegram) {
      telegram.BackButton.show();

      telegram.onEvent("backButtonClicked", () => {
        setSelectedSign(null);
        telegram.BackButton.hide();
      });

      const handleSwipe = () => {
        let touchStartX = 0;
        let touchEndX = 0;

        const onTouchStart = (e: any) => {
          touchStartX = e.changedTouches[0].screenX;
        };

        const onTouchMove = (e: any) => {
          touchEndX = e.changedTouches[0].screenX;
        };

        const onTouchEnd = () => {
          if (touchEndX > touchStartX + 50) {
            setSelectedSign(null);
            telegram.BackButton.hide();
          }
        };

        document.addEventListener("touchstart", onTouchStart);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchend", onTouchEnd);

        return () => {
          document.removeEventListener("touchstart", onTouchStart);
          document.removeEventListener("touchmove", onTouchMove);
          document.removeEventListener("touchend", onTouchEnd);
        };
      };

      handleSwipe();
    } else if (telegram) {
      telegram.BackButton.hide();
    }

    return () => {
      telegram?.offEvent("backButtonClicked");
    };
  }, [selectedSign]);

  useEffect(() => {
    if (selectedSign) {
      const fetchHoroscope = async () => {
        setLoading(true);

        try {
          const response = await fetch(`/api?sign=${selectedSign}`);
          const result = await response.json();

          if (result.success) {
            setHoroscope(result.data.horoscope_data);
          } else {
            console.error("Error: Unsuccessful response");
            setHoroscope("Unable to load horoscope.");
          }
        } catch (error) {
          console.error("Error fetching horoscope:", error);
          setHoroscope("Error loading horoscope.");
        }

        setLoading(false);
      };

      fetchHoroscope();
    }
  }, [selectedSign, language]);

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <label htmlFor="language-selector">
          {translations[language].changeLanguage}:{" "}
        </label>
        <select
          id="language-selector"
          value={language}
          onChange={handleLanguageChange}
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      {selectedSign ? (
        <div className="flex flex-col justify-center items-center mx-auto my-12 w-1/2 mb:w-[80%] h-1/2 border-4 rounded-2xl p-12 bg-violet-300">
          <h1 className="uppercase text-lg font-semibold m-8">
            {selectedSign.toUpperCase()}
          </h1>
          <img
            src={`/icons/${selectedSign}.png`}
            alt={`${selectedSign}.png`}
            width={128}
            height={128}
          />

          <p className="mt-12">
            {loading ? translations[language].loading : horoscope}
          </p>
          <button className="mt-6" onClick={() => setSelectedSign(null)}>
            {translations[language].back}
          </button>
        </div>
      ) : (
        <>
          <h1 className="uppercase text-lg font-semibold m-8">
            {translations[language].chooseSign}
          </h1>
          <div className="flex justify-between items-center flex-wrap ">
            {horoscopes.map((sign) => (
              <HoroscopeCard
                key={sign.id}
                name={sign.name}
                icon={sign.icon}
                onClick={() => setSelectedSign(sign.name.toLowerCase())}
              />
            ))}
          </div>
          <button onClick={() => window.Telegram.WebApp.close()}>
            {translations[language].closeApp}
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
