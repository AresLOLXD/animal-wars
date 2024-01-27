import { TimerState } from "@store/defaultStore";
import { syncStore } from "@store/index";
import { useEffect, useSyncExternalStore } from "react";
import { Outlet } from "react-router-dom";
import BarraProbabilidad from "./minijuego/components/BarraProbabilidad";
export default function () {
    const timerMax = useSyncExternalStore(
        ...syncStore<number>("timerTiempoMaximo")
    );
    const timerState = useSyncExternalStore(...syncStore<string>("timerState"));

    useEffect(() => {
        let interval: any;

        if (timerState === TimerState.Active) {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [timerState, timerMax]);

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
