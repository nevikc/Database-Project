import './App.css'
import { Routes, Route, NavLink } from "react-router-dom";
import Jobs from "./pages/Jobs";
import Employee from "./pages/Employee";
import Home from "./pages/Home"
import IdentifyJob from "./pages/IdentifyJob";

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo">
            <NavLink to="/" className="home-link">
              HR Application
            </NavLink>
          </div>

          <div className="nav-links">
            {(
              <>
                <NavLink to="/employees" end>
                  Employee Main Menu
                </NavLink>
                <NavLink to="/jobs">Jobs Main Menu</NavLink>
                <NavLink to="/jobs/identify">Identify Job Description</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/employees" element={<Employee/>} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/identify" element={<IdentifyJob />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
