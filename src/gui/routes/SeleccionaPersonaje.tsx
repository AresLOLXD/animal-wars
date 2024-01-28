import { Variants, motion } from "framer-motion";
import styled from "styled-components";
import { gameConfig } from "@phaser/index";
import Oso from "@assets/Personajes/oso.png";
import Panda from "@assets/Personajes/panda.png";
import Capibara from "@assets/Personajes/capibara.png";

let wg = Number(gameConfig.width);
let hg = Number(gameConfig.height);
let personajeFocus1: string;
let personajeFocus2: string;

const arrowLeft = <svg width="52" height="30" viewBox="0 0 52 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.585786 16.4142C-0.195262 15.6332 -0.195262 14.3668 0.585786 13.5858L13.3137 0.857864C14.0948 0.0768158 15.3611 0.0768158 16.1421 0.857864C16.9232 1.63891 16.9232 2.90524 16.1421 3.68629L4.82843 15L16.1421 26.3137C16.9232 27.0948 16.9232 28.3611 16.1421 29.1421C15.3611 29.9232 14.0948 29.9232 13.3137 29.1421L0.585786 16.4142ZM52 17L2 17V13L52 13V17Z" fill="#FBDF00"/>
</svg>;
const arrowRigth = <svg width="52" height="30" viewBox="0 0 52 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M51.4142 16.4142C52.1953 15.6332 52.1953 14.3668 51.4142 13.5858L38.6863 0.857864C37.9052 0.0768158 36.6389 0.0768158 35.8579 0.857864C35.0768 1.63891 35.0768 2.90524 35.8579 3.68629L47.1716 15L35.8579 26.3137C35.0768 27.0948 35.0768 28.3611 35.8579 29.1421C36.6389 29.9232 37.9052 29.9232 38.6863 29.1421L51.4142 16.4142ZM0 17L50 17V13L0 13L0 17Z" fill="#FBDF00"/>
</svg>;

personajeFocus1 = Oso;
personajeFocus2 = Panda;

const Container = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: ${wg-10}px;
    height: ${hg-10}px;
    color: #d4b20b;
`;

const Row = styled(motion.div)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    justify-content: center;
    align-items:center;
    text-align:center;
    height: 100%;
    width: 100%;
    font-size: 0.5em;
    font-family: Sancreek;
`;

export default function Personaje() {
    return (
        <Container>
            <Row>
                <div>Jugador 1</div>
                <div>Jugador 2</div>
            </Row>
            <Row>
                <Column>{arrowLeft}</Column>
                <Column>
                    <div style={{
                        width:"250px",
                        height:"250px",
                        //overflow:"hidden",
                        position:"relative",
                    }}>
                        <img src={personajeFocus1} style={{
                        position:"absolute",
                        width:"300px",
                        height:"300px",
                        transform:"scaleX(-1)",
                        margin:"auto"
                    }}></img> 
                    </div>
                </Column>
                <Column>{arrowRigth}</Column>
                <Column>{arrowLeft}</Column>
                <Column>
                    <img src={personajeFocus2} style={{
                        width:"300px",
                        height:"300px"
                    }}></img>     
                </Column>
                <Column>{arrowRigth}</Column>
            </Row>
        </Container>
    );
}
