import {
    createLearnMat,
    findAllLearnMat,
    findLearnMatById,
    findLearnMatByModId,
    updateLearnMatById,
    updateLearnMatStat
} from "../models/learnMatModel.js"

export async function createMats(req, res, next) {
    try {
        const {
            learnModId,
            title,
            description,
            displayOrder,
            minDurationMinutes,
            maxDurationMinutes,
            materialType,
            originalFileName,
            storageKey,
            mimeType,
            fileSize,
            contentUrl
        } = req.body;

        const createdBy = req.user.userId;

        const material = await createLearnMat({
            learnModId,
            title,
            description,
            displayOrder,
            minDurationMinutes,
            maxDurationMinutes,
            materialType,
            originalFileName,
            storageKey,
            mimeType,
            fileSize,
            contentUrl,
            createdBy
        });
        res.status(201).json({
            message: "Learning material created successully",
            data: material
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllMat(_req, res, next) {
    try{
        const materials = await findAllLearnMat();

        res.status(200).json({
            message: "Learning Materials retrieved successfully",
            data: materials
        });
    } catch (error) {
        next(error);
    }
}

export async function getMatByMod(req, res, next) {
    try {
        const { learnModId } = req.params;

        const material = await findLearnMatByModId(learnModId);

        res.status(200).json({
            message: "Learning materials retrieved successfully 1",
            data: material
        });
    } catch (error) {
        next(error);
    }
}

export async function getMatById(req, res, next) {
    try{
        const { learnMatId } = req.params;
        
        const material = await findLearnMatById(learnMatId);

        if(!material) {
            return res.status(404).json({
                message: "Learning not found 1"
            });
        }

        res.status(200).json({
            message: "Learning materials received successfully 2",
            data: material
        });
    } catch(error) {
        next(error);
    }
}

export async function updateMatById(req, res, next) {
    try {
        const { learnMatId } = req.params;
        const  {
                learnModId,
                title,
                description,
                displayOrder,
                minDurationMinutes,
                maxDurationMinutes,
                materialType,
                originalFileName,
                storageKey,
                mimeType,
                fileSize,
                contentUrl
        } = req.body;
        const updatedBy = req.user.userId;

        const material = await updateLearnMatById(
            learnMatId,
            {
                learnModId,
                title,
                description,
                displayOrder,
                minDurationMinutes,
                maxDurationMinutes,
                materialType,
                originalFileName,
                storageKey,
                mimeType,
                fileSize,
                contentUrl,
                updatedBy
            }
        );
        if(!material) {
            return res.status(404).json({
                message: "Learning material not found 2"
            });
        }

            res.status(200).json({
                message: "Learning materials updated successfully",
                data: material
            });
    } catch (error) {
        next(error);
    }
}

export async function updateMatStat(req, res, next) {
    try{
        const { learnMatId } = req.params;

        const { isActive } = req.body;

        const updatedBy = req.user.userId;

        const material = await updateLearnMatStat(
            learnMatId, isActive, updatedBy
        );
        if(!material) {
            return res.status(404).json({
                message: "Learning material not found 3"
            });
        }
        res.status(200).json({
            message: "Learning materials status updated successfully",
            data: material
        });
    } catch (error) {
        next(error);
    }
}