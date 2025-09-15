import axios from "axios";

export const getLanguageById = (lang) => {
	const language = {
		"c++": 105,
		java: 91,
		python: 109,
		javascript: 102,
	};
	return language[lang.toLowerCase()];
};

export const submitBatch = async (submissions) => {
	if (!process.env.JUDGE0_KEY) {
		throw new Error("JUDGE0_KEY environment variable is not set");
	}

	const options = {
		method: "POST",
		url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
		params: {
			base64_encoded: "false",
		},
		headers: {
			"x-rapidapi-key": process.env.JUDGE0_KEY,
			"x-rapidapi-host": "judge0-ce.p.rapidapi.com",
			"Content-Type": "application/json",
		},
		data: {
			submissions,
		},
	};

	async function fetchData() {
		try {
			const response = await axios.request(options);
			return response.data;
		} catch (error) {
			console.error("Judge0 API Error:", error.response?.data || error.message);
			throw new Error(
				`Judge0 API Error: ${error.response?.data?.message || error.message}`
			);
		}
	}

	return await fetchData();
};

const waiting = (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log("retrying submission");
			resolve();
		}, ms);
	});
};

export const submitToken = async (resultToken) => {
	if (!process.env.JUDGE0_KEY) {
		throw new Error("JUDGE0_KEY environment variable is not set");
	}

	const options = {
		method: "GET",
		url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
		params: {
			tokens: resultToken.join(","),
			base64_encoded: "false",
			fields: "*",
		},
		headers: {
			"x-rapidapi-key": process.env.JUDGE0_KEY,
			"x-rapidapi-host": "judge0-ce.p.rapidapi.com",
		},
	};

	async function fetchData() {
		try {
			const response = await axios.request(options);
			return response.data;
		} catch (error) {
			console.error("Judge0 API Error:", error.response?.data || error.message);
			throw new Error(
				`Judge0 API Error: ${error.response?.data?.message || error.message}`
			);
		}
	}
	while (true) {
		const result = await fetchData();
		if (!result || !result.submissions) {
			throw new Error("Invalid response from Judge0 API");
		}
		const isResultObtained = result.submissions.every((r) => r.status_id > 2);
		if (isResultObtained) {
			return result.submissions; // This will exit the loop
		}
		await waiting(1000);
	}
};
