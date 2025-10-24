import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			minLength: 3,
			maxLength: 20,
		},
		lastName: {
			type: String,
			trim: true,
			minLength: 3,
			maxLength: 20,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			immutable: true,
		},
		age: {
			type: Number,
			min: 5,
			max: 90,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		problemSolved: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "problem",
				},
			],
			// unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		avatar: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);
userSchema.post("findOneAndDelete", async function (userInfo) {
	await mongoose.model("submission").deleteMany({ userId: userInfo._id });
});
const User = mongoose.model("user", userSchema);
export default User;
