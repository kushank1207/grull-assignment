import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createQuest } from "../../services/ApiService";

const CreateQuest = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    reward: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a quest.");
      return;
    }

    try {
      await createQuest(token, formData);
      alert("Quest created successfully!");
      navigate("/quests"); // Redirect to quests page
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

        <Form.Group className="mb-3" controlId="formBasicDuration">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="text"
            name="duration"
            value={formData.duration}
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
