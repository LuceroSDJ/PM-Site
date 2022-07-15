import { useEffect, useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Create.css";

const categories = [
    {value: "development", label: "Development"},
    {value: "design", label: "Design"},
    {value: "test", label: "Test"},
    {value: "deployment", label: "Deployment"}
]

export default function Create() {
    const navigate = useNavigate();
    //custom hooks
    const { documents } = useCollection("users");
    const [users, setUsers] = useState([]);
    const { user } = useAuthContext();
    const { addDocument, response } = useFirestore("projects");

    //form field values
    const [name, setName] = useState("");
    const [details, setDetails] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [category, setCategory] = useState("");
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [formError, setFormError] = useState(null);

   useEffect(() => {
       if(documents) {
            const options = documents.map((userObj) => {
                return {value: userObj, label: userObj.displayName }
           })
           setUsers(options);
       }
   }, [documents])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if(!category) {
            setFormError("Please select a project category.");
            return;
        }
        if(assignedUsers.length < 1 ) {
            setFormError("Please assign the project to at least one user.");
            return;
        }

        const createdBy = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: user.uid
        }
        const assignedUsersList = assignedUsers.map((user) => {
            return {
                displayName: user.value.displayName,
                photoURL: user.value.photoURL,
                id: user.value.id
            }
        })
        //this is the object that we want to save to the database as a document
        const project = {
            name, 
            details,
            category: category.value,
            dueDate: timestamp.fromDate(new Date(dueDate)),
            comments: [],
            // createdBy: createdBy, 
            createdBy,
            assignedUsersList   
        }
        console.log(project);
        await addDocument(project);

        //if no error, redirect user to Dashborad 
        if(!response.error) {
            navigate("/");
        }
    }

    return (
        <div className="create-form">
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Project name:</span>
                    <input 
                        required
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </label>
                <label>
                    <span>Project details:</span>
                    <textarea 
                        required
                        type="text"
                        onChange={(e) => setDetails(e.target.value)}
                        value={details}
                    ></textarea>
                </label>
                <label>
                    <span>Set due date:</span>
                    <input 
                        required
                        type="date"
                        onChange={(e) => setDueDate(e.target.value)}
                        value={dueDate}
                    />
                </label>

                {/* use select dropdowns  */}
                <label>
                    <span>Project category:</span>
                    <Select 
                        options={categories}
                        // onCahnge takes the current option user selects
                        onChange={(option) => setCategory(option)}
                    />
                </label>
                <label>
                    <span>Assign to:</span>
                    <Select 
                        options={users}
                        onChange={(options) => setAssignedUsers(options)}
                        isMulti
                    />
                </label>

                <button className="btn">Add Project</button>

                {formError && <p className="error">{formError}</p>}

            </form>
        </div>
    )
}

//notes
//How did we list all the current users in the drop down menu:
//fetch users from firestore, create an new array of objects to pass it as the "options" property value in <Select />
    // for each user (document) create new object with value and label properties, 
    // store them in a piece of state "users"