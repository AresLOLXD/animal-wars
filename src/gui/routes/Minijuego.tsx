import { Outlet } from "react-router-dom";

function Barra({ reverse }: { reverse?: boolean }) {
    return (
        <div
            style={{
                width: "400px",
                height: "64px",
                display: "flex",
                flexDirection: reverse ? "row-reverse" : "row",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: "20%",
                    backgroundColor: "tomato",
                }}
            ></div>
            <div
                style={{
                    height: "100%",
                    width: "50%",
                    backgroundColor: "steelblue",
                }}
            ></div>
            <div
                style={{
                    height: "100%",
                    width: "30%",
                    backgroundColor: "turquoise",
                }}
            ></div>
        </div>
    );
}

export default function () {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Barra />
                <Barra reverse />
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
}
