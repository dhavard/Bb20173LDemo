import * as Token from './Token'
import * as Config from './Config'
import * as LearnResponse from './LearnResponse'
import * as LearnRequest from './LearnRequest'
import * as Code from './Code'

// The top-level state object
export interface ApplicationState {
    token: Token.TokenState,
    config: Config.ConfigState,
    learnResponse: LearnResponse.LearnResponseState,
    learnRequest: LearnRequest.LearnRequestState,
    code: Code.CodeState
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    token: Token.reducer,
    config: Config.reducer,
    learnResponse: LearnResponse.reducer,
    learnRequest: LearnRequest.reducer,
    code: Code.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
