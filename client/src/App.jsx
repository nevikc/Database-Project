import './App.css'
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Jobs from "./pages/Jobs";
import Employee from "./pages/Employee";
import Home from "./pages/Home"

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
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/employees" element={<Employee/>} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
