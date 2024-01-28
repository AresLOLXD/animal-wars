import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

const defaultSpeed = 0.2;
export enum DefaultProbs {
    Critico = 50,
    Fallo = 30,
    Acierto = 20,
}

export default function ({
    reverse,
    score,
}: {
    reverse?: boolean;
    score: number;
}) {
    const [barWidth, setBarWidth] = useState(400);
    const [speed, setSpeed] = useState(defaultSpeed + score * 0.015);
    const [[falloCritico, acierto], setProbabilidades] = useState([50, 20]);
    const totalProbabilidades = falloCritico + DefaultProbs.Fallo + acierto;
    const porcentajeFalloCritico = falloCritico / (2 * totalProbabilidades);
    const porcentajeFallo = DefaultProbs.Fallo / (2 * totalProbabilidades);
    const porcentajeAcierto = acierto / totalProbabilidades;

    const x = useMotionValue(0);

    useMotionValueEvent(x, "change", (latest) => {
        if (latest > barWidth / 2) {
            // x.stop();
            // console.log("STOP", latest);
        }
    });

    useEffect(() => {
        if (score <= 3 || score >= -3) {
            if (score < 0) {
                setProbabilidades([
                    DefaultProbs.Critico * ((score - 1) * -1),
                    DefaultProbs.Acierto,
                ]);
                return;
            }

            if (score > 0) {
                setProbabilidades([
                    DefaultProbs.Critico,
                    DefaultProbs.Acierto * (score + 1),
                ]);
                return;
            }

            setProbabilidades([DefaultProbs.Critico, DefaultProbs.Acierto]);
            return;
        }

        console.log("BAR SPEED", defaultSpeed + score * 10);
        const newSpeed = defaultSpeed + score * 10;
        setSpeed(newSpeed <= 0 ? 0.1 : newSpeed);
    }, [score]);

    console.log("BAR SPEED RENDER", defaultSpeed);

    return (
        <>
            <motion.div
                style={{
                    width: barWidth,
                    height: "64px",
                    display: "flex",
                    flexDirection: reverse ? "row-reverse" : "row",
                    position: "relative",
                }}
                animate={{
                    width: barWidth,
                }}
            >
                <motion.div
                    style={{
                        position: "absolute",
                        height: "100%",
                        width: 5,
                        backgroundColor: "black",
                        zIndex: 2,
                        x,
                    }}
                    initial={{
                        x: 0,
                    }}
                    animate={{
                        x: reverse ? -barWidth : barWidth,
                        transition: {
                            duration: speed,
                            repeat: Infinity,
                            type: "tween",
                            repeatType: "reverse",
                            repeatDelay: 0.237,
                            ease: "linear",
                        },
                    }}
                ></motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        backgroundColor: "tomato",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * porcentajeFalloCritico,
                    }}
                    transition={{ type: "spring" }}
                >
                    critico
                </motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        backgroundColor: "steelblue",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * porcentajeFallo,
                    }}
                    transition={{ type: "spring" }}
                >
                    fallo
                </motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        width: "30%",
                        backgroundColor: "turquoise",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * porcentajeAcierto,
                    }}
                    transition={{ type: "spring" }}
                >
                    acierto
                </motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        backgroundColor: "steelblue",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * porcentajeFallo,
                    }}
                    transition={{ type: "spring" }}
                >
                    fallo
                </motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        backgroundColor: "tomato",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * porcentajeFalloCritico,
                    }}
                    transition={{ type: "spring" }}
                >
                    critico
                </motion.div>
            </motion.div>
        </>
    );
}
