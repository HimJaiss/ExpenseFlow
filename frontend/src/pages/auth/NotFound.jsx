import { Link } from "react-router-dom";
export default function NotFound(){return <div className="center-page"><h1>Page not found</h1><p>The page may have moved or the link is incorrect.</p><Link className="button button-primary" to="/dashboard">Go to dashboard</Link></div>}
