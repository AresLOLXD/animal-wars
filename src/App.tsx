import Boton from "@gui/Boton";
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
            }}
        >
            <Boton />
        </div>
    );
}

export default App;
