import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LearnResponseState {
    learnResponse: LearnResponse
}

export interface LearnResponse {
    url: string;
    statusCode: string;
    body: string;
    redirectUri: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface UpdateResponseAction {
    type: 'UPDATE_RESPONSE',
    learnResponse: LearnResponse
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateResponseAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    getLastResponse: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/cache/getLastResponse`)
            .then(response => response.json() as Promise<LearnResponse>)
            .then(data => {
                dispatch({ type: 'UPDATE_RESPONSE', learnResponse: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete 
        dispatch({ type: 'UPDATE_RESPONSE', learnResponse: unloadedState.learnResponse });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: LearnResponseState = { 
    learnResponse: {
        url: 'unl',
        statusCode: 'asdf',
        body: '{ "empty": "body" }',
        redirectUri: ''
    }
};

export const reducer: Reducer<LearnResponseState> = (state: LearnResponseState, action: any) => {
    switch (action.type) {
        case 'UPDATE_RESPONSE':
            if( action.learnResponse )
            {
                return { 
                    learnResponse: {
                        url: action.learnResponse.url || state.learnResponse.url, 
                        statusCode: action.learnResponse.statusCode || state.learnResponse.statusCode, 
                        body: action.learnResponse.body || state.learnResponse.body,
                        redirectUri: action.learnResponse.redirectUri || state.learnResponse.redirectUri
                }};
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