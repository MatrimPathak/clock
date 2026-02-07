import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const H  = { h: 0,   m: 180 },
      V  = { h: 270, m: 90 },
      TL = { h: 180, m: 270 },
      TR = { h: 0,   m: 270 },
      BL = { h: 180, m: 90 },
      BR = { h: 0,   m: 90 },
      E  = { h: 135, m: 135 };

const digits = [
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  V,  V,  V,
    V,  V,  V,  V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  BL, E,
    TR, BL, V,  E,
    E,  V,  V,  E,
    E,  V,  V,  E,
    BR, TL, TR, BL,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    BR, H,  TL, V,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    E,  BR, TL, V,
    E,  TR, BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, BL, BR, BL,
    V,  V,  V,  V,
    V,  TR, TL, V,
    TR, H,  BL, V,
    E,  E,  V,  V,
    E,  E,  TR, TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    TR, H,  BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, H,  TL,
    V,  TR, H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    TR, H,  BL, V,
    E,  E,  V,  V,
    E,  E,  V,  V,
    E,  E,  V,  V,
    E,  E,  TR, TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  H,  TL,
  ],
  [
    BR, H,  H,  BL,
    V,  BR, BL, V,
    V,  TR, TL, V,
    TR, H,  BL, V,
    BR, H,  TL, V,
    TR, H,  H,  TL,
  ],
];

const normalizeAngle = (next, prev) => {
  const delta = ((next - prev) % 360 + 360) % 360;
  return prev + delta;
};

const getTimeDigits = () => {
  const now = new Date();
  return [
    now.getHours() % 12 || 12,
    now.getMinutes(),
    now.getSeconds()
  ].flatMap((val) => String(val).padStart(2, "0").split("").map(Number));
};

const getHourDigits = () => {
  const now = new Date();
  return [
    now.getHours() % 12 || 12,
  ].flatMap((val) => String(val).padStart(2, "0").split("").map(Number));
};

const getMinuteDigits = () => {
  const now = new Date();
  return [
    now.getMinutes(),
  ].flatMap((val) => String(val).padStart(2, "0").split("").map(Number));
};

const getSecondDigits = () => {
  const now = new Date();
  return [
    now.getSeconds()
  ].flatMap((val) => String(val).padStart(2, "0").split("").map(Number));
};

const randomAngle = () => Math.floor(Math.random() * 360)

const Clock = ({ h, m, initial }) => {
  const prev = useRef({ h: 0, m: 0 });
  const hourAngle = normalizeAngle(h, prev.current.h);
  const minuteAngle = normalizeAngle(m, prev.current.m);
  prev.current = { h: hourAngle, m: minuteAngle };
  
  return (
    <div
      className="clock"
      style={{
        "--hour-angle": initial ? randomAngle() : hourAngle,
        "--minute-angle": initial ? randomAngle() : minuteAngle,
        "--dur": initial ? 1 : 0.4
      }}
    />
  );
};

const App = () => {
  const [time, setTime] = useState(Array(6).fill(0));
  const [hour, setHour] = useState(Array(2).fill(0));
  const [minute, setMinute] = useState(Array(2).fill(0));
  const [second, setSecond] = useState(Array(2).fill(0));
  const [initial, setInitial] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
  const updateTheme = () => {
    const hour = new Date().getHours();
    const dark = hour >= 18 || hour < 6;
    setIsDark(dark);
  };
  updateTheme();
  const interval = setInterval(updateTheme, 60_000);
  return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let updateTimerId;
    const updateTime = () => {
      setTime(getTimeDigits());
      setHour(getHourDigits());
      setMinute(getMinuteDigits());
      setSecond(getSecondDigits());
      const now = Date.now();
      const delay = 1000 - (now % 1000);
      updateTimerId = setTimeout(updateTime, delay);
    };
    
    const initialTimerId = setTimeout(() => {
      setInitial(false)
      updateTime();
    }, 600)
    
    return () => {
      clearTimeout(updateTimerId)
      clearTimeout(initialTimerId)
    };
  }, []);

  return (
  <div className={`app ${isDark ? "dark" : "light"}`}>
    <div className="time">
      <div className="time-row hours">
        {time.slice(0, 2).map((t, i) => (
          <div className="digit" key={`h-${i}`}>
            {digits[t].map(({ h, m }, j) => (
              <Clock key={j} h={h} m={m} initial={initial} />
            ))}
          </div>
        ))}
      </div>
      <div className="time-row minutes">
        {time.slice(2, 4).map((t, i) => (
          <div className="digit" key={`m-${i}`}>
            {digits[t].map(({ h, m }, j) => (
              <Clock key={j} h={h} m={m} initial={initial} />
            ))}
          </div>
        ))}
      </div>
      <div className="time-row seconds">
        {time.slice(4, 6).map((t, i) => (
          <div className="digit" key={`s-${i}`}>
            {digits[t].map(({ h, m }, j) => (
              <Clock key={j} h={h} m={m} initial={initial} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default App;