import mongoose from "mongoose";
const { Schema } = mongoose;

const submissionSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'problem',
      required: true
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'c++', 'java','python'] 
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'wrong', 'error'],
      default: 'pending'
    },
    runtime: {
      type: Number,  // milliseconds
      default: 0
    },
    memory: {
      type: Number,  // kB
      default: 0
    },
    errorMessage: {
      type: String,
      default: ''
    },
    testCasesPassed: {
      type: Number,
      default: 0
    },
    testCasesTotal: {  // Recommended addition
      type: Number,
      default: 0
    }
  }, { 
    timestamps: true
  });
  submissionSchema.index({userId:1 ,problemId:1 })  //:1 for ascending order  (-1 for decending order)

const Submission= mongoose.model('submission', submissionSchema)
export default Submission;