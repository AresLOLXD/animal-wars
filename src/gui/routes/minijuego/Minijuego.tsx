import { game } from "@phaser/index";
import { BarResult, BarState } from "@store/defaultStore";
import { setStore, syncStore } from "@store/index";
import { motion } from "framer-motion";
import { useEffect, useSyncExternalStore } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BarraProbabilidad, { barWidth } from "./components/BarraProbabilidad";
import useGameTimer from "./hooks/useGameTimer";

function BarraP1() {
    const p1Score = useSyncExternalStore(...syncStore<number>("p1Score"));
    const p1BarState = useSyncExternalStore(
        ...syncStore<BarState>("p1BarState")
    );

    return (
        <BarraProbabilidad
            score={p1Score}
            state={p1BarState}
            handleChange={(probabilidades, controls) => (latest) => {
                if (p1BarState === BarState.Stop) {
                    controls.stop();

                    const [critico, fallo, acierto] = probabilidades.current;

                    let resultado: BarResult = BarResult.Critico;
                    const positionCritico = barWidth * critico;
                    const positionFallo = barWidth * fallo;
                    const positionAcierto = barWidth * acierto;

                    const primerCritico = positionCritico;
                    const primerFallo = positionFallo + primerCritico;
                    const primerAcierto = positionAcierto + primerFallo;
                    const segundoFallo = positionFallo + primerAcierto;

                    // console.log(
                    //     "RESULTADO",
                    //     latest,
                    //     primerCritico,
                    //     primerFallo,
                    //     primerAcierto,
                    //     segundoFallo
                    // );

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

                    setStore("p1BarResult", resultado);
                    setStore("p1BarState", BarState.Result);
                }
            }}
        />
    );
}

function BarraP2() {
    const p2Score = useSyncExternalStore(...syncStore<number>("p2Score"));
    const p2BarState = useSyncExternalStore(
        ...syncStore<BarState>("p2BarState")
    );

    return (
        <BarraProbabilidad
            reverse
            score={p2Score}
            state={p2BarState}
            handleChange={(probabilidades, controls) => (latest) => {
                if (p2BarState === BarState.Stop) {
                    controls.stop();

                    const [critico, fallo, acierto] = probabilidades.current;

                    let resultado: BarResult = BarResult.Critico;
                    const positionCritico = -barWidth * critico;
                    const positionFallo = -barWidth * fallo;
                    const positionAcierto = -barWidth * acierto;

                    const primerCritico = positionCritico;
                    const primerFallo = positionFallo + primerCritico;
                    const primerAcierto = positionAcierto + primerFallo;
                    const segundoFallo = positionFallo + primerAcierto;

                    // console.log(
                    //     "RESULTADO",
                    //     latest,
                    //     primerCritico,
                    //     primerFallo,
                    //     primerAcierto,
                    //     segundoFallo
                    // );

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

                    setStore("p2BarResult", resultado);
                    setStore("p2BarState", BarState.Result);
                }
            }}
        />
    );
}

function Timer() {
    const { timerValue } = useGameTimer();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "end",
            }}
        >
            <motion.div
                style={{
                    position: "relative",
                    borderRadius: "1.2rem",
                    fontFamily: "Sancreek",
                    fontSize: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                }}
            >
                <motion.div
                    style={{
                        padding: "0.6rem",
                        borderRadius: "inherit",
                        position: "relative",
                        zIndex: 3,
                        background: "#E8000E",
                        boxShadow: "2px 2px 2px 2px #BDA800",
                    }}
                >
                    <motion.div
                        style={{
                            background: "#FDED6E",
                            padding: "0.5rem 2rem",
                            borderRadius: "1rem",
                            color: "#552B29",
                        }}
                    >
                        {(timerValue / 1000).toFixed(2).padStart(5, "0")}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function () {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            game.scene.getScenes(true).forEach((scene) => {
                if (!["SimonSays"].includes(scene.scene.key)) {
                    navigate("/");
                }
            });
        }, 200);
    }, []);

    return (
        <motion.div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
            }}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: {
                    delay: 0.2,
                },
            }}
        >
            <Timer />
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
                <BarraP1 />
                <BarraP2 />
            </div>
        </motion.div>
    );
}
