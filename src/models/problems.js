import mongoose from "mongoose";
const { Schema } = mongoose;

const problemSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	difficulty: {
		type: String,
		enum: ["easy", "medium", "hard"],
		required: true,
	},
	tags: {
		type: [String],
		required: true,
	},
	visibleTestCases: [
		{
			input: {
				type: String,
				required: true,
			},
			output: {
				type: String,
				required: true,
			},
			explanation: {
				type: String,
				required: true,
			},
		},
	],

	hiddenTestCases: [
		{
			input: {
				type: String,
				required: true,
			},
			output: {
				type: String,
				required: true,
			},
		},
	],

	startCode: [
		{
			language: {
				type: String,
				required: true,
			},
			boilerplate: {
				type: String,
				required: true,
			},
		},
	],
	refrenceSolution: [
		{
			language: {
				type: String,
				required: true,
			},
			completeCode: {
				type: String,
				required: true,
			},
		},
	],

	problemCreator: {
		type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
	},
});

const Problem = mongoose.model("problem", problemSchema);
export default Problem;