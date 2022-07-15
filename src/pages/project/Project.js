//goals: extract the parameter "id" from the route using useParams Hook / use useDocument custom Hook to fetch a single document
import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
// import { projectAuth } from "../../firebase/config";
import "./Project.css";
import ProjectComments from "./ProjectComments";
import ProjectSummary from "./ProjectSummary";

export default function Project() {
    const { id } = useParams();
    const { document, error } = useDocument("projects", id);

    //conditional template rendering
    if(error) {
        return <div className="error">{error}</div>
    }
    if(!document) {
        return <div className="loading">Loading ...</div>
    }

    return (
        <div className="project-details">
            <ProjectSummary project={document} />
            <ProjectComments project={document} />
        </div>
    )
}