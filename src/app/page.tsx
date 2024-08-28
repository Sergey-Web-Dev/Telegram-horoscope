"use client";

import { useEffect, useState } from "react";
import { horoscopes } from "./cards/data_horoscope";
import HoroscopeCard from "./cards/horoscopeCard";

const Home = () => {
  const [horoscope, setHoroscope] = useState<string>("");
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;

      if (selectedSign) {
        // Show the Telegram back button when a sign is selected
        telegram.BackButton.show();

        // Handle back button press
        telegram.onEvent("backButtonClicked", () => {
          setSelectedSign(null);
          telegram.BackButton.hide();
        });
      } else {
        // Hide the Telegram back button on the home screen
        telegram.BackButton.hide();
      }

      return () => {
        telegram.offEvent("backButtonClicked"); // Cleanup listener when the component unmounts or selectedSign changes
      };
    } else {
      console.error("Telegram WebApp is not available.");
    }
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
  }, [selectedSign]);
  return (
    <div style={{ textAlign: "center" }}>
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

          <p className="mt-12">{loading ? "Loading..." : horoscope}</p>
          <button className="mt-6" onClick={() => setSelectedSign(null)}>
            Back
          </button>
        </div>
      ) : (
        <>
          <h1 className="uppercase text-lg font-semibold m-8">
            Choose your Sign:
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
            Close App
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
