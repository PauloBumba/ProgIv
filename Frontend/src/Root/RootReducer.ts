import {combineReducers} from "redux"
import {authSlice}  from "../Reducers/UserReducer"
import { ResetCrential } from "../Reducers/RecoverReducer";
import {routeSlice}  from "../Reducers/routeSlice";
import { ExtraloginReducer } from "../Reducers/ExtraloginReducer";

export const rootReducers = combineReducers ({
    users: authSlice.reducer,
    Credential : ResetCrential.reducer,
    route : routeSlice.reducer,
    extraLogin : ExtraloginReducer.reducer

})

export type RootState = ReturnType <typeof rootReducers>;
