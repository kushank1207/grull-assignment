import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateQuest from "./components/CreateQuest";
import NavigationBar from "./components/Navbar";
import ManagerDashboard from "./components/ManagerDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <Router>
      <div>
        <NavigationBar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createquest" element={<CreateQuest />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
