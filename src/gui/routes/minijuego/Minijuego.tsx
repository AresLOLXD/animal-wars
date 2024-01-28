import { BarResult, BarState } from "@store/defaultStore";
import { setStore, syncStore } from "@store/index";
import { useSyncExternalStore } from "react";
import { Outlet } from "react-router-dom";
import BarraProbabilidad, { barWidth } from "./components/BarraProbabilidad";
import useGameTimer from "./hooks/useGameTimer";
export default function () {
    const { timerValue } = useGameTimer();

    const p1Score = useSyncExternalStore(...syncStore<number>("p1Score"));
    const p1BarState = useSyncExternalStore(
        ...syncStore<BarState>("p1BarState")
    );
    const p2Score = useSyncExternalStore(...syncStore<number>("p2Score"));
    const p2BarState = useSyncExternalStore(
        ...syncStore<BarState>("p2BarState")
    );

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
                <BarraProbabilidad
                    score={p1Score}
                    state={p1BarState}
                    handleChange={(probabilidades, controls) => (latest) => {
                        if (p1BarState === BarState.Stop) {
                            const [critico, fallo, acierto] =
                                probabilidades.current;

                            let resultado: BarResult = BarResult.Critico;
                            const positionCritico = barWidth * critico;
                            const positionFallo = barWidth * fallo;
                            const positionAcierto = barWidth * acierto;

                            const primerCritico = positionCritico;
                            const primerFallo = positionFallo + primerCritico;
                            const primerAcierto = positionAcierto + primerFallo;
                            const segundoFallo = positionFallo + primerAcierto;

                            if (latest <= primerCritico) {
                                resultado = BarResult.Critico;
                            } else if (latest <= primerFallo) {
                                resultado = BarResult.Fallo;
                            } else if (latest <= primerAcierto) {
                                resultado = BarResult.Acierto;
                            } else if (latest <= segundoFallo) {
                                resultado = BarResult.Fallo;
                            } else {
                                resultado = BarResult.Critico;
                            }

                            controls.stop();
                            setStore("p1BarResult", resultado);
                            setStore("p1BarState", BarState.Result);
                        }
                    }}
                />
                <BarraProbabilidad
                    reverse
                    score={p2Score}
                    state={p2BarState}
                    handleChange={(probabilidades, controls) => (latest) => {
                        if (p2BarState === BarState.Stop) {
                            const [critico, fallo, acierto] =
                                probabilidades.current;

                            let resultado: BarResult = BarResult.Critico;
                            const positionCritico = -barWidth * critico;
                            const positionFallo = -barWidth * fallo;
                            const positionAcierto = -barWidth * acierto;

                            const primerCritico = positionCritico;
                            const primerFallo = positionFallo + primerCritico;
                            const primerAcierto = positionAcierto + primerFallo;
                            const segundoFallo = positionFallo + primerAcierto;

                            if (latest >= primerCritico) {
                                resultado = BarResult.Critico;
                            } else if (latest >= primerFallo) {
                                resultado = BarResult.Fallo;
                            } else if (latest >= primerAcierto) {
                                resultado = BarResult.Acierto;
                            } else if (latest >= segundoFallo) {
                                resultado = BarResult.Fallo;
                            } else {
                                resultado = BarResult.Critico;
                            }

                            controls.stop();
                            setStore("p2BarResult", resultado);
                            setStore("p2BarState", BarState.Result);
                        }
                    }}
                />
            </div>
        </div>
    );
}
