import { useEffect, useState } from "react";
import { hanoi } from "./hanoi";
import "./scss/app.scss";

const A = 0;
const B = 1;
const C = 2;

function App() {
  const [count, setCount] = useState(1);
  const [ringData, setRingData] = useState<number[][]>([]);

  const countHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== "") setCount(parseInt(value));
  };

  useEffect(() => {
    const result = hanoi(count, A, C, B);
    console.log(result);
  }, [count]);

  return (
    <div className="App">
      <input type="number" min={1} max={17} value={count} onChange={countHandler} />
    </div>
  );
}

export default App;
