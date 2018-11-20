import IAppState from './IAppState'

export default class AppState implements IAppState {
    public userIsAuthenticated = false
    public appLoaded = false
}
