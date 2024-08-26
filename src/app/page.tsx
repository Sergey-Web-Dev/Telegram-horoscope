"use client";

import { useEffect, useState } from "react";

const Home = () => {
  const [horoscope, setHoroscope] = useState<string>("");
  const [sign, setSign] = useState<string>("aries");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;
      const user = telegram.initDataUnsafe?.user;

      if (user) {
        setSign("aries");
      }
    }
  }, []);

  useEffect(() => {
    if (sign) {
      const fetchHoroscope = async () => {
        try {
          const response = await fetch(`/api?sign=${sign}`);
          const result = await response.json();

          if (result.success) {
            setHoroscope(result.data.horoscope_data);
          } else {
            console.error("Error: Unsuccessful response");
          }
        } catch (error) {
          console.error("Error fetching horoscope:", error);
        }
      };

      fetchHoroscope();
    }
  }, [sign]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Your Daily Horoscope</h1>
      <h2>{sign.toUpperCase()}</h2>
      <p>{horoscope || "Loading..."}</p>{" "}
      <button onClick={() => window.Telegram.WebApp.close()}>Close App</button>
    </div>
  );
};

export default Home;
