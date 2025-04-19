import React from "react";
import Axios from "axios";

const IP = "http://192.168.1.93:3000"

const emailVerify = async (email) => {
    try {
      const res = await Axios.post(
        `${IP}/auth/send-verification`,
        { email }
      );
      return res.data;
    } catch (error) {
      console.error("Email verification error raw:", error);
      // Prefer the backend’s `error` field, fallback to message
      const backendError = error.response?.data?.error;
      throw new Error(backendError || "Email verification failed. Please try again.");
    }
  };
  
  

const getCode = async (email, code) => {
  try {
    const res = await Axios.post(`${IP}/auth/verify-code`, {
      email: email,
      code: code,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

const completeRegistration = async (userData) => {
    try {
      const res = await Axios.post(
        `${IP}/auth/complete-registration`,
        userData
      );
      return res?.data; // optional chaining for safety
    } catch (error) {
        console.error("Registration Error Raw:", error);
        const backendError = error.response?.data?.error;
        throw new Error(backendError || "Something went wrong");
      }
  };

const loginUser = async (username, password) => {
    try {
      const res = await Axios.post(`${IP}/auth/login`, {
        username: username,
        password: password,
      });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      throw new Error(msg);
    }
  };
  

export { emailVerify, getCode, completeRegistration, loginUser };
