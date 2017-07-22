import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ConfigState {
    baseUrl: string;
    clientId: string;
    clientKey: string;
    clientSecret: string;
    tokenType: string;
    redirectUri: string;
    scope: string;
    state: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface UpdateConfigAction {
    type: 'UPDATE_CONFIG',
    config: ConfigState
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateConfigAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    updateConfig: (config: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        if (config.baseUrl !== getState().config.baseUrl
            || config.clientId !== getState().config.clientId
            || config.clientKey !== getState().config.clientKey
            || config.clientSecret !== getState().config.clientSecret
            || config.tokenType !== getState().config.tokenType
            || config.redirectUri !== getState().config.redirectUri
            || config.scope !== getState().config.scope
            || config.state !== getState().config.state) {
               
            let fetchTask = fetch(`/api/config/updateConfig`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getState().config)
            })

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete 
            dispatch({ 
                type: 'UPDATE_CONFIG', 
                config: config 
            });
        }
    },
    getConfig: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/config/getConfig`)
            .then(response => response.json() as Promise<ConfigState>)
            .then(data => {
                dispatch({ type: 'UPDATE_CONFIG', config: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete 
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ConfigState = { 
    baseUrl: '',
    clientId: '',
    clientKey: '',
    clientSecret: '',
    tokenType: '',
    redirectUri: '',
    scope: '',
    state: '',
};

export const reducer: Reducer<ConfigState> = (state: ConfigState, action: any) => {
    switch (action.type) {
        case 'UPDATE_CONFIG':
            if( action.config )
            {
                return { 
                    baseUrl: action.config.baseUrl || state.baseUrl, 
                    clientId: action.config.clientId || state.clientId, 
                    clientKey: action.config.clientKey || state.clientKey, 
                    clientSecret: action.config.clientSecret || state.clientSecret,
                    tokenType: action.config.tokenType || state.tokenType,
                    redirectUri: action.config.redirectUri || state.redirectUri,
                    scope: action.config.scope || state.scope,
                    state: action.config.state || state.state
                };
            }
            return state;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            false;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || unloadedState;
};