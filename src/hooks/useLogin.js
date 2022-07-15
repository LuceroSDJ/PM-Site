import { useState, useEffect, useRef } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch} = useAuthContext();
    // console.log("isCancelled outside of useEffect and login function", isCancelled);

    //we need a function that we can return inside useLogin custom hook:
    const login = async (email, password) => {
        setError(null);
        setIsPending(true);

        // console.log("isCancelled state when login(a,b) is called", isCancelled);
        // console.log("set isPending to true inside login function [which is returned from useLogin Hook");

        //------------------- signin user ---------------------
        try {
            const res = await projectAuth.signInWithEmailAndPassword(email, password);
            //on our response object we get a user property which we will use as payload

            // =========== FIREBASE SERVICE: FIRESTORE DB =====================
            //we want to tap into the users collection and into our user specific document to update online status to true
            await projectFirestore.collection("users").doc(res.user.uid).update({ online: true });

            //--------------- dispatch logout action ------------
            dispatch({type: "LOGIN", payload: res.user});

            //--------------- update state ----------------------
            //NOTE: we want to update state only if isCancell is false, which means that our clean up function has not ran & component has not unmounted yet.
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        } 
        catch(err) {
            console.log(err.message);
            //--------------- update state ---------------------
            if (!isCancelled) {
                setError(err.message);
                setIsPending(false);
            }  
        }
    }

    //-------------------- clean up function ---------------------
    //if the component unmounts, set isCancelled to true so we do not update any local state
    //and prevent memory leaks
    useEffect(() => {
        return () => {
            setIsCancelled(true);
            console.log("running cleanup function");
        }
    }, [])

    return {login, error, isPending, setIsPending}
}