import pool from "../config/db.js";
import { unlink } from "node:fs/promises";
import path from "node:path";

import {
    createLearnMat,
    findAllLearnMat,
    findLearnMatById,
    findLearnMatByModId,
    getNextDisplayOrder,
    updateLearnMatById,
    updateLearnMatStat,
} from "../models/learnMatModel.js"

export async function createMats(req, res, next) {

    const files = req.files || [];

    let connection;
    let transactionStart = false;
    let transactionCommit = false;

    try {
        const {
            learnModId,
            title,
            description,
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

        if (!Number.isSafeInteger(Number(learnModId)) || 
            Number(learnModId) < 1 || 
            !title?.trim() 
            || !materialType?.trim()
        ) {
            return res.status(400).json({
                message: "Display order must be a positive integer"
            });
        }

        const minDuration = Number(minDurationMinutes ?? 5);

        const maxDuration = maxDurationMinutes === undefined ||
            maxDurationMinutes === "" ? null : Number(maxDurationMinutes);

        if (
            !Number.isSafeInteger(minDuration) || 
            minDuration < 1 || (maxDuration !== null && (
                !Number.isSafeInteger(maxDuration) ||
                maxDuration < minDuration
            ))
        ) {
            return res.status(404).json({
                message: "Invalid Material Duration"
            });
        }

        // Display Order
        const rawDisplayOrder = req.body.displayOrder;

        const isAutoOrder = rawDisplayOrder === undefined ||
            rawDisplayOrder === "";

        const requestedOrder = isAutoOrder ? null : Number(rawDisplayOrder);

        if (!isAutoOrder && (
            !Number.isSafeInteger(requestedOrder) || requestedOrder < 1
            )
        ) {
            return res.status(400).json({
                message: "Display order must be a positive integer"
            });
        }

        //  =   = connect to postgre    =   =

        connection = await pool.connect();

        await connection.query("BEGIN");
        transactionStart = true;

        // Lock selected learning module which serializes material creation for module

        const moduleResult = await connection.query(
            `SELECT learn_mod_id
            FROM learning_module
            WHERE learn_mod_id = $1
            FOR UPDATE
            `, [learnModId]
        );

        if (moduleResult.rowCount === 0) {
            const error = new Error("Leaning module not found");
            error.status = 404;
            throw error;
        }

        // calculate next avail display order

        const displayOrder = isAutoOrder
            ? await getNextDisplayOrder(connection, learnModId) : requestedOrder;
        
        const materials = [];
        
        for (const [index, file] of files.entries()) {
            const originalFileName = file.originalname;
            const storageKey = file.filename;
            const mimeType = file.mimetype;
            const fileSize = file.size;

            const contentUrl = `/uploads/materialsd/${file.filename}`;

            const fileTitle = path.parse(originalFileName).name;

            const material = await createLearnMat(
                {
                    learnModId,
                    title: files.length === 1 ? title.trim() 
                        : `${title.trim()} - ${fileTitle}`.slice(0, 100),
                    description: description || null,
                    displayOrder: displayOrder + index,
                    minDurationMinutes: minDuration,
                    maxDurationMinutes: maxDuration,
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
                await connection.query("ROLLBACK");
            } catch (rollbackError) {
                console.error("Rollback CraeteMaterial failed", rollbackError);
            }
        }
        if(!transactionCommit) {
            await Promise.all(
                files.map(async (file) => {
                    try {
                        await unlink(file.path);
                    } catch (cleanupError) {
                        if(cleanupError.code !== "ENOENT") {
                            console.error("Upload cleanup failed:", cleanupError);
                        }
                    }
                })
            );
        }
         
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Display order already used in selected module"
            });
        }

        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        return next(error);

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
    const files = req.files || [];
    const newFile = files[0];

    try {
        const { learnMatId } = req.params;

        const existing = await findLearnMatById(learnMatId);

        if (!existing) {
            if (newFile) await unlink(newFile.path).catch(() => {});
            return res.status(404).json({
                message: "Learning material not found"
            });
        }

        const {
            learnModId,
            title,
            description,
            displayOrder,
            minDurationMinutes,
            maxDurationMinutes,
            materialType
        } = req.body;

        const updatedBy = req.user.userId;

        const material = await updateLearnMatById(
            learnMatId,
            {
                learnModId: Number(learnModId),
                title,
                description,
                displayOrder: Number(displayOrder),
                minDurationMinutes: Number(minDurationMinutes),
                maxDurationMinutes:
                    maxDurationMinutes === "" ||
                    maxDurationMinutes === undefined
                        ? null
                        : Number(maxDurationMinutes),
                materialType,

                originalFileName: newFile
                    ? newFile.originalname
                    : existing.original_file_name,

                storageKey: newFile
                    ? newFile.filename
                    : existing.storage_key,

                mimeType: newFile
                    ? newFile.mimetype
                    : existing.mime_type,

                fileSize: newFile
                    ? newFile.size
                    : existing.file_size,

                contentUrl: newFile
                    ? `/uploads/materialsd/${newFile.filename}`
                    : existing.content_url,

                updatedBy
            }
        );

        // Remove the old physical file only after the DB update succeeds.
        if (newFile && existing.storage_key) {
            const oldPath = path.resolve(
                process.cwd(),
                "uploads",
                "materialsd",
                existing.storage_key
            );

            await unlink(oldPath).catch((error) => {
                if (error.code !== "ENOENT") {
                    console.error("Old material file cleanup failed:", error);
                }
            });
        }

        return res.status(200).json({
            message: "Learning material updated successfully",
            data: material
        });
    } catch (error) {
        if (newFile) {
            await unlink(newFile.path).catch((cleanupError) => {
                if (cleanupError.code !== "ENOENT") {
                    console.error("New material file cleanup failed:", cleanupError);
                }
            });
        }

        return next(error);
    }
}


export async function updateMatStat(req, res, next) {
    try{
        const { learnMatId } = req.params;
        const { isActive } = req.body;
        const updatedBy = req.user.userId;

        const material = await updateLearnMatStat(
             {learnMatId, isActive, updatedBy}
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

/* const rawDisplayOrder = req.body.displayOrder;

const displayOrder = rawDisplayOrder === undefined || rawDisplayOrder === ""
    ? await getNextDisplayOrder(connection, learnModId) : Number(rawDisplayOrder);

    if (!Number.isSafeInteger(displayOrder) || displayOrder < 1) {
        return res.status(400).json({
            message: "Display order must be a positive integer"
        })
    } */