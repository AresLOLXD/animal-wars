import "@gui/App.css";
import PrimaryButton from "@gui/PrimaryButton";
import "normalize.css/normalize.css";
import { useSyncExternalStore } from "react";
import { syncStore } from "./store";

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
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                backgroundColor: "white",
            }}
        >
            <PrimaryButton>Jugar (2P)</PrimaryButton>
            <button>Prueba externa</button>
        </div>
    );
}

export default App;
