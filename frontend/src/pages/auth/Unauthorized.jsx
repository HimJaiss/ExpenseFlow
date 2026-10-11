import { Link } from "react-router-dom";
export default function Unauthorized(){return <div className="center-page"><h1>Access restricted</h1><p>Your role does not have access to this page.</p><Link className="button button-primary" to="/dashboard">Return to dashboard</Link></div>}
