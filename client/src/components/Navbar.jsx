import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate(); // Use useNavigate directly in the component
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Consider also removing the role on logout
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer
          to={
            isLoggedIn
              ? userRole === "community_manager"
                ? "/manager-dashboard"
                : "/user-dashboard"
              : "/"
          }
        >
          <Navbar.Brand>Netropolis</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && userRole === "community_manager" && (
              <LinkContainer to="/createquest">
                <Nav.Link>Create Quest</Nav.Link>
              </LinkContainer>
            )}
            {isLoggedIn && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
