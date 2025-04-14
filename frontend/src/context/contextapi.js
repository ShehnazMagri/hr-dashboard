import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api'; 


// Helper function to get token from cookies
const getToken = () => {
    const token = Cookies.get('token'); 
    return token || null; 
  };



// Register API call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return {
      success: true,
      data: response.data, 
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.msg || 'Registration failed. Please try again.',
    };
  }
};

// Login API call
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return {
      success: true,
      data: response.data, // { msg: "Successfully logged in", token: "jwt_token" }
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.msg || 'Login failed. Please try again.',
    };
  }
};




// Create Candidate API call
export const createCandidate = async (candidateData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token, // Match backend middleware expectation
        },
      };
      const response = await axios.post(`${API_URL}/candidates`, candidateData, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || error.message || 'Failed to create candidate.',
      };
    }
  };
  
  // Get Candidates API call
  export const getCandidates = async (search = '', status = '') => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const config = {
        headers: {
          token: token, // Send token in 'token' header
        },
        params: {
          search,
          status,
        },
      };
      const response = await axios.get(`${API_URL}/get-candidates`, config); // Correct URL
      return {
        success: true,
        data: response.data.candidates,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || error.message || 'Failed to fetch candidates.',
      };
    }
  };  


// Delete Candidate API call
export const deleteCandidate = async (candidateId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const config = {
        headers: {
          token: token,
        },
      };
      const response = await axios.delete(`${API_URL}/delete-candidate/${candidateId}`, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || error.message || 'Failed to delete candidate.',
      };
    }
  };

  // Download Resume API call
export const downloadResume = async (candidateId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const config = {
        headers: {
          token: token, // Match backend middleware expectation
        },
        responseType: 'blob', // Important for handling file downloads
      };
      const response = await axios.get(`${API_URL}/candidates/resume/${candidateId}`, config);
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Use a default file name or extract it from response headers if available
      link.setAttribute('download', `resume-${candidateId}.pdf`); // Adjust extension if needed
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
  
      return {
        success: true,
        data: { msg: 'Resume downloaded successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || error.message || 'Failed to download resume.',
      };
    }
  };

  // Search Candidates by Name API call
export const searchCandidatesByName = async (name) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const config = {
        headers: {
          token: token,
        },
      };
      const response = await axios.get(`${API_URL}/search-candidates?name=${encodeURIComponent(name)}`, config);
      return {
        success: true,
        data: response.data.candidates,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || error.message || "Failed to search candidates.",
      };
    }
  };

  // Update Candidate API call
export const updateCandidate = async (candidateId, candidateData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        token: token,
      },
    };
    const response = await axios.put(`${API_URL}/update-candidates/${candidateId}`, candidateData, config);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.msg || error.message || "Failed to update candidate.",
    };
  }
};