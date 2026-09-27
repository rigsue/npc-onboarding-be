import {
    createExamAttAns,
    findAllExamAttempts,
    findExamAttAnsById,
    findExamAttAnsByAtt,
    updateExamAttAns
} from "../models/examAttAnsModel.js";

export async function createExamAttAnswer(req, res,next) {
    try {
        const {
            examAttemptId,
            questionId,
            choiceId,
            answerText
        } = req.body;

        if (!examAttemptId || !questionId) {
            const error = new Error(
                "Exam attempt ID and question ID are required"
            );
            error.status = 400;
            error.code = "missing_answer_fields";
            throw error;
        }
        const answer = await createExamAttAns(
            examAttemptId,
            questionId,
            choiceId,
            answerText
        );
        return res.status(201).json({
            message: "Exam answer submitted successfully",
            data: answer
        });
    } catch (err) {
        next(err);
    }
}

export async function getAllExamAttAnswer(_req, res, next) {
    try {
        const examAttAns = await findAllExamAttempts();

        return res.status(200).json({
            message: "Exam Attempt Answers retrived successfully",
            data: examAttAns
        });
    } catch (error) {
        next(error);
    }
}

export async function getExamAttAnsById(req, res, next) {
    try {
        const { id } = req.params;

        const answer = await findExamAttAnsById(id);

        if (!answer) {
            const error = new Error(
                "Exam attempt answer not found"
            );
            error.status = 404;
            error.code = "exam_attempt_answer_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Exam attempt answer retrieved successfully",
            data: answer
        });
    } catch (err) {
        next(err);
    }
}

export async function getExamAttAnsByAtt(req, res, next) {
    try {
        const { attemptId } = req.params;

        const answers = await findExamAttAnsByAtt(
            attemptId
        );
        return res.status(200).json({
            message: "Exam attempt answers retrieved successfully",
            data: answers
        });
    } catch (err) {
        next(err);
    }
}

export async function updateExamAttAnswer(req, res, next) {
    try {
        const { id } = req.params;

        const {
            choiceId,
            answerText
        } = req.body;

        const answer = await updateExamAttAns(
            id,
            choiceId,
            answerText
        );
        if (!answer) {
            const error = new Error(
                "Exam attempt answer not found"
            );
            error.status = 404;
            error.code = "exam attempt answer not found";
            throw error;
        }
        return res.status(200).json({
            message: "Exam attempt answer updated successfully",
            data: answer
        });

    } catch (err) {
        next(err);
    }
}