import {combineReducers} from "redux"
import {authSlice}  from "../Reducers/UserReducer"
import { ResetCrential } from "../Reducers/RecoverReducer";

export const rootReducers = combineReducers ({
    users: authSlice.reducer,
    Credential : ResetCrential.reducer
})

export type RootState = ReturnType <typeof rootReducers>;
