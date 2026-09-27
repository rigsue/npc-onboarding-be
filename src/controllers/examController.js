import {
    createExamination,
    findAllExams,
    findExambyModId,
    findExamById,
    updateExamById,
    updateExamStat
} from "../models/examModel.js";

export async function createExam(req, res, next) {
    try{
        const {
            learnModId,
            title,
            passingScore,
            attemptLimit,
            durationMinutes     
        } = req.body;
        const createdBy = req.user.userId;

        const exam = await createExamination({
            learnModId,
            title,
            passingScore,
            attemptLimit,
            durationMinutes,
            createdBy,
        });
        res.status(201).json({
            message: "Exam created sucessfully",
            data: exam
        });
    } catch (error) {
        next(error);
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
            res.status(404).json({
                message: "Exam not found 1"
            });
        }
        res.status(200).json({
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

        const exam = updateExamById(
            examId, 
            {
                learnModId,
                title,
                passingScore,
                attemptLimit,
                durationMinutes,
            },
            updatedBy
        );
        if(!exam) {
            res.status(404).json({
                message: "Exam not found 2"
            });
        } 
        res.status(200).json({
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
            examId, isActive, updatedBy
        );
        if(!exam) {
            res.status(404).json({
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
