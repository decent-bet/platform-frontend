export interface IAppState {
    userIsAuthenticated: boolean
    appLoaded: boolean
}

export class AppState implements IAppState {
    public userIsAuthenticated = false
    public appLoaded = false
}
