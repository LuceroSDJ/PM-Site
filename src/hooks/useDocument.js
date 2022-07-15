import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export const useDocument = (collection, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    
    //get real-time data for document
    useEffect(() => {
        //set real-time listener for the document
        const ref = projectFirestore.collection(collection).doc(id);
        const unsubscribe = ref.onSnapshot((snapshot) => {
            //only update if there is data in the document
            if(snapshot.data()) {
                setDocument({...snapshot.data(), id: snapshot.id});
                console.log("snapshot.id", snapshot.id)
                setError(null);
            }
            else {
                setError("We do not have data for this particular document.")
            }
        }, (err) => {
            console.log(err.message);
            setError("Failed to get document.")
        })
        //unsubscribe from real-time listener
        return () => unsubscribe();
    }, [collection, id])

    //return the values that we need
    return { document, error };

}

// notes: 
// inside the onSnapshot() method, we fire a function every time we a snapshot from the database.

// the argument "snapshot" that we pass inside onSnapshot() : in the callback function that we pass in represents the object/document we get back from the database.

// On data change, in the document, we automatically get a new snapshot.

//onSnapshot() method returns an unsubscribe function which we can invoke to unsubscribe from real-time changes.