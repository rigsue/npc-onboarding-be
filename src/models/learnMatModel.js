import pool from "../config/db.js";

export async function createLearnMat({
    learnModId,
    title,
    description,
    displayOrder = 0,
    minDurationMinutes = 5,
    maxDurationMinutes = null,
    materialType,
    originalFileName = null,
    storageKey = null,
    mimeType =null,
    fileSize = null,
    contentUrl = null,
    createdBy,
    },
    connection = pool 

    ) {
    const sql = `
        INSERT INTO learning_materials(
            learn_mod_id,
            title,
            description,
            min_duration_minute,
            max_duration_minute,
            material_type,
            original_file_name,
            storage_key,
            mime_type,
            file_size,
            content_url,
            display_order,
            created_by
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13
        )
        RETURNING *;
    `;
    const values = [
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
    ];
    const { rows } = await connection.query(sql, values);
    return rows[0];
}

export async function findAllLearnMat(connection = pool) {
    const sql = `
        SELECT 
            lm.learn_mat_id,
            lm.learn_mod_id,
            mod.title AS module_title,
            lm.title, 
            lm.description,
            lm.min_duration_minutes,
            lm.max_duration_minutes,
            lm.material_type,
            lm.original_file_name,
            lm.storage_key,
            lm.mime_type,
            lm.file_size,
            lm.content_url,
            lm.display_order,
            lm.is_active,
            lm.created_by,
            lm.created_at,
            lm.updated_by,
            lm.updated_at
        FROM learning_materials lm
        INNER JOIN learning_module mod
            ON lm.learn_mod_id = mod.learn_mod_id
        ORDER BY
            lm.learn_mod_id,
            lm.display_order,
            lm.learn_mat_id;
    `;
    const { rows } = await connection.query(sql);
    return rows;
}

export async function findLearnMatByModId(
    {learnModId}, connection = pool) {
    const sql = `
        SELECT
            learn_mat_id,
            learn_mod_id,
            title,
            description,
            min_duration_minutes,
            max_duration_minutes,
            material_type,
            original_file_name,
            storage_key,
            mime_type,
            file_size,
            content_url,
            display_order,
            is_active,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM learning materials
        WHERE learn_mod_id = $1
        ORDER BY display_order, learn_mat_id;
    `;
    const { rows } = await connection.query(sql, [learnModId]);
    return rows;
}

export async function findLearnMatById(
    {learnMatId}, connection = pool) {
    const sql = `
        SELECT
            lm.learn_mat_id,
            lm.learn_mod_id,
            mod.title AS module_title,
            lm.title, 
            lm.description,
            lm.min_duration_minutes,
            lm.max_duration_minutes,
            lm.material_type,
            lm.original_file_name,
            lm.storage_key,
            lm.mime_type,
            lm.file_size,
            lm.content_url,
            lm.display_order,
            lm.is_active,
            lm.created_by,
            lm.created_at,
            lm.updated_by,
            lm.updated_at
        FROM learning_materials lm
        INNER JOIN learning_module mod
            ON lm.learn_mod_id = mod.learn_mod_id
        WHERE lm.learn_mat_id = $1;
    `;
    const { rows } = await connection.query(sql, [learnMatId]);
    return rows[0];
}

export async function updateLearnMatById(
    learnMatId, {
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
    }, connection = pool
) {
    const sql = `
        UPDATE learning_materials
        SET
            learn_mod_id = $1,
            title = $2,
            description = $3,
            min_duration_minutes = $4,
            max_duration_minutes = $5,
            material_type = $6,
            original_file_name = $7,
            storage_key = $8,
            mime_type = $9,
            file_size = $10,
            content_url = $11,
            display_order = $12,
            updated_by = $13
            updated_at = NOW()
        WHERE learn_mat_id = $14
        RETURNING *;
    `;
    const values = [
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
        updatedBy,
        learnMatId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function updateLearnMatStat(
    {learnMatId, isActive, updatedBy}, connection = pool
) {
    const sql = `
        UPDATE learning_materials
        SET
            is_active = $1,
            updated_by = $2,
            updated_at = NOW()
        WHERE learn_mat_id = $3
        RETURNING *;
    `;

    const { rows } = await connection.query(sql, [
        isActive, updatedBy, learnMatId
    ]);
    return rows[0];
}