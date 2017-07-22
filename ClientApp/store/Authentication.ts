import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthenticationState {
    isLoading: boolean;
    authDataIndex: number;
    forecasts: Authentication[];
}

export interface Authentication {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestAuthenticationAction {
    type: 'REQUEST_AUTH',
    authDataIndex: number;
}

interface ReceiveAuthenticationAction {
    type: 'RECEIVE_AUTH',
    authDataIndex: number;
    forecasts: Authentication[]
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestAuthenticationAction | ReceiveAuthenticationAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestAuthentication: (authDataIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        if (authDataIndex !== getState().authData.authDataIndex) {
            let fetchTask = fetch(`/api/auth/getAuth?authDataIndex=${ authDataIndex }`)
                .then(response => response.json() as Promise<Authentication[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_AUTH', authDataIndex: authDataIndex, forecasts: data });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_AUTH', authDataIndex: authDataIndex });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: AuthenticationState = { authDataIndex: null, forecasts: [], isLoading: false };

export const reducer: Reducer<AuthenticationState> = (state: AuthenticationState, action: any) => {
    switch (action.type) {
        case 'REQUEST_AUTH':
            return {
                authDataIndex: action.authDataIndex,
                forecasts: state.forecasts,
                isLoading: true
            };
        case 'RECEIVE_AUTH':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.authDataIndex === state.authDataIndex) {
                return {
                    authDataIndex: action.authDataIndex,
                    forecasts: action.forecasts,
                    isLoading: false
                };
            }
            break;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            //const exhaustiveCheck: never = action;
            false;
    }

    return state || unloadedState;
};
