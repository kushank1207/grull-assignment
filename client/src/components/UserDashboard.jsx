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
import { fuzzySearchEnhanced } from "./searchAlgo/fuzzy";

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
        setAllQuests(questsResponse.data);
        setQuests(questsResponse.data);
        const applicationsResponse = await fetchUserApplications(token);
        console.log("applicationsResponse", applicationsResponse.data);
        console.log("questsResponse", questsResponse.data);
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredQuests = [];
    if (!searchTerm) {
      filteredQuests = allQuests;
    } else if (searchType === "exact") {
      filteredQuests = allQuests.filter((quest) =>
        quest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType === "fuzzy") {
      filteredQuests = fuzzySearchEnhanced(searchTerm, allQuests);
    }
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
      // alert("Applied successfully!");
      const newApplication = {
        quest_id: questId,
        status: "Pending",
      };

      setApplications((prevApplications) => [
        ...prevApplications,
        newApplication,
      ]);

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
      <h1 className="my-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        User Dashboard
      </h1>
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
        </DropdownButton>
      </InputGroup>
      <Row>
        {quests.map((quest) => {
          const applicationForQuest = applications.find(
            (app) => app.quest_id === quest.id
          );
          const isApplied = Boolean(applicationForQuest);

          const statusClasses = {
            approved: "text-green-500",
            rejected: "text-red-500",
            pending: "text-yellow-500",
          };

          const statusClass = applicationForQuest?.status
            ? statusClasses[applicationForQuest.status.toLowerCase()]
            : "";

          return (
            <Col md={4} key={quest.id} className="mb-4">
              <Card className="shadow-lg rounded-lg">
                <Card.Body className="flex flex-col items-start p-4">
                  <h5 className="mt-4 text-xl font-bold text-gray-900">
                    {quest.title}
                  </h5>
                  <p className="mt-2 text-gray-500">{quest.description}</p>
                  <p className={`mt-2 font-semibold ${statusClass}`}>
                    Status:{" "}
                    {applicationForQuest?.status?.toUpperCase() ??
                      "Not Applied"}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Event Date: {new Date(quest.start_time).toLocaleString()} -{" "}
                    {new Date(quest.end_time).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Duration: {quest.duration} hr
                  </p>
                  <Button
                    variant={isApplied ? "secondary" : "primary"}
                    className="mt-auto w-100 font-bold py-2 px-4 rounded"
                    onClick={() => handleApply(quest.id)}
                    disabled={isApplied}
                  >
                    {isApplied ? "Applied" : "Apply"}
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
