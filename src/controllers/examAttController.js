import {
    createExamAtt,
    findAllExamAtt,
    findExamAttById,
    findExamAttByUserProgress,
    updateExamAttRes,
    updateExamAttStat
} from "../models/examAttModel.js";

export async function makeExamAtt(req, res, next) {
    try {
        const {
            examId,
            userProgressId,
            attemptNumber,
            totalPoints,
            deadlineAt
        } = req.body;

        if (
            !examId ||
            !userProgressId ||
            !attemptNumber ||
            !totalPoints ||
            !deadlineAt
        ) {
            const error = new Error(
                "Exam ID, user progress ID, attempt number, total points, and deadline are required"
            );
            error.status = 400;
            error.code = "missing_attempt_fields";
            throw error;
        }

        const attempt = await createExamAtt(
            examId,
            userProgressId,
            attemptNumber,
            totalPoints,
            deadlineAt
        );

        return res.status(201).json({
            message: "Exam attempt created successfully",
            data: attempt
        });

    } catch (err) {
        next(err);
    }
}

export async function getAllExamAtt(_req, res, next) {
    try {
        const examAtt = await findAllExamAtt();

        res.status(200).json({
            message: "Exam Attempts received successfully",
            data: examAtt
        });
    } catch (error) {
        next(error);
    }
}

export async function getExamAttById(req, res, next) {
    try {
        const { id } = req.params;

        const attempt = await findExamAttById(id);

        if (!attempt) {
            const error = new Error("Exam attempt not found");
            error.status = 404;
            error.code = "exam attempt not found";
            throw error;
        }

        return res.status(200).json({
            message: "Exam attempt retrieved successfully",
            data: attempt
        });

    } catch (err) {
        next(err);
    }
}

export async function getExamAttByUserProgress(req, res, next) {
    try {
        const { userProgressId } = req.params;

        const attempts = await findExamAttByUserProgress(
            userProgressId
        );

        return res.status(200).json({
            message: "Exam attempts retrieved successfully",
            data: attempts
        });

    } catch (err) {
        next(err);
    }
}

export async function updateExamAttResult(req, res, next) {
    try {
        const { id } = req.params;

        const {
            score,
            percentage,
            isPassed,
            status
        } = req.body;

        if (
            score === undefined ||
            percentage === undefined ||
            typeof isPassed !== "boolean" ||
            !status
        ) {
            const error = new Error(
                "Score, percentage, and status are required"
            );
            error.status = 400;
            error.code = "missing_attempt_result_fields";
            throw error;
        }

        const attempt = await updateExamAttRes(
            id,
            score,
            percentage,
            isPassed,
            status
        );

        if (!attempt) {
            const error = new Error("Exam attempt not found");
            error.status = 404;
            error.code = "exam_attempt_not_found";
            throw error;
        }

        return res.status(200).json({
            message: "Exam attempt result updated successfully",
            data: attempt
        });

    } catch (err) {
        next(err);
    }
}

export async function updateExamAttStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            const error = new Error("Status is required");
            error.status = 400;
            error.code = "missing_status";
            throw error;
        }

        const attempt = await updateExamAttStat(
            id,
            status
        );

        if (!attempt) {
            const error = new Error("Exam attempt not found");
            error.status = 404;
            error.code = "exam attempt not found";
            throw error;
        }

        return res.status(200).json({
            message: "Exam attempt status updated successfully",
            data: attempt
        });

    } catch (err) {
        next(err);
    }
}