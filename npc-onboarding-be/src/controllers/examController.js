import pool from "../config/db.js";

import {
    createExamination,
    findAllExams,
    findExambyModId,
    findExamById,
    updateExamById,
    updateExamStat
} from "../models/examModel.js";

import { createQuestion } from "../models/questionModel.js";

import { createChoice } from "../models/choiceModel.js";

//  -   -   Create Exam / Assessment    -   -
export async function createExam(req, res, next) {

    let connection;

    let transactionActive = false;
    try{
        const {
            learnModId,
            title,
            passingScore,
            attemptLimit = null,
            durationMinutes = 30,     
            questions
        } = req.body;
        const createdBy = req.user.userId;

        // a. validate assessment detail
        if (
            !Number.isSafeInteger(Number(learnModId)) ||
            Number(learnModId) <= 0 ||
            typeof title !== "string" ||
            !title.trim() ||
            !Number.isFinite(Number(passingScore)) ||
            Number(passingScore) < 0 ||
            Number(passingScore) > 100 ||
            !Number.isSafeInteger(Number(durationMinutes)) ||
            Number(durationMinutes) <= 0 ||
            (
                attemptLimit !== null &&
                (
                    !Number.isSafeInteger(Number(attemptLimit)) ||
                    Number(attemptLimit) <= 0
                )
            )
        ) {
            return res.status(400).json({
                message: "Invalid assessment details"
            });
        }

        // b. Validate question
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                message: "At least 1 question is required"
            });
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            const {
                question: questionText,
                questionType,
                points,
                displayOrder,
                choices
            } = question;

        if (
            typeof questionText !== "string" ||
            !questionText.trim() ||
            !["Multiple Choice", "True or False"].includes(questionType) ||
            !Number.isFinite(Number(points)) ||
            Number(points) <= 0 ||
            (
                displayOrder !== undefined &&
                (
                    !Number.isSafeInteger(Number(displayOrder)) ||
                    Number(displayOrder) <= 0
                )
            ) ||
            !Array.isArray(choices) ||
            choices.length < 2 
        ) {
            return res.status(400).json({
                message: `Invalid question at position ${i + 1}`
            });
        }

        //  Exactly one correct, will add several correct answers later
        const correctChoices = choices.filter(
            choice => choice.isCorrect === true
        );

        if (correctChoices.length !== 1) {
            return res.status(400).json({
                message: "Each question can only have one correct ans"
            });
        }

        // Validate individual choices
        for (let j = 0; j < choices.length; j++) {
            const choice = choices[j];
            if(
                typeof choice.choiceText !== "string" ||
                !choice.choiceText.trim() ||
                typeof choice.isCorrect !== "boolean" ||
                (
                    choice.displayOrder !== undefined &&
                    (
                        !Number.isSafeInteger(Number(choice.displayOrder)) ||
                        Number(choice.displayOrder) <= 0
                    )
                )
            ) {
                return res.status(400).json({
                    message: `Invalid choice ${j +1} in question ${i +1}`
                });
            }
        }

        // TRue or False must have 2 exact choices only, no more, no less hehe
        if (questionType === "True or False") {
            const choiceTexts = choices.map(choice => 
                choice.choiceText.trim().toLowerCase()
            );
            if (
                choices.length !== 2 ||
                !choiceTexts.includes("true") ||
                !choiceTexts.includes("false")
            ) {
                return res.status(400).json({
                    message:  `Questions ${i + 1} must have True and False choices`
                });
            }
        }
    }
        // database connect
    connection = await pool.connect();

    // c. Start Transaction
    await connection.query("BEGIN");
    transactionActive = true;

    // d. create exam
        const exam = await createExamination({
            learnModId: Number(learnModId),
            title: title.trim(),
            passingScore: Number(passingScore),
            attemptLimit,
            durationMinutes: Number(durationMinutes),
            createdBy,
        }, connection);
        if (!exam?.exam_id) {
            throw new Error("Failed to create Assessment");
        }

        // e. create questions and choices
        const createdQuestions = [];
         for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];

            const question = await createQuestion({
                examId: exam.exam_id,
                question: questionData.question.trim(),
                questionType: questionData.questionType,
                points: Number(questionData.points),
                displayOrder: questionData.displayOrder ?? i + 1,
                createdBy
            }, connection);

            if (!question?.question_id) {
                throw new Error("Failed to create assessment question");
            }
            const createdChoices = [];

            for (let j = 0; j < questionData.choices.length; j++) {
                const choiceData = questionData.choices[j];

                const choice = await createChoice(
                    question.question_id,
                    choiceData.choiceText.trim(),
                    choiceData.isCorrect,
                    Number(choiceData.displayOrder ?? j + 1),
                    createdBy,
                    connection
                );
                if (!choice?.choice_id) {
                    throw new Error("Failed to create question choice");
                }
                createdChoices.push(choice);
            }
            createdQuestions.push({
                ...question,
                choices: createdChoices
            });
         }

        //   f. commit after successful above transactions
        await connection.query("COMMIT");
        transactionActive = false;

        return res.status(201).json({
            message: "Exam/Assessment created sucessfully",
            data: {
                ...exam,
                questions: createdQuestions
            }
        });
    } catch (error) {
        // roll back transaction if failed
        if (transactionActive && connection) {
            try {
                await connection.query("ROLLBACK");
                transactionActive = false;
            } catch (rollbackError) {
                console.error(
                    "transaction rollback failed for create assessment:",
                    rollbackError
                )
            }
        }
        return next(error);
    } finally {
        connection?.release();
    }
}

export async function getAllExams(_req, res, next) {
    try{
        const exams = await findAllExams();

        res.status(200).json({
            message: "Exams retrieved successfully",
            data: exams
        });
    } catch (error) {
        next(error);
    }
}

export async function getExamByMod(req, res, next) {
    try {
        const { learnModId } = req.params;

        const exam = await findExambyModId(learnModId);

        res.status(200).json({
            message: "Exam retrieved successfully 1",
            data: exam
        });
    } catch (error) {
        next(error);
    }
}

export async function getExamById(req, res, next) {
    try{
        const { examId } = req.params;

        const exam = await findExamById(examId);

        if(!exam) {
          return res.status(404).json({
                message: "Exam not found 1"
            });
        }
            return res.status(200).json({
            message: "Exam retrieved successfully 2",
            data: exam
        });
    } catch (error) {
        next(error);
    }
}

export async function updateExam(req, res, next) {
    try{
        const { examId } = req.params;

        const {
            learnModId,
            title,
            passingScore,
            attemptLimit,
            durationMinutes,
        } = req.body;
                
        const updatedBy = req.user.userId;

        const exam = await updateExamById(
            examId, 
            {learnModId,
            title,
            passingScore,
            attemptLimit,
            durationMinutes,
            updatedBy}
        );
        if(!exam) {
            return res.status(404).json({
                message: "Exam not found 2"
            });
        } 
            return res.status(200).json({
            message: "Exam updated successfully",
            data: exam
        });
    } catch (error) {
        next(error);
    }
}

export async function updatedExamStat(req, res, next) {
    try{
        const { examId } = req.params;
        const { isActive } = req.body;
        const updatedBy = req.user.userId;

        const exam = await updateExamStat(
            {examId, isActive, updatedBy}
        );
        if(!exam) {
        return res.status(404).json({
                message: "Exam not found 3"
            });
        }
        res.status(200).json({
            message: "Exam status updated successfully",
            data: exam
        });
    } catch (error) {
        next(error);
    }
}
