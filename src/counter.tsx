import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./scss/counter.scss";

interface IProps {
  min: number;
  max: number;
  step?: number;
  default?: number;
  onChange?: (value: number) => void;
}

export default function Counter(props: IProps) {
  const step = props.step || 1;

  const [value, setValue] = useState(props.default || props.min);

  // On change
  useEffect(() => {
    if (props.onChange) props.onChange(value);
  }, [value, props]);

  const upValue = () => {
    let tempValue = value + step;
    if (tempValue > props.max) {
      tempValue = props.min + (tempValue - props.max) - 1;
    }
    setValue(tempValue);
  };

  const downValue = () => {
    let tempValue = value - step;
    if (tempValue < props.min) {
      tempValue = props.max + (tempValue - props.min) + 1;
    }
    setValue(tempValue);
  };

  const scrollHandler = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      upValue();
    } else {
      downValue();
    }
  };

  return (
    <div className="counter">
      <button onClick={upValue}>
        <FontAwesomeIcon icon={faCaretUp} />
      </button>
      <div className="indicators" onWheel={scrollHandler}>
        <p>{value}</p>
      </div>
      <button onClick={downValue}>
        <FontAwesomeIcon icon={faCaretDown} />
      </button>
    </div>
  );
}
