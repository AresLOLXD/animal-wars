export type Store = typeof defaultStore;

export enum TimerState {
    Idle = "idle", // Inicio sin timer, etc, etc
    Start = "start", // Para iniciar el timer, se cambiar despues Active
    Active = "active", // Mientras el timer corre
    Stop = "stop", // Se cambia a stop al acabar el timer
}

const defaultStore = {
    test: "Test",

    // Valores del juego
    escenaActual: "SimonSays",

    // Valores del minijuego
    timerTiempoMaximo: 5000,
    timerState: TimerState.Idle,
    timerValue: 0,

    // Valores de personajes
    // P1
    p1Name: "P1",
    p1Asset: "capibara",
    // P2
    p2Name: "P2",
    p2Asset: "oso",
};

export default defaultStore;
