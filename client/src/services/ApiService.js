import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';
// const API_URL = 'https://grull-backend.onrender.com/';

export const register = (username, password, specialization) => {
  return axios.post(`${API_URL}/api/register`, {
    username,
    password,
    specialization
  });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/api/login`, JSON.stringify({ username, password }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const fetchQuests = (token) => {
  return axios.get(`${API_URL}/api/quests`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createQuest = (token, title, description, duration, reward, points) => {
  return axios.post(`${API_URL}/quests`, { title, description, duration, reward }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateQuest = (token, questId, questData) => {
    return axios.put(`${API_URL}/quests/${questId}`, questData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
  
  export const deleteQuest = (token, questId) => {
    return axios.delete(`${API_URL}/quests/${questId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
  
  export const fetchQuestDetails = (token, questId) => {
    return axios.get(`${API_URL}/quests/${questId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
  
  export const updateUserProfile = (token, userData) => {
    return axios.put(`${API_URL}/user/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
    