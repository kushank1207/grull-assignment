import React, { useState, useEffect } from "react";
import {
  fetchQuests,
  applyForQuest,
  fetchUserApplications,
} from "../services/ApiService";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

const UserDashboard = () => {
  const [allQuests, setAllQuests] = useState([]);
  const [quests, setQuests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("exact");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token is missing");
      return;
    }

    const fetchData = async () => {
      try {
        const questsResponse = await fetchQuests(token);
        setAllQuests(questsResponse.data); // Save all quests before filtering
        setQuests(questsResponse.data); // Initialize quests with all quests
        const applicationsResponse = await fetchUserApplications(token);
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredQuests = allQuests.filter((quest) => {
      if (!searchTerm) return true;
      if (searchType === "exact") {
        return quest.description.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === "fuzzy") {
        // Implement fuzzy search logic here
      } else if (searchType === "NLP") {
        // Implement NLP search logic here
      }
      return false;
    });
    setQuests(filteredQuests);
  }, [searchTerm, searchType, allQuests]);

  const handleApply = async (questId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token is missing");
      return;
    }

    try {
      await applyForQuest(questId, "Applying for quest", token);
      alert("Applied successfully!");
      const applicationsResponse = await fetchUserApplications(token);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.error("Error applying for quest:", error);
      alert("Failed to apply for quest.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <h1>User Dashboard</h1>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search quests..."
          onChange={handleSearchChange}
        />
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title={searchType.charAt(0).toUpperCase() + searchType.slice(1)}
          id="input-group-dropdown-2"
        >
          <Dropdown.Item onClick={() => setSearchType("exact")}>
            Exact
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchType("fuzzy")}>
            Fuzzy
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchType("NLP")}>
            NLP
          </Dropdown.Item>
        </DropdownButton>
      </InputGroup>
      <Row>
        {quests.map((quest) => {
          const applicationForQuest = applications.find(
            (app) => app.quest_id === quest.id
          );
          return (
            <Col md={4} key={quest.id}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{quest.title}</Card.Title>
                  <Card.Text>{quest.description}</Card.Text>
                  <Card.Text>Reward: {quest.reward} points</Card.Text>
                  {applicationForQuest && (
                    <Card.Text>Status: {applicationForQuest.status}</Card.Text>
                  )}
                  <Button
                    variant={applicationForQuest ? "secondary" : "primary"}
                    onClick={() => handleApply(quest.id)}
                    disabled={!!applicationForQuest}
                  >
                    {applicationForQuest ? "Applied" : "Apply"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default UserDashboard;
