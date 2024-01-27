import PrimaryButton from "@gui/PrimaryButton";
import { Outlet } from "react-router-dom";
import BarraProbabilidad from "./minijuego/components/BarraProbabilidad";
export default function () {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <BarraProbabilidad />
                <BarraProbabilidad reverse />
            </div>
            <div>
                <PrimaryButton>Boton</PrimaryButton>
                <Outlet />
            </div>
        </div>
    );
}
