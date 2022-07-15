//GET THE LATEST SNAPSHOT OF THE COLLECTION, THEN DISPLAY DOCUMENTS DATA IN HOME COMPONENT
//also, we will use a firestore query to fetch only documents where a property is true or equal to uid in our case.
// we want to get documents from the user who is currently authenticated.
//we will pass a query as a second argument 
import {useEffect, useState, useRef} from "react";
import {projectFirestore} from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
    const [documents, setDocuments] = useState(null);  //here we store the docs we retrieve from the collection
    const [error, setError] = useState(null);

    // ------------ WRAP REFERENCE TYPE IN useRef -----------------
    const query = useRef(_query).current;
    //current gets us the value of _query
    const orderListBy = useRef(_orderBy).current;

    // ----- SET A REAL-TIME LISTENER TO A FIRESTORE COLLECTION ------
    useEffect(() => {
        let ref = projectFirestore.collection(collection);

        if(query) {
            ref = ref.where(...query)
        }
        if(orderListBy) {
            ref = ref.orderBy(...orderListBy);
        }

        //set up subscription
        //remember this subscription returns us an unsubscribe function
        const unsubscribe = ref.onSnapshot((snapshot) => {
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({...doc.data(), id: doc.id});
            })

            //update state
            setDocuments(results);
            setError(null);

        }, (error) => {
            console.log(error);
            setError("Could not fetch the data");
        }) 

        //----- unsubscribe --------
        return () => unsubscribe();

    }, [collection, query, orderListBy])

    return {documents, error}

}

// notes:
// error handling when we use onSnapshot():
//instead of using a catch block, we pass in a 2nd argument 
//which is a function that fires when we get an error

//onSanapshot:
// The listener can be cancelled by calling the function that is returned when onSnapshot is called.

//useRef:
//useRef helps us break out from an infinite loop when we use a "reference type" in our useEffect dependency array
// //when we wrap a reference type in useRef, React does not see it as a new array in this case
//in every component re-evaluation
//if we do not use useFef, _query is different on every function call