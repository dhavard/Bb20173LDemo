import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { RouterAction, push } from 'react-router-redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LearnRequestState {
    learnRequest: LearnRequest
}

export interface LearnRequest {
    url: string;
    authHeader: string;
    body: string;
    method: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface UpdateRequestAction {
    type: 'UPDATE_REQUEST',
    learnRequest: LearnRequestState
}

interface SendRequestAction {
    type: 'SEND_REQUEST',
    learnRequest: LearnRequestState
}

interface GetRequestAction {
    type: 'GET_REQUEST',
    learnRequest: LearnRequestState
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateRequestAction | SendRequestAction | GetRequestAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    updateRequest: (learnRequest: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        if (learnRequest.authHeader !== getState().learnRequest.learnRequest.authHeader
            || learnRequest.body !== getState().learnRequest.learnRequest.body
            || learnRequest.method !== getState().learnRequest.learnRequest.method
            || learnRequest.url !== getState().learnRequest.learnRequest.url) {
            console.log( "updateRequest action" + JSON.stringify( learnRequest, null, 2) );
               
            dispatch({ 
                type: 'UPDATE_REQUEST', 
                learnRequest: learnRequest.learnRequest 
            });
        }
    },
    sendRequest: (learnRequest: any): AppThunkAction<RouterAction> => (dispatch, getState) => {   
        console.log( "sendRequest action" + JSON.stringify( learnRequest, null, 2) );   
        let fetchTask = fetch(`/api/resource/requestResource`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(learnRequest)
        });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete 
        dispatch(push('/learnRequest'));
    },
    getLastRequest: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/cache/getLastRequest`)
            .then(response => response.json() as Promise<LearnRequestState>)
            .then(data => {
                dispatch({ type: 'GET_REQUEST', learnRequest: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete 
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: LearnRequestState = { learnRequest: {
    url: 'unl',
    authHeader: 'asdf',
    body: '{}',
    method: 'GET'
}};

export const reducer: Reducer<LearnRequestState> = (state: LearnRequestState, action: any) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            console.log( "updateRequest reducer" + JSON.stringify( action, null, 2) );
        case 'GET_REQUEST':
            console.log( "getRequest reducer" );
            if( action.learnRequest )
            {
                return { learnRequest: {
                    url: action.learnRequest.url || state.learnRequest.url, 
                    authHeader: action.learnRequest.authHeader || state.learnRequest.authHeader, 
                    body: action.learnRequest.body || state.learnRequest.body,
                    method: action.learnRequest.method || state.learnRequest.method
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