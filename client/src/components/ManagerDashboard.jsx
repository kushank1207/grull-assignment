import React, { useState, useEffect } from "react";
import {
  getManagerQuests,
  getApplicationsForQuest,
  updateApplicationStatus,
} from "../services/ApiService";
import { Card, Row, Col, Button } from "react-bootstrap";

const ManagersDashboard = () => {
  const [show, setShow] = useState(false);
  const [quests, setQuests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    const response = await getManagerQuests(token);
    if (response.data) {
      setQuests(response.data);
    }
  };

  const fetchApplications = async (questId) => {
    setSelectedQuestId(questId);
    const response = await getApplicationsForQuest(questId, token);
    if (response.data) {
      setApplications(response.data);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    console.log("applicationId", token);
    try {
      await updateApplicationStatus(applicationId, status, token);
      alert(`Status of application ${applicationId} has been updated to ${status}`);
    } catch (error) {
      alert("Failed to update application status");
    }
  };
  //   const response = await updateApplicationStatus(
  //     applicationId,
  //     status,
  //     token
  //   );
  //   if (response.data) {
  //     alert(`Application ${status}`);
  //     fetchApplications(selectedQuestId);
  //   }
  // };

  return (
    <div className="container">
      <h2>Manager's Dashboard</h2>
      <div>
        <h3>Your Quests</h3>
        <Row>
        {quests.map((quest) => (
          <Col md={4} key={quest.id}>
            <Card className="mb-4" onClick={() => fetchApplications(quest.id)}>
              <Card.Body>
                <Card.Title>{quest.title}</Card.Title>
                <Card.Text>{quest.description}</Card.Text>
                <Card.Text>Reward: {quest.reward} points</Card.Text>
                <Button
                  variant="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchApplications(quest.id);
                    setShow(!show);
                  }}
                >
                  View Applications
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        </Row>
      </div>
      {show && selectedQuestId && (
        <div>
        <h3>Applications for Quest {selectedQuestId}</h3>
        {applications.map((application) => (
          <div className="flex justify-between border-2 p-2" key={application.id}>
            <div>
              <p>User ID: {application.user_id}</p>
              <p>Application Text: {application.application_text}</p>
            </div>
            <div className="flex items-center">
              <p className="mr-4 font-semibold">
                Status: 
                <span className={`ml-1 ${application.status === 'approved' ? 'text-green-500' : application.status === 'rejected' ? 'text-red-500' : 'text-gray-500'}`}>
                  {application.status.toUpperCase()}
                </span>
              </p>
            </div>
            <div>
              <button
                className="mx-1 rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() =>
                  handleUpdateApplicationStatus(application.id, "approved", token)
                }
              >
                Approve
              </button>
              <button
                className="mx-1 rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() =>
                  handleUpdateApplicationStatus(application.id, "rejected", token)
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default ManagersDashboard;
