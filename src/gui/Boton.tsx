import { setStore, syncStore } from "@store/index";
import { useSyncExternalStore } from "react";

export default function Boton() {
    const test = useSyncExternalStore(...syncStore("test"));

    return (
        <>
            <p style={{ fontFamily: "Rye" }}>Prueba Rye</p>
            <p style={{ fontFamily: "Sancreek" }}>{test}</p>
            <button
                onClick={() => {
                    setStore("test", `${Math.random()}`);
                }}
            >
                prueba
            </button>
        </>
    );
}
