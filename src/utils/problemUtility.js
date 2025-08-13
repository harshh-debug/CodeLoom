import axios from "axios";

export const getLanguageById = (lang) => {
	const language = {
		"c++": 105,
		"java": 91,
		"python": 109,
		"javascript": 102,
	};
	return language[lang.toLowerCase()];
};

export const submitBatch = async (submissions) => {
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
			console.error(error);
		}
	}

	return await fetchData();
};

const waiting = (ms) => {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log("retrying submission");
			resolve();
		}, ms);
	});
};

export const submitToken = async (resultToken) => {
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
			console.error(error);
		}
	}
	while (true) {
		const result = await fetchData();
		const isResultObtained = result.submissions.every((r) => r.status_id > 2);
		if (isResultObtained) {
			return result.submissions; // This will exit the loop
		}
		await waiting(1000); 
	}
};
