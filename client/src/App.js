import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Quests from "./components/User/Quests";
import CreateQuest from "./components/Manager/CreateQuest";
import NavigationBar from "./components/Navbar";
import ManagerDashboard from "./components/Manager/ManagerDashboard";
import UserDashboard from "./components/User/UserDashboard";

function App() {
  return (
    <Router>
      <div>
        <NavigationBar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/createquest" element={<CreateQuest />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
