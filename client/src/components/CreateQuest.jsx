import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createQuest } from "../services/ApiService";

const CreateQuest = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // const userRole = localStorage.getItem("role");
    if (!token) {
      alert("You must be logged in to create a quest.");
      return;
    }

    try {
      const { title, description, reward } = formData;
      console.log("Creating quest:", title, description, reward, token);
      await createQuest(title, description, reward, token);
      alert("Quest created successfully!");
      navigate('/manager-dashboard')
    } catch (error) {
      console.error("Error creating quest:", error);
      alert("Failed to create quest.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicReward">
          <Form.Label>Reward</Form.Label>
          <Form.Control
            type="number"
            name="reward"
            value={formData.reward}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Quest
        </Button>
      </Form>
    </Container>
  );
};

export default CreateQuest;
