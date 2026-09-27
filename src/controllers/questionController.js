import {
    createQuestion,
    findAllQuestions,
    findQuesByExamId,
    findQuesById,
    updateQuesById,
    updateQuesStatus
} from "../models/questionModel.js";

export async function makeQuestion(req, res, next) {
    try {
        const {
            examId,
            question,
            questionType,
            points,
            displayOrder
        } = req.body;

        const createdBy = req.user.userId;

        if (!examId || !question || !questionType) {

            const error = new Error(
                "exam_id, question and question_type are required"
            );
            error.status = 400;
            error.code = "missing_question_fields";

            throw error;
        }

        const newQuestion = await createQuestion({
            examId,
            question,
            questionType,
            points,
            displayOrder,
            createdBy
        });
        return res.status(201).json({
            message: "Question created successfully",
            data: newQuestion
        });
    } catch (err) {
        next(err);
    }
}

export async function getAllQuestions(_req, res, next) {
    try {
        const questions = await findAllQuestions();

        return res.status(200).json({
            message: "Questions retrieved successfully",
            data: questions
        });
    } catch (err) {
        next(err);
    }
}

export async function getQuesByExam(req, res, next) {
    try {
        const { examId } = req.params;
        const questions = await findQuesByExamId(examId);
        return res.status(200).json({
            message: "Questions retrieved successfully",
            data: questions
        });
    } catch (err) {
        next(err);
    }
}

export async function getQuesById(req, res, next) {
    try {
        const { id } = req.params;
        const question = await findQuesById(id);

        if (!question) {
            const error = new Error(
                "Question not found"
            );
            error.status = 404;
            error.code = "question_not_found";

            throw error;
        }
        return res.status(200).json({
            message: "Question retrieved successfully",
            data: question
        });
    } catch (err) {
        next(err);
    }
}


export async function updateQuestion(req, res, next) {
    try {
        const { id } = req.params;

        const {
            question,
            questionType,
            points,
            displayOrder
        } = req.body;

        if (!question || !questionType) {

            const error = new Error(
                "question and question_type are required"
            );

            error.status = 400;
            error.code = "missing_question_fields";

            throw error;
        }
        const updatedQuestion = await updateQuesById(
            id,
            {
                question,
                questionType,
                points,
                displayOrder,
                updatedBy: req.user.userId
            }
        );
        if (!updatedQuestion) {
            const error = new Error(
                "Question not found"
            );
            error.status = 404;
            error.code = "question_not_found";

            throw error;
        }
        return res.status(200).json({
            message: "Question updated successfully",
            data: updatedQuestion
        });
    } catch (err) {
        next(err);
    }
}

export async function updateQuesStat(req, res,next) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {

            const error = new Error(
                "is_active must be a boolean"
            );
            error.status = 400;
            error.code = "invalid_status";

            throw error;
        }
        const updatedQuestion = await updateQuesStatus(
            id, isActive, req.user.userId
        );
        if (!updatedQuestion) {

            const error = new Error(
                "Question not found"
            );
            error.status = 404;
            error.code = "question_not_found";

            throw error;
        }
        return res.status(200).json({
            message: "Question status updated successfully",
            data: updatedQuestion
        });
    } catch (err) {
        next(err);
    }
}