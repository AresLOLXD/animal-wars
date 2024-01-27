import { Outlet } from "react-router-dom";
import BarraProbabilidad from "./components/BarraProbabilidad";
import useGameTimer from "./hooks/useGameTimer";
export default function () {
    const { timerValue } = useGameTimer();

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
            <div>
                {timerValue}
                <Outlet />
            </div>
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
        </div>
    );
}
