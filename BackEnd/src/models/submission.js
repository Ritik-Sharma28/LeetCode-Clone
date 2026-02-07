import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'cpp', 'java'],
    },
    status: {
        type: String,
        enum: ["Compilation Service Error", "pending", "Accepted", "Wrong Answer", "Runtime Error"],
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
    testCasesTotal: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


submissionSchema.index({ userId: 1, problemId: 1 });


export const Submission = mongoose.model('submission', submissionSchema);
