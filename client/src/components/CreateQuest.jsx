import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createQuest } from "../services/ApiService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateQuest = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fees: 0,
    start_time: new Date(),
    end_time: new Date(),
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value =
      e.target.name === "fees" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleDateChange = (field, date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a quest.");
      return;
    }

    const { title, description, fees, start_time, end_time } = formData;
    try {
      const formattedData = {
        title,
        description,
        fees,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
      };
      console.log("Creating quest:", formattedData, token);
      await createQuest(title, description, fees, start_time, end_time, token);
      alert("Quest created successfully!");
      navigate("/manager-dashboard");
    } catch (error) {
      console.error("Error creating quest:", error);
      alert("Failed to create quest.");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-5 text-center">Create Quest</h2>
      <Form onSubmit={handleSubmit} className="w-75 mx-auto">
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label className="font-weight-bold">Title</Form.Label>
          <Form.Control
            className="shadow-sm"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label className="font-weight-bold">Description</Form.Label>
          <Form.Control
            className="shadow-sm"
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicFees">
          <Form.Label className="font-weight-bold">Fees</Form.Label>
          <Form.Control
            className="shadow-sm"
            type="number"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="font-weight-bold">Start Time</Form.Label>
          <DatePicker
            className="form-control shadow-sm"
            selected={formData.start_time}
            onChange={(date) => handleDateChange("start_time", date)}
            showTimeSelect
            dateFormat="Pp"
            wrapperClassName="datepicker"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="font-weight-bold">End Time</Form.Label>
          <DatePicker
            className="form-control shadow-sm"
            selected={formData.end_time}
            onChange={(date) => handleDateChange("end_time", date)}
            showTimeSelect
            dateFormat="Pp"
            wrapperClassName="datepicker"
            minDate={formData.start_time}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="shadow-sm font-weight-bold mt-4"
        >
          Create Quest
        </Button>
      </Form>
    </Container>
  );
};

export default CreateQuest;
