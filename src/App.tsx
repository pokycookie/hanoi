import {
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Counter from "./counter";
import { hanoi, IMove, TZone } from "./hanoi";
import Ring from "./ring";
import "./scss/app.scss";

const A = 0;
const B = 1;
const C = 2;

export interface IRing {
  size: number;
  floor: number;
  tower: TZone;
}

function App() {
  const [count, setCount] = useState(1);
  const [ringData, setRingData] = useState<IRing[]>([]);
  const [pathData, setPathData] = useState<IMove[]>([]);
  const [width, setWidth] = useState(0);
  const [step, setStep] = useState(0);
  const [start, setStart] = useState<TZone>(A);
  const [end, setEnd] = useState<TZone>(C);

  const tower = useRef<HTMLDivElement>(null);

  const countHandler = (value: number) => {
    setCount(value);
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
    const via = [A, B, C].filter((e) => e !== start && e !== end);
    const result = hanoi(count, start, end, via[0] as TZone);
    setPathData(result);
    console.log(result);
    const tempArr: IRing[] = [];
    for (let i = 0; i < count; i++) {
      tempArr.push({ size: i, floor: i, tower: start });
    }
    setRingData(tempArr);
    setStep(0);
  }, [count, start, end]);

  return (
    <div className="App">
      <div className="tip">
        <FontAwesomeIcon icon={faCircleInfo} />
        <p>마우스 스크롤을 이용해 진행상황을 빠르게 넘길 수 있습니다.</p>
      </div>
      <div className="info">
        <p>Tower of Hanoi</p>
        <ul>
          <li>타워의 가장 위에 있는 원반만 옮길 수 있다.</li>
          <li>한 번에 하나의 원반만 옮길 수 있다.</li>
          <li>자신보다 작은 원반 위로는 이동할 수 없다.</li>
        </ul>
      </div>
      <div className="controller">
        <div className="left">
          <p className="label">링의 개수: </p>
          <Counter min={1} max={17} onChange={(value) => countHandler(value)} />
        </div>
        <div className="right">
          <select value={start} onChange={(e) => setStart(parseInt(e.target.value) as TZone)}>
            {[0, 1, 2]
              .filter((element) => element !== end)
              .map((element) => {
                return (
                  <option key={element} value={element}>
                    {["A", "B", "C"][element]}
                  </option>
                );
              })}
          </select>
          <FontAwesomeIcon className="icon" icon={faAngleDoubleRight} />
          <select value={end} onChange={(e) => setEnd(parseInt(e.target.value) as TZone)}>
            {[0, 1, 2]
              .filter((element) => element !== start)
              .map((element) => {
                return (
                  <option key={element} value={element}>
                    {["A", "B", "C"][element]}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div className="towerArea" ref={tower} onWheel={wheelHandler}>
        <div className="area A"></div>
        <div className="area B"></div>
        <div className="area C"></div>
        {ringData.map((element, index) => {
          return <Ring key={index} width={width} data={element} count={count} />;
        })}
      </div>
      <div className="stepController">
        <button onClick={prevHandler}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <p>
          {step}/{pathData.length}
        </p>
        <button onClick={nextHandler}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
}

export default App;

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
