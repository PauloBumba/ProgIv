import {combineReducers} from "redux"
import {authSlice}  from "../Reducers/UserReducer"
import { ResetCrential } from "../Reducers/RecoverReducer";
import {routeSlice}  from "../Reducers/routeSlice";

export const rootReducers = combineReducers ({
    users: authSlice.reducer,
    Credential : ResetCrential.reducer,
    route : routeSlice.reducer
})

export type RootState = ReturnType <typeof rootReducers>;
