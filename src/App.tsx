import { useSyncExternalStore } from "react";
import "./App.css";
import { setStore, syncStore } from "./store";

function App() {
    const test = useSyncExternalStore(...syncStore("test"));

    return (
        <div
            style={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                top: 0,
                left: 0,
            }}
        >
            <p style={{ fontFamily: "Rye" }}>Prueba Rye</p>
            <p style={{ fontFamily: "Sancreek" }}>{test}</p>
            <button
                onClick={() => {
                    setStore("test", `${Math.random()}`);
                }}
            >
                prueba
            </button>
        </div>
    );
}

export default App;
