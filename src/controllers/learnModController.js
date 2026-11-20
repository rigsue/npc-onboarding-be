import {
    createLearnMod,
    findAllLearnMods,
    findLearnModById,
    updateLearnModById,
    updateLearnModStat
} from "../models/learnModModel.js";

export async function createMod(req, res, next) {
    try {
        const {
            title,
            description,
            displayOrder,
            departmentId, 
            expectedDurationMinutes,
            timeLimitMinutes,
        } = req.body;
        const createdBy = req.user.userId;

        const module = await createLearnMod({
            title,
            description,
            displayOrder,
            departmentId, 
            expectedDurationMinutes,
            timeLimitMinutes,
            createdBy
        });

        res.status(201).json({
            message: "Learning module created successfully",
            data: module
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllMods(_req, res, next) {
    try {
        const modules = await findAllLearnMods();

        res.status(200).json({
            message: "Learning modules retrieved successfully",
            data: modules
        });
    } catch (error) {
        next(error);
    }
}

export async function getModsById(req, res, next) {
    try{
        const { learnModId } = req.params;

        const module = await findLearnModById(learnModId);

        if(!module) {
            return res.status(400).json({
                message: "Learning module not found"
            });
        }
        res.status(200).json({
            message: "Learnig module retrieved successfully",
            data: module
        });
    } catch (error) {
        next(error);
    }
}

export async function updateModule(req, res, next) {
    try {
        const { learnModId } = req.params;

        const {
                title,
                description,
                displayOrder,
                departmentId, 
                expectedDurationMinutes,
                timeLimitMinutes
            } = req.body;

        const updatedBy = req.user.userId;

        if (!Number.isSafeInteger(Number(learnModId)) 
            || Number(learnModId) < 1
        ) {
            return res.status(404).json({
                message: "Invalid learnin module ID"
            });
        }
        if (title !== undefined && (
            typeof title !== "string" || !title.trim() || title.length > 100
        )) {
            return res.status(400).json({
                message: "Invalid module title"
            });
        }

        if (displayOrder !== undefined && (
                !Number.isSafeInteger(Number(displayOrder)) 
                || Number(displayOrder) < 0
        ))  {
            return res.status(400).json({
                message: "Invalid display order"
            });
        }

        if (expectedDurationMinutes !== undefined && (
                !Number.isSafeInteger(Number(expectedDurationMinutes))
                || Number(expectedDurationMinutes) < 1
        )) {
            return res.status(400).json({
                message: "Expected duration must be a positive number"
            });
        }

        if (timeLimitMinutes !== undefined && timeLimitMinutes !== null && (
            !Number.isSafeInteger(Number(timeLimitMinutes)) 
            || Number(timeLimitMinutes) < 1
        )) {
            return res.status(400).json({
                message: "Invalid time limit"
            });
        }

        const module = await updateLearnModById(
            learnModId,
            {
                title: title?.trim(),
                description,
                displayOrder,
                departmentId, 
                expectedDurationMinutes,
                timeLimitMinutes,
                updatedBy,
            }
        );

        if (!module) {
            return res.status(404).json({
                message: "Learning module not found"
            });
        }

        return res.status(200).json({
            message: "Learning module updated successfully",
            data: module
        });

    } catch (error) {
        next(error);
    }
}

export async function updateModStat(req, res, next) {
    try {
        const { learnModId } = req.params;
        const { isActive } = req.body;

        const updatedBy = req.user.userId;

        if (!Number.isSafeInteger(Number(learnModId)) 
            || Number(learnModId) < 1
    ) {
        return res.status(400).json({
            message: "Invalid learning module Id"
        });
    }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "isActive must be true or false"
            });
        }

        const module = await updateLearnModStat(
            {learnModId, isActive, updatedBy}
        );
        if(!module) {
            return res.status(404).json({
                message: "Learning module not found 2"
            });
        }
        res.status(200).json({
            message: isActive
            ? "Learning module activated successfully"
            : "Learning module deactivated successfully",
            data: module
        });
        
    } catch (error) {
        next(error);
    }
}