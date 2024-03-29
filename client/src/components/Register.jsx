import React, { useState } from "react";
import { register } from "../services/ApiService";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    specialization: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Registering user:", newUser);
      await register(
        newUser.username,
        newUser.password,
        newUser.specialization,
        newUser.role
      );
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error.response.data);
      alert("Registration failed.");
    }
  };
  const handleRegister = () => {
    navigate("/login");
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicSpecialization">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                name="specialization"
                value={newUser.specialization}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={newUser.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="community_manager">Community Manager</option>
              </Form.Control>
            </Form.Group>

            <Button className="mt-4" variant="primary" type="submit">
              Register
            </Button>
          </Form>
          <div className="flex justify-center align-items-baseline mt-4">
            <p className="m-2">Already a user?</p>
            <Button
              variant="primary"
              type="submit"
              className="m-2"
              onClick={handleRegister}
            >
              Login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
