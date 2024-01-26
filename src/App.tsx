import { useState } from "react";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

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
            <p style={{ fontFamily: "Sancreek" }}>Prueba Sancreek</p>
        </div>
    );
}

export default App;
