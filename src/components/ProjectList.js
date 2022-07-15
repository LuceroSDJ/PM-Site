import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import "./ProjectList.css";

export default function ProjectList({ projects }) {
    return (
        <div className="project-list">
            {projects.length === 0 && <p>No projects yet!</p>}
            {projects.map(project => (
                //link to a project details page which will be a dynamic value (variable is project id). Therefore, we can use template strings
                <Link to={`/projects/${project.id}`} key={project.id} className="link">
                    <h4>{project.name}</h4>
                    <p>Due by {project.dueDate.toDate().toDateString()}</p>
                    <div className="assigned-to">
                        <ul>
                            {project.assignedUsersList.map(user => (
                                <li key={user.photoURL}>
                                    <Avatar src={user.photoURL} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </Link>    
            ))}
        </div>
    )
}

{/* notes:
    Remember, project.dueDate is a firestore timestamp and we want to turn it into a javascript date string so we can output it in the browser.
  */}