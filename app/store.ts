import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import counterReducer from '../features/counter/counterSlice'
import authReducer from '../features/auth/authSlice'
import actionReducer from '../features/actions/actionsSlice'
import eventActionsReducer from '../features/eventActions/eventActionsSlice'
import eventUserActionsReducer from '../features/eventUserActions/eventUserActionsSlice'

export function makeStore() {
    return configureStore({
        reducer: { 
            counter: counterReducer,
            auth: authReducer,
            actions: actionReducer,
            eventActions: eventActionsReducer,
            eventUserActions: eventUserActionsReducer
        },
    })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>

export default store