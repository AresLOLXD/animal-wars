import { syncStore } from "@store/index";
import { useSyncExternalStore } from "react";
import { Outlet } from "react-router-dom";
import BarraProbabilidad from "./components/BarraProbabilidad";
import useGameTimer from "./hooks/useGameTimer";
export default function () {
    const { timerValue } = useGameTimer();

    const p1Score = useSyncExternalStore(...syncStore<number>("p1Score"));
    const p2Score = useSyncExternalStore(...syncStore<number>("p2Score"));

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
                <BarraProbabilidad score={p1Score} />
                <BarraProbabilidad reverse score={p2Score} />
            </div>
        </div>
    );
}
