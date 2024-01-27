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
                path: "modal",
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
                // backgroundColor: "white",
            }}
        >
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
