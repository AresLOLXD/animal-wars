import { TimerState } from "@store/defaultStore";
import { setStore, syncStore } from "@store/index";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export default function () {
    const timerMax = useSyncExternalStore(
        ...syncStore<number>("timerTiempoMaximo")
    );
    const timerState = useSyncExternalStore(...syncStore<string>("timerState"));
    const [timerValue, setTimerValue] = useState(0);
    const interval = useRef<any>(-1);

    useEffect(() => {
        if (timerState === TimerState.Start) {
            (async () => {
                setStore("timerState", TimerState.Active);
                setTimerValue(timerMax);
                setStore("timerValue", timerMax);

                await new Promise((s) => {
                    setTimeout(() => s(null), 2000);
                });

                interval.current = setInterval(() => {
                    setTimerValue((v) => {
                        const newVal = v - 100;

                        if (v <= 100) {
                            clearInterval(interval.current);
                            setTimeout(() => {
                                setStore("timerState", TimerState.Stop);
                            }, 80);

                            setStore("timerValue", newVal);
                            return 0;
                        }

                        setStore("timerValue", newVal);
                        return newVal;
                    });
                }, 100);
            })();
        }

        return () => {};
    }, [timerState]);

    useEffect(() => {
        return () => {
            clearInterval(interval.current);
        };
    }, []);

    return { timerValue };
}
