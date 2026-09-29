import {
    createExamAtt,
    findAllExamAtt,
    findExamAttById,
    findExamAttByUserProgress,
    updateExamAttRes,
    updateExamAttStat
} from "../models/examAttModel.js";

import { findExamById } from "../models/examModel.js";
import { findQuesByExamId } from "../models/questionModel.js";
import { findUserProgressByUser } from "../models/userProgrsModel.js";

export async function makeExamAtt(req, res, next) {
    try {
        const { examId } = req.body;
//  -   -   check exam id   -   -
        if (!examId ) {
            const error = new Error("Exam id required");
            error.status = 400;
            error.code = "missing exam id";
            throw error;
            }
//  -   -   chec user   -   -
        const userId = req.user.userId;
        if(!userId) {
            const error = new Error("Authenticated user required");
            error.status = 400;
            error.code = "user not authenticated";
            throw error;
        }
//  -   -   check exam  -   -
        const exam = await findExamById(examId);
        if(!exam) {
            const error = new Error("Exam not found");
            error.status = 400;
            error.code = "missing exam?";
            throw error;
        }

        if(!exam.is_active) {
            const error = new Error("Exam deactivate");
            error.status = 400;
            error.code = "need to activate exam 1st";
            throw error;
        }
//  -   -   check user progress module  -   -
        const userProgessList  = await findUserProgressByUser({
            userId
        });
        const userProgess = userProgessList.find(
            progress =>
                progress.learn_mod_id === exam.learn_mod_id
        );

        if(!userProgess) {
            const error = new Error(
                "User progress for this module not found"
            );
            error.sta = 404;
            error.code = "user_progress not found";
            throw error;
        }
//      -   -   check prev attempts     -   -
        const previousAttempt = await findExamAttByUserProgress({
            userProgressId: userProgess.user_progress_id
        });
        const examAttempts = previousAttempt.filter(
            attempt =>
                attempt.exam_id === Number(examId)
        );

//  -   -   check attempt limit -   -
        if(
            exam.attempt_limit !== null &&
            examAttempts.length >= exam.attempt_limit
        ) {
            const error = new Error(
                "Exam attempt limit has been reached"
            );

            error.status = 404;
            error.code = "attempt_limit reached"
        }

//  -   -   check attempt number    -   -
        const attemptNumber = examAttempts.length + 1;

//      -   -    check total points
        const questions = await findQuesByExamId(examId);

        const activeQuestions = questions.filter(
            question => question.is_active
        );

        const totalPoints = activeQuestions.reduce(
            (total, question) =>
                total + Number(question.points),
            0
        );

        if (totalPoints <= 0) {
            const error = new Error(
                "Exam has no question"
            );
            error.status = 400;
            error.code = "exam_no_question";
        }

//  -   -   Check deadline  -   -   
        const startedAt = new Date();

        const deadlineAt = new Date(
            startedAt.getTime() +
            Number(exam.duration_minutes) * 60 * 1000
        );

//  -   make exam attempt
        const attempt = await createExamAtt({
            examId: Number(examId),
            userProgressId: userProgess.user_progress_id,
            attemptNumber,
            totalPoints,
            deadlineAt
        });
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
            { userProgressId }
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

        const attempt = await updateExamAttRes({
            examAttemptId: id,
            score,
            percentage,
            isPassed,
            status
        });

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

        const attempt = await updateExamAttStat({
            examAttemptId: id,
            status
        });

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