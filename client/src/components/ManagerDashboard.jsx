import React, { useState, useEffect } from "react";
import {
  getManagerQuests,
  getApplicationsForQuest,
  updateApplicationStatus,
} from "../services/ApiService";
import { Card, Row, Col, Button } from "react-bootstrap";
import { SlideOverPanel } from "./SlideOverPanel";

const ManagersDashboard = () => {
  const [show, setShow] = useState(false);
  const [quests, setQuests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState(null);
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchQuests();
  }, []);

  useEffect(() => {
    if (selectedQuestId !== null) {
      setOpen(true);
    }
  }, [selectedQuestId]);

  const fetchQuests = async () => {
    const response = await getManagerQuests(token);
    if (response.data) {
      setQuests(response.data);
    }
  };

  const fetchApplications = async (questId) => {
    // console.log("fetchApplications", questId);
    const response = await getApplicationsForQuest(questId, token);
    if (response.data) {
      setApplications(response.data);
      setSelectedQuestId(questId);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    // console.log("applicationId", token);
    try {
      await updateApplicationStatus(applicationId, status, token);
    } catch (error) {
      alert("Failed to update application status");
    }
    fetchApplications(selectedQuestId);
  };

  const handleApprove = (applicationId) => {
    handleUpdateApplicationStatus(applicationId, "approved");
  };

  const handleReject = (applicationId) => {
    handleUpdateApplicationStatus(applicationId, "rejected");
  };

  return (
    <div className="container">
      <h1 className="my-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Manager's Dashboard
      </h1>
      <div>
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Your Quests
        </h2>
        <Row>
          {quests.map((quest) => (
            <Col md={4} key={quest.id}>
              <Card className="shadow-lg rounded-lg">
                <Card.Body className="flex flex-col items-start p-4">
                  <h5 className="mt-4 text-xl font-bold text-gray-900">
                    {quest.title}
                  </h5>
                  <p className="mt-2 text-gray-500">{quest.description}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Fees: ₹{quest.fees.toLocaleString()}
                  </p>
                  <Button
                    variant="primary"
                    className="mt-auto w-100 font-bold py-2 px-4 rounded"
                    onClick={() => {
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
      <SlideOverPanel
        open={open}
        setOpen={setOpen}
        applications={applications}
        onApprove={handleApprove}
        onReject={handleReject}
        selectedQuestId={selectedQuestId}
      />
    </div>
  );
};

export default ManagersDashboard;
