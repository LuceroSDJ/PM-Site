import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
//styles
import "./Navbar.css";
import Temple from "../assets/temple.svg";

export default function Navbar() {
    const { logout, isPending } = useLogout();
    const { user } = useAuthContext();
    return (
        <div className="navbar">
            <ul>
                <li className="logo">
                    <img src={Temple} alt="logo" />
                    <span>Collab</span>
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