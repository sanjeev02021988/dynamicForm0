import Form from "./Form";
import FormConfig from "./FormConfig";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Form config={FormConfig} />
    </div>
  );
}
