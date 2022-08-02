import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config"; //we need this to interact with auth firebase service
import { useAuthContext } from "./useAuthContext"; //we need access to our context object

export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch, user } = useAuthContext();

    //we need a function that we can return inside this useLogout custom hook:
    const logout = async () => {
        setError(null);
        setIsPending(true);

        //------------------- update online status & signout user ---------------------
        try {
            const { uid } = user;
            await projectFirestore.collection("users").doc(uid).update({ online: false });
            //Sign out the current user
            await projectAuth.signOut(); 

            //--------------- dispatch logout action ------------
            dispatch({type: "LOGOUT"});

            //--------------- update state ----------------------
            if(!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        } 
        catch(err) {
            console.log(err.message);
            //--------------- update state ---------------------
            if(!isCancelled) {
                setError(err.message);
                setIsPending(false);
            }  
        }
    }

    //-------------------- clean up function ---------------------
    useEffect(() => {
        // no effect
        return () => setIsCancelled(true);
    }, [])

    return {logout, error, isPending}

}
