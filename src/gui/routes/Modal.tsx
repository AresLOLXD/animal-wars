import { Variants, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Controles = {

    General: {
        titulo: "General",
        J1: {
            izquierda: "key-a",
            derecha: "key-d",
            abajo: "undefined",
            arriba: "undefined",
            choose: "key-w",
        },
        J2: {
            izquierda: "key-left",
            derecha: "key-right",
            abajo: "undefined",
            arriba: "undefined",
            choose: "key-up",
        },
    },
    SimonDice: {
        titulo: "Simón dice",
        J1: {
            izquierda: "key-a",
            derecha: "key-d",
            abajo: "key-s",
            arriba: "key-w",
            choose: "any",
        },
        J2: {
            izquierda: "key-left",
            derecha: "key-right",
            abajo: "key-down",
            arriba: "key-up",
            choose: "any",
        },
    },
};

const IconosControles = {
    "any"       : <>Cualquier botón de los anteriores -</>,
    "key-left"  : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.4025 27.8044L19.7512 30.4556L11.7937 22.5L19.7493 14.5444L22.4006 17.1975L18.975 20.625H33.1068V24.375H18.975L22.4025 27.8044Z" fill="#FFC700"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M43.125 35.625C43.125 37.6141 42.3348 39.5218 40.9283 40.9283C39.5218 42.3348 37.6141 43.125 35.625 43.125H9.375C7.38588 43.125 5.47822 42.3348 4.0717 40.9283C2.66518 39.5218 1.875 37.6141 1.875 35.625V9.375C1.875 7.38588 2.66518 5.47822 4.0717 4.0717C5.47822 2.66518 7.38588 1.875 9.375 1.875H35.625C37.6141 1.875 39.5218 2.66518 40.9283 4.0717C42.3348 5.47822 43.125 7.38588 43.125 9.375V35.625ZM35.625 39.375H9.375C8.38044 39.375 7.42661 38.9799 6.72335 38.2766C6.02009 37.5734 5.625 36.6196 5.625 35.625V9.375C5.625 8.38044 6.02009 7.42661 6.72335 6.72335C7.42661 6.02009 8.38044 5.625 9.375 5.625H35.625C36.6196 5.625 37.5734 6.02009 38.2766 6.72335C38.9799 7.42661 39.375 8.38044 39.375 9.375V35.625C39.375 36.6196 38.9799 37.5734 38.2766 38.2766C37.5734 38.9799 36.6196 39.375 35.625 39.375Z" fill="#FFC700"/>
                  </svg>, 
    "key-right" : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5974 27.8044L25.2487 30.4556L33.2062 22.5L25.2506 14.5444L22.5993 17.1975L26.0249 20.625H11.8931V24.375H26.0249L22.5974 27.8044Z" fill="#FFC700"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.875 35.625C1.875 37.6141 2.66518 39.5218 4.0717 40.9283C5.47822 42.3348 7.38588 43.125 9.375 43.125H35.625C37.6141 43.125 39.5218 42.3348 40.9283 40.9283C42.3348 39.5218 43.125 37.6141 43.125 35.625V9.375C43.125 7.38588 42.3348 5.47822 40.9283 4.0717C39.5218 2.66518 37.6141 1.875 35.625 1.875H9.375C7.38588 1.875 5.47822 2.66518 4.0717 4.0717C2.66518 5.47822 1.875 7.38588 1.875 9.375V35.625ZM9.375 39.375H35.625C36.6196 39.375 37.5734 38.9799 38.2766 38.2766C38.9799 37.5734 39.375 36.6196 39.375 35.625V9.375C39.375 8.38044 38.9799 7.42661 38.2766 6.72335C37.5734 6.02009 36.6196 5.625 35.625 5.625H9.375C8.38044 5.625 7.42661 6.02009 6.72335 6.72335C6.02009 7.42661 5.625 8.38044 5.625 9.375V35.625C5.625 36.6196 6.02009 37.5734 6.72335 38.2766C7.42661 38.9799 8.38044 39.375 9.375 39.375Z" fill="#FFC700"/>
                  </svg>,
    "key-up"    : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.8513 22.4512L30.5044 19.8L22.5488 11.8444L14.5931 19.8L17.2444 22.4512L20.6738 19.0237V33.1556H24.4238V19.0237L27.8513 22.4512Z" fill="#FFC700"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.875 35.625C1.875 37.6141 2.66518 39.5218 4.0717 40.9283C5.47822 42.3348 7.38588 43.125 9.375 43.125H35.625C37.6141 43.125 39.5218 42.3348 40.9283 40.9283C42.3348 39.5218 43.125 37.6141 43.125 35.625V9.375C43.125 7.38588 42.3348 5.47822 40.9283 4.0717C39.5218 2.66518 37.6141 1.875 35.625 1.875H9.375C7.38588 1.875 5.47822 2.66518 4.0717 4.0717C2.66518 5.47822 1.875 7.38588 1.875 9.375V35.625ZM9.375 39.375H35.625C36.6196 39.375 37.5734 38.9799 38.2766 38.2766C38.9799 37.5734 39.375 36.6196 39.375 35.625V9.375C39.375 8.38044 38.9799 7.42661 38.2766 6.72335C37.5734 6.02009 36.6196 5.625 35.625 5.625H9.375C8.38044 5.625 7.42661 6.02009 6.72335 6.72335C6.02009 7.42661 5.625 8.38044 5.625 9.375V35.625C5.625 36.6196 6.02009 37.5734 6.72335 38.2766C7.42661 38.9799 8.38044 39.375 9.375 39.375Z" fill="#FFC700"/>
                  </svg>,
    "key-down"  : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.8026 22.5487L30.4557 25.2L22.5001 33.1556L14.5444 25.2L17.1976 22.5487L20.6251 25.9762V11.8444H24.3751V25.9762L27.8026 22.5487Z" fill="#FFC700"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.875 9.375C1.875 7.38588 2.66518 5.47822 4.0717 4.0717C5.47822 2.66518 7.38588 1.875 9.375 1.875H35.625C37.6141 1.875 39.5218 2.66518 40.9283 4.0717C42.3348 5.47822 43.125 7.38588 43.125 9.375V35.625C43.125 37.6141 42.3348 39.5218 40.9283 40.9283C39.5218 42.3348 37.6141 43.125 35.625 43.125H9.375C7.38588 43.125 5.47822 42.3348 4.0717 40.9283C2.66518 39.5218 1.875 37.6141 1.875 35.625V9.375ZM9.375 5.625H35.625C36.6196 5.625 37.5734 6.02009 38.2766 6.72335C38.9799 7.42661 39.375 8.38044 39.375 9.375V35.625C39.375 36.6196 38.9799 37.5734 38.2766 38.2766C37.5734 38.9799 36.6196 39.375 35.625 39.375H9.375C8.38044 39.375 7.42661 38.9799 6.72335 38.2766C6.02009 37.5734 5.625 36.6196 5.625 35.625V9.375C5.625 8.38044 6.02009 7.42661 6.72335 6.72335C7.42661 6.02009 8.38044 5.625 9.375 5.625Z" fill="#FFC700"/>
                  </svg>,
    "key-a"     : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.25 24.0619L22.5 14.0625L18.75 24.0619M26.25 24.0619L28.125 29.0625M26.25 24.0619H18.75M18.75 24.0619L16.875 29.0625" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.625 22.5C5.625 14.5444 5.625 10.5675 8.09625 8.09625C10.5675 5.625 14.5462 5.625 22.5 5.625C30.4556 5.625 34.4325 5.625 36.9037 8.09625C39.375 10.5675 39.375 14.5462 39.375 22.5C39.375 30.4556 39.375 34.4325 36.9037 36.9037C34.4325 39.375 30.4538 39.375 22.5 39.375C14.5444 39.375 10.5675 39.375 8.09625 36.9037C5.625 34.4325 5.625 30.4538 5.625 22.5Z" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>,
    "key-s"     : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.1875 17.3438V16.875C27.1875 16.3777 26.99 15.9008 26.6383 15.5492C26.2867 15.1975 25.8098 15 25.3125 15H19.6875C19.1902 15 18.7133 15.1975 18.3617 15.5492C18.01 15.9008 17.8125 16.3777 17.8125 16.875V18.72C17.8124 19.2822 17.9808 19.8316 18.296 20.2971C18.6111 20.7627 19.0586 21.1231 19.5806 21.3319L25.4194 23.6681C26.4881 24.0956 27.1875 25.1306 27.1875 26.28V28.125C27.1875 28.6223 26.99 29.0992 26.6383 29.4508C26.2867 29.8025 25.8098 30 25.3125 30H19.6875C19.1902 30 18.7133 29.8025 18.3617 29.4508C18.01 29.0992 17.8125 28.6223 17.8125 28.125V27.6562" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.625 22.5C5.625 14.5444 5.625 10.5675 8.09625 8.09625C10.5675 5.625 14.5462 5.625 22.5 5.625C30.4556 5.625 34.4325 5.625 36.9037 8.09625C39.375 10.5675 39.375 14.5462 39.375 22.5C39.375 30.4556 39.375 34.4325 36.9037 36.9037C34.4325 39.375 30.4538 39.375 22.5 39.375C14.5444 39.375 10.5675 39.375 8.09625 36.9037C5.625 34.4325 5.625 30.4538 5.625 22.5Z" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>,
    "key-d"     : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.8125 29.0625V15.9375C17.8125 15.6889 17.9113 15.4504 18.0871 15.2746C18.2629 15.0988 18.5014 15 18.75 15H22.5C24.2405 15 25.9097 15.6914 27.1404 16.9221C28.3711 18.1528 29.0625 19.822 29.0625 21.5625V23.4375C29.0625 25.178 28.3711 26.8472 27.1404 28.0779C25.9097 29.3086 24.2405 30 22.5 30H18.75C18.5014 30 18.2629 29.9012 18.0871 29.7254C17.9113 29.5496 17.8125 29.3111 17.8125 29.0625Z" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.625 22.5C5.625 14.5444 5.625 10.5675 8.09625 8.09625C10.5675 5.625 14.5462 5.625 22.5 5.625C30.4556 5.625 34.4325 5.625 36.9037 8.09625C39.375 10.5675 39.375 14.5462 39.375 22.5C39.375 30.4556 39.375 34.4325 36.9037 36.9037C34.4325 39.375 30.4538 39.375 22.5 39.375C14.5444 39.375 10.5675 39.375 8.09625 36.9037C5.625 34.4325 5.625 30.4538 5.625 22.5Z" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>,
    "key-w"     : <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.875 15V30L22.5 22.5L28.125 30V15" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.625 22.5C5.625 14.5444 5.625 10.5675 8.09625 8.09625C10.5675 5.625 14.5462 5.625 22.5 5.625C30.4556 5.625 34.4325 5.625 36.9037 8.09625C39.375 10.5675 39.375 14.5462 39.375 22.5C39.375 30.4556 39.375 34.4325 36.9037 36.9037C34.4325 39.375 30.4538 39.375 22.5 39.375C14.5444 39.375 10.5675 39.375 8.09625 36.9037C5.625 34.4325 5.625 30.4538 5.625 22.5Z" stroke="#FFC700" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
       
};
type KeyIconos = keyof typeof IconosControles;
const Container = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #d4b20b;
`;

const RowCenter = styled(motion.div)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    font-size: 2em;
    margin: 5px;
`;

const Elemento = styled(motion.div)`
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;
    margin: 5px;
`;

const Column = styled(motion.div)`
    display: flex;
    flex-direction: column;
    justify-content: start;
    height: 100%;
    width: 100%;
    font-size: 0.5em;
    font-family: Sancreek;
`;

export default function () {
    const { minijuego } = useParams();

    const controles = Controles[minijuego as keyof typeof Controles];
    console.log(controles);
    const modalPrincipal: Variants = {
        normal: {
            background: "rgba(28,26,27,0.8)",
            width: "80vw",
            height: "80vh",
            padding: "3%",
            borderRadius: "1rem",
            backdropFilter: "blur(15px)",
            boxShadow: "1px 5px 0px 0px black",
            display:"flex",
            flexDirection:"column",
            justifyContent: "space-between",
            alignContent:"center",
        },
    };

    const botonPlay: Variants = {
        normal: {
            border: "none",
            background: "#D4B20B",
            padding: "10px",
            margin: "5px",
            fontSize: "0.75em",
            alignSelf: "flex-end",
        },
    };

    const anclarFondo : Variants ={
        normal : {
            alignSelf: "flex-end",
        }
    };

    return (
        <Container initial="normal" animate="normal">
            <motion.div variants={modalPrincipal}>
                <RowCenter>Controles {controles.titulo}</RowCenter>
                <RowCenter>
                    <Column>
                        <h3>Jugador 1</h3>
                        {controles.J1.arriba!="undefined"?<Elemento>{IconosControles[controles.J1.arriba as KeyIconos]} Arriba</Elemento>:<></>}
                        {controles.J1.abajo!="undefined"?<Elemento>{IconosControles[controles.J1.abajo as KeyIconos]} Abajo</Elemento>:<></>}
                        {controles.J1.izquierda!="undefined"?<Elemento>{IconosControles[controles.J1.izquierda as KeyIconos]} Izquierda</Elemento>:<></>}
                        {controles.J1.derecha!="undefined"?<Elemento>{IconosControles[controles.J1.derecha as KeyIconos]} Derecha</Elemento>:<></>}
                        {controles.J1.choose!="undefined"?<Elemento>{IconosControles[controles.J1.choose as KeyIconos]} Escoger</Elemento>:<></>}
                    </Column>
                    <div
                        style={{
                            background: "#D4B20B",
                            height: "auto",
                            width: "3px",
                            margin: "20px",
                        }}
                    ></div>
                    <Column>
                        <h3>Jugador 2</h3>
                        {controles.J2.arriba!="undefined"?<Elemento>{IconosControles[controles.J2.arriba as KeyIconos]} Arriba</Elemento>:<></>}
                        {controles.J2.abajo!="undefined"?<Elemento>{IconosControles[controles.J2.abajo as KeyIconos]} Abajo</Elemento>:<></>}
                        {controles.J2.izquierda!="undefined"?<Elemento>{IconosControles[controles.J2.izquierda as KeyIconos]} Izquierda</Elemento>:<></>}
                        {controles.J2.derecha!="undefined"?<Elemento>{IconosControles[controles.J2.derecha as KeyIconos]} Derecha</Elemento>:<></>}
                        {controles.J2.choose!="undefined"?<Elemento>{IconosControles[controles.J2.choose as KeyIconos]} Escoger</Elemento>:<></>}
                    </Column>
                </RowCenter>
                <RowCenter variants={anclarFondo}>
                    <motion.button variants={botonPlay}>Play</motion.button>
                </RowCenter>
            </motion.div>
        </Container>
    );
}
