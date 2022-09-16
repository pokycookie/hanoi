import { IRing } from "./App";
import { getRainbowColor } from "./color";
import "./scss/ring.scss";

interface IProps {
  width: number;
  data: IRing;
  count: number;
}

export default function Ring(props: IProps) {
  const width = props.width / 3;
  const size = 2 * (props.count - props.data.size) - 1;
  const sizeWidth = width / (2 * props.count - 1);

  return (
    <div
      className="ring"
      style={{ width, bottom: props.data.floor * 30, left: props.data.tower * width }}
    >
      <div
        className="element"
        style={{
          backgroundColor: getRainbowColor(props.data.size / props.count),
          width: `${size * sizeWidth}px`,
        }}
      ></div>
    </div>
  );
}
