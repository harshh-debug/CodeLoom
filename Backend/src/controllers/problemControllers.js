import Problem from "../models/problems.js";
import SolutionVideo from "../models/solutionVideo.js";
import Submission from "../models/submissions.js";
import User from "../models/user.js";
import {
	getLanguageById,
	submitBatch,
	submitToken,
} from "../utils/problemUtility.js";

export const createProblem = async (req, res) => {
	if (!req.body) {
		console.log("Request body is missing");
		return res
			.status(400)
			.send(
				"Request body is missing. Please ensure Content-Type is set to application/json"
			);
	}

	const {
		title,
		description,
		difficulty,
		tags,
		visibleTestCases,
		hiddenTestCases,
		startCode,
		refrenceSolution,
		problemCreator,
	} = req.body;

	// Validate required fields
	if (
		!title ||
		!description ||
		!difficulty ||
		!tags ||
		!visibleTestCases ||
		!hiddenTestCases ||
		!startCode ||
		!refrenceSolution
	) {
		console.log("Missing required fields in request body");
		return res
			.status(400)
			.send(
				"Missing required fields: title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, refrenceSolution"
			);
	}

	try {
		console.log(
			"Number of languages in refrenceSolution:",
			refrenceSolution.length
		);
		for (const { language, completeCode } of refrenceSolution) {
			console.log("Processing language:", language);
			const languageId = getLanguageById(language);

			// batch submissions
			const submissions = visibleTestCases.map((testcase) => ({
				source_code: completeCode,
				language_id: languageId,
				stdin: testcase.input,
				expected_output: testcase.output,
			}));
			const submitResult = await submitBatch(submissions);

			const resultToken = submitResult.map((value) => value.token);

			const testResult = await submitToken(resultToken);
			console.log(
				"Test result for",
				language,
				":",
				testResult.length,
				"submissions"
			);
			// console.log(testResult)

			for (const test of testResult) {
				if (test.status_id == 4) {
					return res.status(400).send("test case failed");
				} else if (test.status_id == 5) {
					return res.status(400).send("time limit exceeded");
				} else if (test.status_id == 6) {
					return res.status(400).send("compilation error");
				} else if (
					test.status_id == 7 ||
					test.status_id == 8 ||
					test.status_id == 9 ||
					test.status_id == 10 ||
					test.status_id == 11 ||
					test.status_id == 12
				) {
					return res.status(400).send("runtime error");
				}
			}
		}

		// we can store it in the db

		const userProblem = await Problem.create({
			...req.body,
			problemCreator: req.result._id, //from admin middleware
		});
		res.status(201).send("problem created successfully");
		console.log("problem created successfully");
	} catch (error) {
		console.error("Error creating problem:", error);
		res.status(500).send(error.message);
	}
};

export const updateProblem = async (req, res) => {
	const { id } = req.params;

	const {
		title,
		description,
		difficulty,
		tags,
		visibleTestCases,
		hiddenTestCases,
		startCode,
		refrenceSolution,
		problemCreator,
	} = req.body;

	try {
		if (!id) {
			return res.status(400).send("Missing Id");
		}
		const oldProblem = await Problem.findById(id);
		if (!oldProblem) {
			return res.status(404).send("Invalid Id");
		}
		console.log(
			"Number of languages in refrenceSolution:",
			refrenceSolution.length
		);
		for (const { language, completeCode } of refrenceSolution) {
			console.log("Processing language:", language);
			const languageId = getLanguageById(language);

			// batch submissions
			const submissions = visibleTestCases.map((testcase) => ({
				source_code: completeCode,
				language_id: languageId,
				stdin: testcase.input,
				expected_output: testcase.output,
			}));
			const submitResult = await submitBatch(submissions);

			const resultToken = submitResult.map((value) => value.token);

			const testResult = await submitToken(resultToken);
			console.log(
				"Test result for",
				language,
				":",
				testResult.length,
				"submissions"
			);
			// console.log(testResult)

			for (const test of testResult) {
				if (test.status_id == 4) {
					return res.status(400).send("test case failed");
				} else if (test.status_id == 5) {
					return res.status(400).send("time limit exceeded");
				} else if (test.status_id == 6) {
					return res.status(400).send("compilation error");
				} else if (
					test.status_id == 7 ||
					test.status_id == 8 ||
					test.status_id == 9 ||
					test.status_id == 10 ||
					test.status_id == 11 ||
					test.status_id == 12
				) {
					return res.status(400).send("runtime error");
				}
			}
		}

		const newProblem = await Problem.findByIdAndUpdate(
			id,
			{ ...req.body },
			{ runValidators: true, new: true }
		);
		res.status(200).send(newProblem);
		console.log("Problem Updated Successfully");
	} catch (error) {
		res.status(400).send(error);
		console.log("Error updating problem");
	}
};

export const deleteProblem = async (req, res) => {
	const { id } = req.params;
	try {
		if (!id) {
			return res.status(400).send("Missing Id");
		}
		const deletedProblem = await Problem.findByIdAndDelete(id);
		if (!deletedProblem) {
			return res.status(404).send("Problem not found");
		}
		res.status(200).send("Successfully deleted");
		console.log("Problem deleted successfully");
	} catch (error) {
		res.status(500).send(error);
	}
};

export const getProblemById = async (req, res) => {
	const { id } = req.params;
	try {
		if (!id) {
			return res.status(400).send("Missing Id");
		}
		const getProblem = await Problem.findById(id).select(
			"_id title description difficulty tags visibleTestCases startCode refrenceSolution"
		);

		if (!getProblem) {
			return res.status(404).send("Problem not found");
		}

		const videos = await SolutionVideo.findOne({ problemId: id });

		if (videos) {
			const responseData = {
				...getProblem.toObject(),
				secureUrl: videos.secureUrl,
				thumbnailUrl: videos.thumbnailUrl,
				duration: videos.duration,
			};

			return res.status(200).send(responseData);
		}
		res.status(200).send(getProblem);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

export const getAllProblem = async (req, res) => {
	try {
		const getProblem = await Problem.find({}).select(
			"_id title difficulty tags"
		);
		if (getProblem.length == 0) {
			return res.status(404).send("No problem found");
		}
		res.status(200).send(getProblem);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const allProblemSolvedbyUser = async (req, res) => {
	try {
		const userId = req.result._id;
		const user = await User.findById(userId).populate({
			path: "problemSolved",
			select: "_id title difficulty tags",
		});
		res.status(200).send(user.problemSolved);
	} catch (error) {
		res.status(500).send("Error finding problem solved by user" + error);
	}
};

export const submittedProblems = async (req, res) => {
	try {
		const userId = req.result._id;
		const problemId = req.params.pid;

		const ans = await Submission.find({ userId, problemId });
		if (ans.length == 0) {
			return res.status(404).send("No submission is present");
		}
		res.status(200).send(ans);
	} catch (error) {
		res.status(500).send("Error fetching submittedProblems : " + error);
	}
};
