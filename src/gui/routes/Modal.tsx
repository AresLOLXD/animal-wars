import styled from "styled-components";
import { Variant, Variants, motion } from "framer-motion";

const Controles = {
    General:{
        J1:{
            izquierda : "key-a",
            derecha   : "key-d",
            abajo     : "undefined",
            arriba    : "undefined",
            choose    : "key-w"
        },
        J2:{
            izquierda : "key-left",
            derecha   : "key-right",
            abajo     : "undefined",
            arriba    : "undefined",
            choose    : "key-up"
        }
    },
    SimonDice:{
        J1:{
            izquierda : "key-a",
            derecha   : "key-d",
            abajo     : "key-s",
            arriba    : "key-w",
            choose    : "any"
        },
        J2:{
            izquierda : "key-left",
            derecha   : "key-right",
            abajo     : "key-down",
            arriba    : "key-up",
            choose    : "any"
        }
    }
};

const Container = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color:#D4B20B;
`;

const RowCenter = styled(motion.div)`
    display:flex;
    flex-direction:row;
    justify-content:center;
    width:100%;
    font-size:2em;
    margin:5px;
`;

const Column = styled(motion.div)`
    display:flex;
    flex-direction:column;
    justify-content:start;
    height:100%;
    width:auto;
`;

export default function () {

    const modalPrincipal : Variants ={
        normal:{
            background:"rgba(28,26,27,0.8)",
            width:"80vw",
            height:"80vh",
            padding:"3%",
            borderRadius:"1rem",
            backdropFilter:"blur(15px)",
            boxShadow: "1px 5px 0px 0px black",
        }
    };

    const botonPlay : Variants ={
        normal:{
            border:"none",
            background:"#D4B20B",
            padding:"10px",
            margin:"5px",
            fontSize:"0.75em",
        }
    };

    return (
        <Container initial="normal" animate="normal">
            <motion.div variants={modalPrincipal}>
                <RowCenter>Controles</RowCenter>
                <RowCenter>
                    <Column>asfd</Column>
                    <div style={{
                        background:"#D4B20B",
                        height:"350px",
                        width:"3px",
                        margin:"0px 10px",
                    }}></div>
                    <Column> asdfgfg</Column>
                </RowCenter>
                <RowCenter>
                    <motion.button variants={botonPlay}>Play</motion.button>
                </RowCenter>
            </motion.div>
        </Container>
    );
}
