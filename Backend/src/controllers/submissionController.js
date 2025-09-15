import Problem from "../models/problems.js";
import Submission from "../models/submissions.js";

import {
	getLanguageById,
	submitBatch,
	submitToken,
} from "../utils/problemUtility.js";

export const submitCode = async (req, res) => {
	try {
		const userId = req.result._id;
		const problemId = req.params.id;
		const { code, language } = req.body;
		if (!userId || !problemId || !code || !language) {
			return res.status(400).send("Required field missing");
		}

		//fetching problem
		const problem = await Problem.findById(problemId);
		if (!problem) {
			return res.status(404).send("Problem not found");
		}
		//getting testcases(Hidden)

		//first storing code in DB and then to judge0 will update the status later
		const submittedResult = await Submission.create({
			userId,
			problemId,
			code,
			language,
			status: "pending",
			testCasesTotal: problem.hiddenTestCases.length,
		});
		console.log("Code submitted to DB");
		
		// submitting to judge0
		


		const languageId = getLanguageById(language);

		const submissions = problem.hiddenTestCases.map((testcase) => ({
			source_code: code,
			language_id: languageId,
			stdin: testcase.input,
			expected_output: testcase.output,
		}));
		const submitResult = await submitBatch(submissions);
		if (!submitResult || !Array.isArray(submitResult)) {
			throw new Error("Invalid response from Judge0 API");
		}
		const resultToken = submitResult.map((value) => value.token);
		const testResult = await submitToken(resultToken);

		//updating submitted result
		let testCasesPassed = 0;
		let runtime = 0;
		let memory = 0;
		let status = "accepted";
		let errorMessage = null;
		for (const test of testResult) {
			if (test.status_id == 3) {
				testCasesPassed++;
				runtime = runtime + parseFloat(test.time);
				memory = Math.max(memory, test.memory);
			} else {
				if (test.status_id == 4) {
					status = "error";
					errorMessage = test.stderr;
				} else {
					status = "wrong";
					errorMessage = test.stderr;
				}
			}
		}

		submittedResult.status = status;
		submittedResult.testCasesPassed = testCasesPassed;
		submittedResult.errorMessage = errorMessage;
		submittedResult.runtime = runtime;
		submittedResult.memory = memory;

		await submittedResult.save();

		//adding problem to userSchema problemSolved if not present

		if (!req.result.problemSolved.includes(problemId)) {
			req.result.problemSolved.push(problemId);
			await req.result.save();
		}

		const accepted = (status == "accepted");
		res.status(201).json({
			accepted,
			totalTestCases: submittedResult.testCasesTotal,
			passedTestCases: testCasesPassed,
			runtime,
			memory,
		});
	} catch (err) {
		console.error("Error in runCode:", err);
		res.status(500).send("Internal Server Error: " + err.message);
	}
};

export const runCode = async (req, res) => {
	try {
		const userId = req.result._id;
		const problemId = req.params.id;
		const { code, language } = req.body;
		if (!userId || !problemId || !code || !language) {
			return res.status(400).send("Required field missing");
		}

		//fetching problem
		const problem = await Problem.findById(problemId);
		if (!problem) {
			return res.status(404).send("Problem not found");
		}
		
		
		// submitting to judge0

		const languageId = getLanguageById(language);
		

		const submissions = problem.visibleTestCases.map((testcase) => ({
			source_code: code,
			language_id: languageId,
			stdin: testcase.input,
			expected_output: testcase.output,
		}));
		const submitResult = await submitBatch(submissions);
		if (!submitResult || !Array.isArray(submitResult)) {
			throw new Error("Invalid response from Judge0 API");
		}
		const resultToken = submitResult.map((value) => value.token);
		const testResult = await submitToken(resultToken);

		let testCasesPassed = 0;
		let runtime = 0;
		let memory = 0;
		let status = true;
		let errorMessage = null;

		for (const test of testResult) {
			if (test.status_id == 3) {
				testCasesPassed++;
				runtime = runtime + parseFloat(test.time);
				memory = Math.max(memory, test.memory);
			} else {
				if (test.status_id == 4) {
					status = false;
					errorMessage = test.stderr;
				} else {
					status = false;
					errorMessage = test.stderr;
				}
			}
		}

		res.status(201).json({
			success: status,
			testCases: testResult,
			runtime,
			memory,
		});
	} catch (err) {
		console.error("Error in runCode:", err);
		res.status(500).send("Internal Server Error: " + err.message);
	}
};
