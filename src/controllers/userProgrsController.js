import {
    createUserProgress,
    findAllUserProgress,
    findUserProgressById,
    findUserProgressByUser,
    updateUserProgress
} from "../models/userProgrsModel.js";

export async function createUserProgrs(req, res, next) {
    try {
        const { userId, learnModId } = req.body;

        if (!userId || !learnModId) {
            const error = new Error(
                "User ID and learning module ID are required"
            );
            error.status = 400;
            error.code = "missing_progress_fields";
            throw error;
        }
        const progress = await createUserProgress({
            userId,
            learnModId
        });
        return res.status(201).json({
            message: "User progress created successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}

export async function getAllUserProgress(_req, res, next) {
    try {
        const progress = await findAllUserProgress();

        return res.status(200).json({
            message: "All user progress retrieved successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}

export async function getUserProgressById(req, res, next) {
    try {
        const { id } = req.params;

        const progress = await findUserProgressById(id);

        if (!progress) {
            const error = new Error("User progress not found");
            error.status = 404;
            error.code = "user_progress_not_found";
            throw error;
        }

        return res.status(200).json({
            message: "User progress retrieved successfully",
            data: progress
        });

    } catch (err) {
        next(err);
    }
}

export async function getUserProgressByUser(req, res, next) {
    try {
        const { userId } = req.params;

        const progress = await findUserProgressByUser(userId);

        return res.status(200).json({
            message: "User progress retrieved successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}

export async function updateUserProgrs( req, res, next) {
    try {
        const { id } = req.params;

        const {
            progressPercentage,
            totalTimeSpentSeconds,
            status
        } = req.body;
        if (
            progressPercentage === undefined ||
            totalTimeSpentSeconds === undefined ||
            !status
        ) {
            const error = new Error(
                "Progress percentage, total time, and status are required"
            );
            error.status = 400;
            error.code = "missing_progress_fields";
            throw error;
        }
        const progress = await updateUserProgress(
            id,
            progressPercentage,
            totalTimeSpentSeconds,
            status
        );
        if (!progress) {
            const error = new Error("User progress not found");
            error.status = 404;
            error.code = "user_progress_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "User progress updated successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}