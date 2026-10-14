import pool from "../config/db.js";
import { unlink } from "node:fs/promises";
import path from "node:path";

import {
    createLearnMat,
    findAllLearnMat,
    findLearnMatById,
    findLearnMatByModId,
    updateLearnMatById,
    updateLearnMatStat
} from "../models/learnMatModel.js"

export async function createMats(req, res, next) {
    const connection = await pool.connect();

    const files = req.files || [];
        
    let transactionStart = false;
    let transactionCommit = false;

    try {
        const {
            learnModId,
            title,
            description,
            displayOrder,
            minDurationMinutes,
            maxDurationMinutes,
            materialType
        } = req.body;

        const createdBy = req.user.userId;

        if (files.length === 0) {
            return res.status(400).json({
                message: "Upload atleast 1 file"
            });
        }

        await connection.query("BEGIN");
        transactionStart = true;
        
        const materials = [];
        
        for (const [index, file] of files.entries()) {
            const originalFileName = file.originalname;
            const storageKey = file.filename;
            const mimeType = file.mimetype;
            const fileSize = file.size;

            const contentUrl = `/uploads/materiald/${file.filename}`;

            const fileTitle = path.parse(originalFileName).name;

            const material = await createLearnMat(
                {
                    learnModId,
                    title: files.length === 1 ? title : `${title} - ${fileTitle}`,
                    description,
                    displayOrder: Number(displayOrder ?? 0) + index,
                    minDurationMinutes,
                    maxDurationMinutes,
                    materialType,
                    originalFileName,
                    storageKey,
                    mimeType,
                    fileSize,
                    contentUrl,
                    createdBy
                },
                connection
            );
            materials.push(material);
        }
        await connection.query("COMMIT");
        transactionCommit = true;

        return res.status(201).json({
            message: "Learnin materials created successfully",
            count: materials.length,
            data: materials
        });
    } catch (error) {
        if(transactionStart && !transactionCommit) {
            try{
                await tconnection.query("ROLLBACK");
            } catch (rollbackError) {
                console.error("Rollback for CraeteMaterial transaction failed", rollbackError);
            }
        }
        if(!transactionCommit) {
            await Promise.all(
                files.map(async (file) => {
                    try {
                        await unlink(file.path);
                    } catch (cleanupError) {
                        if(cleanupError.comde !== "ENDENT") {
                            console.error("Upload file cleanup failed:", cleanupError);
                        }
                    }
                })
            )
        } return next(error);
    } finally {
        connection?.release();

        
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