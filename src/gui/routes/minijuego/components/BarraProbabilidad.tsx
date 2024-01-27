import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

export default function ({ reverse }: { reverse?: boolean }) {
    const [barWidth, setBarWidth] = useState(400);
    const [falloCritico, setFalloCritico] = useState(0.2);
    const [fallo, setFallo] = useState(0.5);
    const [acierto, setAcierto] = useState(0.3);
    const [stopBar, setStopBar] = useState(false);

    const x = useMotionValue(0);

    useMotionValueEvent(x, "change", (latest) => {
        if (latest > barWidth / 2) {
            x.stop();
            console.log("STOP", latest);
        }
    });

    useEffect(() => {}, []);

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
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 0.237,
                        ease: "linear",
                    }}
                ></motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        backgroundColor: "tomato",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * falloCritico,
                    }}
                    transition={{ type: "spring" }}
                ></motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        backgroundColor: "steelblue",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * fallo,
                    }}
                    transition={{ type: "spring" }}
                ></motion.div>
                <motion.div
                    style={{
                        height: "100%",
                        width: "30%",
                        backgroundColor: "turquoise",
                        zIndex: 1,
                    }}
                    animate={{
                        width: barWidth * acierto,
                    }}
                    transition={{ type: "spring" }}
                ></motion.div>
            </motion.div>
        </>
    );
}
