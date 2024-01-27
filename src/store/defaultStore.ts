export type Store = typeof defaultStore;
const defaultStore = {
    test: "Test",

    // Valores del juego
    escenaActual: "SimonSays",

    // Valores del minijuego
    timerTiempoMaximo: 5,

    // Valores de personajes
    // P1
    p1Name: "P1",
    p1Asset: "capibara",
    // P2
    p2Name: "P3",
    p2Asset: "husky",
};

export default defaultStore;
