import { TimerState } from "@store/defaultStore";
import { setStore, syncStore } from "@store/index";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Outlet } from "react-router-dom";
import BarraProbabilidad from "./minijuego/components/BarraProbabilidad";
export default function () {
    const timerMax = useSyncExternalStore(
        ...syncStore<number>("timerTiempoMaximo")
    );
    const timerState = useSyncExternalStore(...syncStore<string>("timerState"));
    const [timerValue, setTimerValue] = useState(0);
    const interval = useRef<any>(-1);

    useEffect(() => {
        if (timerState === TimerState.Start) {
            setStore("timerState", TimerState.Active);
            setTimerValue(timerMax);
            interval.current = setInterval(() => {
                setTimerValue((v) => {
                    const newVal = v - 100;

                    if (v <= 100) {
                        clearInterval(interval.current);
                        setTimeout(() => {
                            setStore("timerState", TimerState.Stop);
                        }, 80);
                    }

                    return newVal;
                });
            }, 100);
        }

        return () => {};
    }, [timerState]);

    useEffect(() => {
        return () => {
            clearInterval(interval.current);
        };
    }, []);

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
