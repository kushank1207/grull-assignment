import React, { useState, useEffect } from "react";
import { fetchQuests } from "../../services/ApiService";
import { Card, Container, Row, Col } from "react-bootstrap";

const Quests = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchAndSetQuests = async () => {
      try {
        // Assume the token is stored in localStorage after login
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetchQuests(token); // Corrected usage
        setQuests(response.data);
      } catch (error) {
        console.error("Error fetching quests:", error);
        alert("Failed to fetch quests.");
      }
    };

    fetchAndSetQuests();
  }, []);

  return (
    <Container>
      <Row>
        {quests.map((quest) => (
          <Col md={4} key={quest.id}>
            <Card>
              <Card.Body>
                <Card.Title>{quest.title}</Card.Title>
                <Card.Text>{quest.description}</Card.Text>
                <Card.Text>Duration: {quest.duration}</Card.Text>
                <Card.Text>Reward: {quest.reward} points</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Quests;