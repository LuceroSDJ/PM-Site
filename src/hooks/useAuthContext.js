import {useContext} from "react";
import {AuthContextObj} from "../context/AuthContext";

export const useAuthContext = () => {
    const context = useContext(AuthContextObj);

    if(!context) {
        throw new Error("useAuthContext cusom hook must be used inside an AuthContextProvider")
    }

    return context;

}
