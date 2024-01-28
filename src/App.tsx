import "@gui/App.css";
import MainMenu from "@gui/routes/MainMenu";
import Modal from "@gui/routes/Modal";
import Root from "@gui/routes/Root";
import MinijuegoIndex from "@gui/routes/minijuego/Index";
import Minijuego from "@gui/routes/minijuego/Minijuego";
import "normalize.css/normalize.css";
import { RouterProvider, createHashRouter } from "react-router-dom";

const router = createHashRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "mainmenu",
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
        ],
    },
]);

function App() {
    return (
        <div
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
                // backgroundColor: "white",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
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
