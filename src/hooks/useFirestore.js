//useFirestore.js custom hooks add/deletes documents from a firestore collection
import {useReducer, useEffect, useState} from "react";
import { projectFirestore, timestamp } from "../firebase/config";

// ------------------ INITIAL STATE ---------------------
//this piece of state will resemble the actual response that we get back from firestore db
let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

// ------------------ REDUCER FUNCTION ---------------------
const firestoreReducer = (state, action) => {
    switch (action.type) {
        case "IS_PENDING":
            return {...state, isPending: true, document: null, success: false, error: null}
        case "ADDED_DOCUMENT":
            return { isPending: false, document: action.payload, success: true, error: null}
        case "DELETED_DOCUMENT":
            return {isPending: false, document: action.payload, success: true, error: null}
        case "UPDATED_DOCUMENT":
            return {isPending: false, document: action.payload, success: true, error: null}
        case "ERROR":
            return {isPending: false, document: null, success: false, error: action.payload}
        default: 
            return state;
    }
}

// ------------------ CUSTOM HOOK ---------------------
export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    //we set isCancelled to true when the component that uses this hook unmounts 
    //and unsub from changing state.
    const [isCancelled, setIsCancelled] = useState(false);


    // ---------- collection ref -----------------
    const collectionRef = projectFirestore.collection(collection)

    // ----------- only dispatch if is not cancelled -----------------
    const dispatchIfNotCancelled = (action) => {
        if(!isCancelled) {
            dispatch(action);
        }
    }


    // add document
    const addDocument = async (doc) => {
        console.log("document countains uid, name, amount", doc);
        dispatch({type: "IS_PENDING"});
        try {
            const createdAt = timestamp.fromDate(new Date()); 
            //here we want to add the document object that we passed into the function as an argument in line 48
            const addedDocument = await collectionRef.add({...doc, createdAt: createdAt}); //this RETURNS us as a doc reference to the document that we just added
            dispatch({type: "ADDED_DOCUMENT", payload: addedDocument});
        } 
        catch (err) {
            dispatch({type: "ERROR", payload: err.message})
        }

    }

    //delete document
    const deleteDocument = async (id) => {
        dispatch({type: "IS_PENDING"});
        try{
            //get a reference to the actual document we want to delete
            //const deletedDocument = await collectionRef.doc(id).delete(); //returns "undefined" so no need to store it in a const
            await collectionRef.doc(id).delete();
        }
        catch (err) {
            dispatch({type: "ERROR", payload: "Could not delete document"})
        }

    }

    //update document
    const updateDocument = async (id, updates) => {
        dispatch({type: "IS_PENDING"});

        try {
            const updatedDocument = collectionRef.doc(id).update(updates);
            dispatch({type: "UPDATED_DOCUMENT", payload: updatedDocument});
            return updatedDocument;
        }
        catch (err) {
            dispatch({type: "ERROR", payload: err.message});

        }

    }

    // ----------------- cleanup function -----------------
    useEffect(() => {
        return setIsCancelled(true)
    }, [])

    return {addDocument, deleteDocument, updateDocument, response}

}