import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import "./PrimaryButton.css";

export default function PrimaryButton({
    children: label,
}: PropsWithChildren<{}>) {
    return (
        <motion.div
            style={{
                position: "relative",
                borderRadius: "1.2rem",
                fontFamily: "Sancreek",
            }}
        >
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "#000",
                    borderRadius: "inherit",
                    // transform: "translate(0.5rem, 0.5rem)",
                    zIndex: 1,
                }}
            ></motion.div>
            <motion.div
                style={{
                    background: "red",
                    padding: "1rem",
                    borderRadius: "inherit",
                    position: "relative",
                    zIndex: 3,
                    outline: "solid 1px black",
                }}
            >
                <motion.div
                    style={{
                        background: "#D4B20B",
                        padding: "1rem 4rem",
                        borderRadius: "1rem",
                        outline: "solid 1px black",
                    }}
                >
                    {label}
                </motion.div>
                <motion.div
                    style={{
                        position: "absolute",
                        top: "0.2rem",
                        left: "0.2rem",
                        right: "0.2rem",
                        bottom: "0.2rem",
                        borderRadius: "inherit",
                        border: "solid 0.5rem #D4B20B",
                        borderStyle: "dotted",
                    }}
                ></motion.div>
            </motion.div>
        </motion.div>
    );
}
