import { Variants, motion } from "framer-motion";
import { PropsWithChildren } from "react";
import "./PrimaryButton.css";

export default function PrimaryButton({
    children: label,
}: PropsWithChildren<{}>) {
    const forHoverDots : Variants ={
        normal:{
            position: "absolute",
            top: "0.2rem",
            left: "0.2rem",
            right: "0.2rem",
            bottom: "0.2rem",
            borderRadius: "inherit",
            border: "solid 0.5rem #B6B18E",
            borderStyle: "dotted",
        },
        hover: {
            border: "dotted 0.5rem #D4B20B",
            transition: {
              duration: 0.1,
              type: "tween",
              ease: "linear"
            }
        }
    };

    const forHoverLetter : Variants ={
        normal:{
            background: "#DCD38D",
            padding: "1rem 4rem",
            borderRadius: "1rem",
            color:"#342F2F",
        },
        hover: {
            background: "#FDED6E",
            padding: "1rem 4rem",
            borderRadius: "1rem",
            color:"#552B29",
            transition: {
              duration: 0.1,
              type: "tween",
              ease: "linear"
            }
        }
    };

    const forHoverBorder : Variants ={
        normal:{
            background: "#A0020C",
            padding: "1rem",
            borderRadius: "inherit",
            position: "relative",
            zIndex: 3,
            boxShadow: "3px 5px 0px 0px black",
        },
        hover:{
            background: "#E8000E",
            boxShadow: "2px 2px 2px 2px #BDA800",
            transition: {
                duration: 0.1,
                type: "tween",
                ease: "linear"
            }
        }
    };

    return (
        <motion.div whileHover="hover" initial="normal" animate="normal"
            style={{
                position: "relative",
                borderRadius: "1.2rem",
                fontFamily: "Sancreek",
                fontSize: "2em",
                textAlign:"center",
                width:"100%",                
            }}
        >
            <motion.div variants={forHoverBorder}            >
                <motion.div variants={forHoverLetter}> {label} </motion.div>
                <motion.div variants={forHoverDots}></motion.div>
            </motion.div>
        </motion.div>
    );
}
