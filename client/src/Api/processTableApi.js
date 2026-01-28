import axios from 'axios';
import { REACT_APP_BACKEND_SERVER_URL } from '../config/config.js';
import { toast } from "react-toastify";

const BASE = REACT_APP_BACKEND_SERVER_URL;
const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data?.message || "Something went wrong!";
    toast.error(message);
    // throw new Error(message);
  } else if (error.request) {
    toast.error("No response from server.");
    // throw new Error("No response from server.");
  } else {
    toast.error(error.message);
    // throw new Error(error.message);
  }
};


// create Lot
export const createLot = async (initialWeight, touchValue) => {
  try {
    const payload = { initialWeight, touchValue };
    await axios.post(`${BASE}/api/lot/lotinfo`, payload);
   
  } catch (error) {
    handleApiError(error);
  }
};

// get All Lots
export const getAllLot = async () => {
  try {
    const response = await axios.get(`${BASE}/api/lot`);
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
     
     if(response.data.status==='ok'){
        toast.success('Process Saved...')
     }
     return response.data

  } catch (error) {
    if (error.response?.status === 400 && error.response.data?.statusMsg === "noMasterId") {
      toast.error(error.response.data.message);
      console.log(error.response);
      return;
    }
    handleApiError(error);
  }
};

// get Lots by Date Range
export const getLotDatewise = async (fromDate, toDate) => {
  try {
    const response = await axios.get(`${BASE}/api/lot/lotByDateRange`, {
      params:{
          fromDate,
          toDate
      }
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

    return response.data.data||[];
  } catch (error) {
    handleApiError(error);
  }
};
