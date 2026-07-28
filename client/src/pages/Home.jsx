import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="page">
        <h1>Welcome to HR Application</h1>
        <p>Select a menu to get started</p>
         <div className="home-menu">
                <Link to="/Employees" className="home-card">
                    <h2>Employees</h2>
                    <p>View, hire, and manage employees.</p>
                </Link>

                <Link to="/Jobs" className="home-card">
                    <h2>Jobs</h2>
                    <p>Create and manage job positions.</p>
                </Link>
          </div>
    </div>
  );
}

export default Home;
