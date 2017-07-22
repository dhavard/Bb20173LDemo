import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';
import * as Authentication from './Authentication'
import * as Token from './Token'
import * as Config from './Config'
import * as LearnResponse from './LearnResponse'
import * as LearnRequest from './LearnRequest'

// The top-level state object
export interface ApplicationState {
    counter: Counter.CounterState,
    weatherForecasts: WeatherForecasts.WeatherForecastsState,
    authData: Authentication.AuthenticationState,
    token: Token.TokenState,
    config: Config.ConfigState,
    learnResponse: LearnResponse.LearnResponseState,
    learnRequest: LearnRequest.LearnRequestState
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    authData: Authentication.reducer,
    token: Token.reducer,
    config: Config.reducer,
    learnResponse: LearnResponse.reducer,
    learnRequest: LearnRequest.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
