import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface TokenState {
    isLoading: boolean;
    token: Token;
}

export interface Token {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    user_id: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestTokenAction {
    type: 'REQUEST_TOKEN',
    grantType: string,
    code: string,
    redirectUri: string,
    refreshToken: string
}

interface ReceiveTokenAction {
    type: 'RECEIVE_TOKEN',
    token: Token
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestTokenAction | ReceiveTokenAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestToken: (grantType: string, code: string, refreshToken: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        //if (!getState().token.isLoading) {
            let fetchTask = fetch(`/api/token/getToken?grantType=${ grantType }&code=${ code }&refreshToken=${ refreshToken }`)
                .then(response => response.json() as Promise<Token>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TOKEN', token: data });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_TOKEN', grantType: grantType, code: code, redirectUri: 'http://localhost:5000/token', refreshToken: refreshToken });
        //}
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: TokenState = { 
    isLoading: false, 
    token: {
        access_token: '',
        token_type: '',
        expires_in: 0,
        refresh_token: '',
        scope: '',
        user_id: 'not yet loaded'
    }
};

export const reducer: Reducer<TokenState> = (state: TokenState, action: any) => {
    switch (action.type) {
        case 'REQUEST_TOKEN':
            return {
                token: state.token,
                isLoading: true
            };
        case 'RECEIVE_TOKEN':
            if( state.isLoading === true )
            {
                return {
                    token: action.token,
                    isLoading: false
                };
            }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            //const exhaustiveCheck: never = action;
            false;
    }

    return state || unloadedState;
};
