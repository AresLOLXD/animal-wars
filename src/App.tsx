import "@gui/App.css";
import MainMenu from "@gui/routes/MainMenu";
import Modal from "@gui/routes/Modal";
import Personaje from "@gui/routes/SeleccionaPersonaje";
import Root from "@gui/routes/Root";
import MinijuegoIndex from "@gui/routes/minijuego/Index";
import Minijuego from "@gui/routes/minijuego/Minijuego";
import "normalize.css/normalize.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { gameConfig } from "./phaser";

const router = createHashRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <MainMenu />,
            },
            {
                path: "minijuego",
                element: <Minijuego />,
                children: [
                    {
                        index: true,
                        element: <MinijuegoIndex />,
                    },
                ],
            },
            {
                path: "modal/:minijuego",
                element: <Modal />,
            },
            {
                path: "seleccionaPersonaje",
                element: <Personaje />,
            },
        ],
    },
]);

function App() {
    return (
        <div id="mainContainer"
            style={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                top: 0,
                left: 0,
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: gameConfig.width,
                    height: gameConfig.height,
                    display: "flex",
                    flexDirection: "column",
                    padding: "1rem",
                }}
            >
                <RouterProvider router={router} />
            </div>
        </div>
    );
}

export default App;
