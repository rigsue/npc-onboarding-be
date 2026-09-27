import {
    createUserMatProg,
    findUserMatProgById,
    findUserMatProgByUser,
    findUserMatProg,
    updateUserMatProg,
} from "../models/userMatProgrsModel.js";

export async function createUserMatProgrs(req, res, next) {
    try {
        const { userId, learnMatId } = req.body;

        if (!userId || !learnMatId) {
            const error = new Error(
                "User ID and learning material ID are required"
            );
            error.status = 400;
            error.code = "missing_material_progress_fields";
            throw error;
        }
        const progress = await createUserMatProg(
            userId,
            learnMatId
        );
        return res.status(201).json({
            message: "Material progress created successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}

export async function getUserMatProgById(req, res, next) {
    try {
        const { id } = req.params;

        const progress = await findUserMatProgById(id);

        if (!progress) {
            const error = new Error(
                "Material progress not found"
            );
            error.status = 404;
            error.code = "material_progress_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Material progress retrieved successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}

export async function getUserMatProgByUser(req, res, next) {
    try {
        const { userId } = req.params;

        const progress = await findUserMatProgByUser(userId);

        return res.status(200).json({
            message: "Material progress retrieved successfully",
            data: progress
        });

    } catch (err) {
        next(err);
    }
}

export async function getUserMatProg(req, res, next) {
    try {
        const { userId, learnMatId } = req.params;

        const progress = await findUserMatProg(
            userId,
            learnMatId
        );
        if (!progress) {
            const error = new Error(
                "Material progress not found"
            );
            error.status = 404;
            error.code = "material_progress_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Material progress retrieved successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}

export async function updateUserMatProgrs(req, res, next) {
    try {
        const { id } = req.params;

        const {
            progressPercentage,
            timeSpentMinutes,
            status
        } = req.body;
        if (
            progressPercentage === undefined ||
            timeSpentMinutes === undefined ||
            !status
        ) {
            const error = new Error(
                "Progress percentage, time spent, and status are required"
            );
            error.status = 400;
            error.code = "missing_material_progress_fields";
            throw error;
        }
        const progress = await updateUserMatProg(
            id,
            progressPercentage,
            timeSpentMinutes,
            status
        );
        if (!progress) {
            const error = new Error(
                "Material progress not found"
            );
            error.status = 404;
            error.code = "material_progress_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Material progress updated successfully",
            data: progress
        });
    } catch (err) {
        next(err);
    }
}