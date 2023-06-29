import Routes from "./routes/routes";

import "./root.component.css";

const style = {
  display: "flex",
};

export default function RootComponent(props: any) {
  return (
    <div style={style}>
      <Routes />
    </div>
  );
}
