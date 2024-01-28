export type Store = typeof defaultStore;

export enum TimerState {
    Idle = "idle", // Inicio sin timer, etc, etc
    Start = "start", // Para iniciar el timer, se cambiar despues Active
    Active = "active", // Mientras el timer corre
    Stop = "stop", // Se cambia a stop al acabar el timer
}

export enum BarState {
    Active = "active",
    Stop = "stop",
    Result = "result",
}

export enum BarResult {
    Acierto = "acierto",
    Fallo = "fallo",
    Critico = "critico",
}

const defaultStore = {
    test: "Test",

    // Valores del juego
    escenaActual: "BattleShip",

    // Valores del minijuego
    timerTiempoMaximo: 5000,
    timerState: TimerState.Idle,
    timerValue: 0,

    // Valores de personajes
    // P1
    p1Name: "P1",
    p1Asset: "capibara",
    p1PrendaTop: "",
    p1PrendaMiddle: "",
    p1PrendaBottom: "",
    p1Score: 0,
    p1BarState: BarState.Active,
    p1BarResult: BarResult.Acierto,
    // P2
    p2Name: "P2",
    p2Asset: "oso",
    p2PrendaTop: "",
    p2PrendaMiddle: "",
    p2PrendaBottom: "",
    p2Score: 0,
    p2BarState: BarState.Active,
    p2BarResult: BarResult.Acierto,
};

export default defaultStore;
