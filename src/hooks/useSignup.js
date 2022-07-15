import {useState, useEffect} from "react";
import {projectAuth, projectFirestore, projectStorage} from "../firebase/config";
import {useAuthContext} from "./useAuthContext"; //returns context object containing our state and dispatch function

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const {dispatch} = useAuthContext();

    const signup = async (email, password, displayName, thumbnail) => {
        setError(null);
        setIsPending(true);

        // ========================= signup user ==============================
         // =========== FIREBASE SERVICE: AUTH =====================
        try{
            //=== 1.) create user
            const response = await projectAuth.createUserWithEmailAndPassword(email, password);
            console.log(response.user);
            //catch network connection errors
            if(!response) {  //we might get an error for ex. if there is no network connection
                throw new Error("Could not complete signup");
            }

            //=== 2.) upload user thumbnail and store it in a firebase storage inside a folder named after the user ID
            // ===== create upload path/folder structure : where we want to store it inside our storage bucket
            const uploadPath = `thumbnail/${response.user.uid}/${thumbnail.name}`;
            // ===== upload the image --@return An object that can be used to monitor and manage the upload.
            const imgUploadedObj = await projectStorage.ref(uploadPath).put(thumbnail);
            // ===== extract the url img from object rreturned by line 29 chained methods
            const imgURL = await imgUploadedObj.ref.getDownloadURL();

            //=== 3.)add display name and photoURL if new user is created successfully.
            await response.user.updateProfile({displayName: displayName, photoURL: imgURL});
            
            // =========== FIREBASE SERVICE: FIRESTORE DB =====================
            //we want to store the image url, display name, and isOnline (boolean) to display in sidebar
            //create a user document
            await projectFirestore.collection("users").doc(response.user.uid).set({
                online: true,
                displayName: displayName,
                photoURL: imgURL
            })
            
            
            //--------------------dispatch action -------------------- 
            //to update context value and login user locally
            dispatch({type: "LOGIN", payload: response.user});
     
            //----------- update state ------------
            if(!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        } 
        catch(err) {  //catch firebase errors
            console.log(err.message);
            //----------- update state ------------
            if(!isCancelled) {
                setError(err.message);
                setIsPending(false);
            }
        }
    }

    //-------------- clean up function ---------------------
    useEffect(() => {
        // no effect
        return () => setIsCancelled(true);
    }, [])

    return {signup, error, isPending};
}