import axios from 'axios';
import { REACT_APP_BACKEND_SERVER_URL } from '../config/config.js';

const BASE = REACT_APP_BACKEND_SERVER_URL;
const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data?.message || "Something went wrong!";
    console.error("API Error:", message);
    throw new Error(message);
  } else if (error.request) {
    console.error("No response from server");
    throw new Error("No response from server.");
  } else {
    console.error("Error:", error.message);
    throw new Error(error.message);
  }
};

// create Lot
export const createLot = async (initialWeight, touchValue) => {
  try {
    const payload = { initialWeight, touchValue };
    const response = await axios.post(`${BASE}/api/lot/lotinfo`, payload);
    console.log("new lot", response.data.data[0]);
    return response.data.data[0];
  } catch (error) {
    handleApiError(error);
  }
};

// get All Lots
export const getAllLot = async () => {
  try {
    const response = await axios.get(`${BASE}/api/lot`, {
      params: { page: 1, limit: 2 }
    });
    console.log("all lot response", response.data.data);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Save Lot Value
export const saveLot = async (lotdata) => {
  try {
    const response = await axios.post(`${BASE}/api/process/saveProcess`, { lotdata });
    return response;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data?.statusMsg === "noMasterId") {
      alert(error.response.data.message);
      console.log(error.response);
      return;
    }
    handleApiError(error);
  }
};

// get Lots by Date Range
export const getLotDatewise = async (fromDate, toDate) => {
  try {
    const response = await axios.post(`${BASE}/api/process/getLotsByDateRange`, {
      fromDate,
      toDate
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

// get Product Names
export const getProductName = async () => {
  try {
    const response = await axios.get(`${BASE}/api/jewelType/getJewelType`);
    return response.data.allJewel;
  } catch (error) {
    handleApiError(error);
  }
};

// get All Lot Process
export const getAllLotProcess = async () => {
  try {
    const response = await axios.get(`${BASE}/api/process`);
    
    console.log('response',response.data.data)

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};
