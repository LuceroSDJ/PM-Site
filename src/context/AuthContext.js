import { createContext, useReducer, useEffect } from "react";
import { projectAuth } from "../firebase/config";
// ----------------------- create context object -------------------------------
export const AuthContextObj = createContext();

// ------------- the reducer function contains all of our state logic ----------
const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, user: action.payload};
        case "LOGOUT":
            return {...state, user: null};
        case "AUTH_IS_READY":
            return {...state, user: action.payload, authIsReady: true}
        default:
            return state
    }
}

// ---------------------- custom provider component ----------------------------
export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false
    })

    useEffect(() => {
        //this funtion will fire everytime there is a user authentication change, 
        //but we want it to only be executed once (on load) to find out whether a user has logged in or not
        const unsub = projectAuth.onAuthStateChanged((user) => {
            dispatch({type:"AUTH_IS_READY", payload: user})
            unsub(); //cancel the subscripton to Authentication status
        })
    }, [])

    console.log("AuthContext state should be 1st false then true", state);

    return (
        <AuthContextObj.Provider value={{...state, dispatch}}>
            {children}
        </AuthContextObj.Provider>
    )

}