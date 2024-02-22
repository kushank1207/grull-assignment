import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;


export const register = (username, password, specialization, role) => {
  return axios.post(`${API_URL}/api/register`, { username, password, specialization, role});
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/api/login`, { username, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const fetchQuests = (token) => {
  return axios.get(`${API_URL}/api/quests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createQuest = (title, description, fees, start_time, end_time, token) => {
  return axios.post(`${API_URL}/api/quests`, { title, description, fees, start_time, end_time }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const applyForQuest = (questId, applicationText, token) => {
  console.log('applyForQuest', questId, applicationText, token);
  return axios.post(`${API_URL}/api/quests/${questId}/apply`, { application_text: applicationText }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// fetch quests by manager id
export const getManagerQuests = async (token) => {
  return axios.get(`${API_URL}/api/quests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Fetch applications for a specific quest
export const getApplicationsForQuest = async (questId, token) => {
  return axios.get(`${API_URL}/api/quests/${questId}/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Update the status of an application
export const updateApplicationStatus = async (applicationId, status, token) => {
  return axios.put(`${API_URL}/api/applications/${applicationId}/${status}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchUserApplications = async (token) => {
  return axios.get(`${API_URL}/api/user/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}