import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import *  as Token from './Token'

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CodeState {
    authCode: string,
    errorState: boolean,
    errorType: string,
    errorMessage: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface RecieveCodeAction {
    type: 'RECEIVE_CODE',
    code: CodeState
}

interface UseCodeAction {
    type: 'USE_CODE',
    code: CodeState
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RecieveCodeAction | UseCodeAction | Token.ReceiveTokenAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    receiveCode: (code: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        //console.log("CODE ACTION " + JSON.stringify(code, null, 2));
        dispatch({ 
            type: 'RECEIVE_CODE', 
            code: code 
        });
    },
    useAuthCode: (code: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        //TODO fix action - POST to get token based on code?
        let fetchTask = fetch(`/api/token/getToken?code=` + code)
            .then(response => response.json() as Promise<Token.Token>)
            .then(data => {
                dispatch({ type: 'RECEIVE_TOKEN', token: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete 
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CodeState = { 
    authCode: '',
    errorType: '',
    errorMessage: '',
    errorState: false
};

export const reducer: Reducer<CodeState> = (state: CodeState, action: any) => {
    switch (action.type) {
        case 'RECEIVE_CODE':
            //console.log("CODE REUCDER " + JSON.stringify(state, null, 2));
            if( action.code || action.errorType )
            {
                return { 
                    authCode: action.code.authCode || state.authCode,
                    errorType: action.code.errorType || state.errorType,  
                    errorMessage: action.code.errorMessage || state.errorMessage, 
                    errorState: action.code.errorState || state.errorState
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