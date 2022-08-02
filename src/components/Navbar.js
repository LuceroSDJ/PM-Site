import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
//styles
import "./Navbar.css";
import Temple from "../assets/temple.svg";
import Team from "../assets/team.svg";
import TeamIcon from "../assets/icons8-team-64.png";

export default function Navbar() {
    const { logout, isPending } = useLogout();
    const { user } = useAuthContext();
    return (
        <div className="navbar">
            <ul>
                <li className="logo">
                    <img src={TeamIcon} alt="logo" />
                    <span>PM Web App</span>
                </li>
                {/* conditional render navbar links  */}
                {!user && (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Signup</Link></li>
                    </>
                )}
                {user && <li><button className="btn" onClick={logout}>Logout</button></li>}      
            </ul>

        </div>
    )
}
