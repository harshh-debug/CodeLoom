import axios from "axios";
import { getCurrentJudgeKey, rotateJudge0Key } from "./keymanager.js";

export const getLanguageById = (lang) => {
  const language = {
    "c++": 105,
    java: 91,
    python: 109,
    javascript: 102,
  };
  return language[lang.toLowerCase()];
};

// 🧩 helper function to wait
const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitBatch = async (submissions) => {
  const fetchData = async () => {
    const apiKey = getCurrentJudgeKey();

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: { base64_encoded: "false" },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: { submissions },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 || error.response?.status === 403) {
        rotateJudge0Key(); // switch to next key globally
        return await fetchData(); // retry
      }
      console.error("Judge0 API Error:", error.response?.data || error.message);
      throw new Error(`Judge0 API Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return await fetchData();
};

export const submitToken = async (resultToken) => {
  const fetchData = async () => {
    const apiKey = getCurrentJudgeKey();

    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: resultToken.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 || error.response?.status === 403) {
        rotateJudge0Key(); // switch globally
        return await fetchData(); // retry with new key
      }
      console.error("Judge0 API Error:", error.response?.data || error.message);
      throw new Error(`Judge0 API Error: ${error.response?.data?.message || error.message}`);
    }
  };

  while (true) {
    const result = await fetchData();
    if (!result || !result.submissions) {
      throw new Error("Invalid response from Judge0 API");
    }
    const isResultObtained = result.submissions.every((r) => r.status_id > 2);
    if (isResultObtained) {
      return result.submissions;
    }
    await waiting(1000);
  }
};
