import React, { useCallback, useEffect, useRef, useState } from "react";
import { hanoi, IMove, TZone } from "./hanoi";
import Ring from "./ring";
import "./scss/app.scss";

const A = 0;
const B = 1;
const C = 2;

export interface IRing {
  size: number;
  floor: number;
  tower: 0 | 1 | 2;
}

function App() {
  const [count, setCount] = useState(1);
  const [ringData, setRingData] = useState<IRing[]>([]);
  const [pathData, setPathData] = useState<IMove[]>([]);
  const [width, setWidth] = useState(0);
  const [step, setStep] = useState(0);

  const tower = useRef<HTMLDivElement>(null);

  const countHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== "") setCount(parseInt(value));
  };

  const resizeHandler = () => {
    const w = tower.current?.offsetWidth;
    if (w) setWidth(w);
  };

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      prevHandler();
    } else {
      nextHandler();
    }
  };

  const prevHandler = () => {
    const min = 0;
    if (step > min) {
      setStep((prev) => prev - 1);
      const data = pathData[step - 1];
      const temp = [...ringData];
      const ST = getTopOfTower(ringData, data.end);
      const ET = getTopOfTower(ringData, data.start);
      temp[ST.index].tower = data.start;
      temp[ST.index].floor = ET.floor;
      setRingData(temp);
    }
  };
  const nextHandler = () => {
    const max = pathData.length;
    if (step < max) {
      setStep((prev) => prev + 1);
      const data = pathData[step];
      const temp = [...ringData];
      const ST = getTopOfTower(ringData, data.start);
      const ET = getTopOfTower(ringData, data.end);
      temp[ST.index].tower = data.end;
      temp[ST.index].floor = ET.floor;
      setRingData(temp);
    }
  };

  // Use window
  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);
  useEffect(() => {
    resizeHandler();
  }, [tower]);

  // Set pathData
  useEffect(() => {
    const result = hanoi(count, A, C, B);
    setPathData(result);
    const tempArr: IRing[] = [];
    for (let i = 0; i < count; i++) {
      tempArr.push({ size: i, floor: i, tower: A });
    }
    setRingData(tempArr);
    setStep(0);
  }, [count]);

  return (
    <div className="App">
      <Test />
      <input type="number" min={1} max={17} value={count} onChange={countHandler} />
      <div className="towerArea" ref={tower} onWheel={wheelHandler}>
        <div className="area A"></div>
        <div className="area B"></div>
        <div className="area C"></div>
        {ringData.map((element, index) => {
          return <Ring key={index} width={width} data={element} count={count} />;
        })}
      </div>
      <div className="stepController">
        <button onClick={prevHandler}>prev</button>
        <p>
          {step}/{pathData.length}
        </p>
        <button onClick={nextHandler}>next</button>
      </div>
    </div>
  );
}

export default App;

function Test() {
  const ref = useRef<number>(0);
  const [time, setTime] = useState(0);

  const animation = (t: DOMHighResTimeStamp) => {
    if (t < 1000 * 10) {
      setTime(Math.floor(t / 1000));
      ref.current = requestAnimationFrame(animation);
    } else {
      setTime(0);
    }
  };

  useEffect(() => {
    ref.current = requestAnimationFrame(animation);
    return () => cancelAnimationFrame(ref.current);
  });

  return <p>{time}</p>;
}

function getTopOfTower(arr: IRing[], tower: TZone) {
  const sorted = arr.filter((e) => e.tower === tower).sort((prev, next) => next.floor - prev.floor);
  if (sorted.length > 0) {
    const index = arr.findIndex((e) => e.size === sorted[0].size);
    const floor = sorted[0].floor + 1;
    return { index, floor };
  } else {
    const index = 0;
    const floor = 0;
    return { index, floor };
  }
}
