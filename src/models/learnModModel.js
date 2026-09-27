import pool from "../config/db.js";

export async function createLearnMod({
    title,
    description,
    displayOrder = 0,
    departmentId, 
    expectedDurationMinutes = 30,
    timeLimitMinutes = null,
    createdBy,
    connection = pool
}) {
    const sql = `
        INSERT INTO learning_module (
            title,
            description,
            display_order,
            department_id,
            expected_duration_minutes,
            time_limit_minutes,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `;

    const values = [
        title,
        description,
        displayOrder,
        departmentId, 
        expectedDurationMinutes,
        timeLimitMinutes,
        createdBy
    ];

    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findAllLearnMods(connection = pool) {
    const sql = `
        SELECT
            lm.learn_mod_id,
            lm.title,
            lm.description,
            lm.display_order,
            lm.department_id,
            d.department_name,
            lm.expected_duration_minutes,
            lm.time_limit_minutes,
            lm.is_active,
            lm.created_by,
            lm.created_at,
            lm.updated_by,
            lm.updated_at
        FROM learning_module lm
        INNER JOIN departments d
            ON lm.department_id = d.department_id
        ORDER BY lm.display_order, lm.learn_mod_id;
    `;
    const { rows } = await connection.query(sql);
    return rows;
}

export async function findLearnModById({learnModId}, connection = pool) {
    const sql = `
    SELECT
            lm.learn_mod_id,
            lm.title,
            lm.description,
            lm.display_order,
            lm.department_id,
            d.department_name,
            lm.expected_duration_minutes,
            lm.time_limit_minutes,
            lm.is_active,
            lm.created_by,
            lm.created_at,
            lm.updated_by,
            lm.updated_at
        FROM learning_module lm
        INNER JOIM departments d
            ON lm.department_id = d.deparment_id
        WHERE lm.learn_mod_id = $1;
    `;
    const { rows } = await connection.query(sql, [learnModId]);
    return rows[0];
}

export async function updateLearnModById(
    learnModId,
    {
        title,
        description,
        displayOrder,
        departmentId, 
        expectedDurationMinutes,
        timeLimitMinutes,
        updatedBy
    }, connection = pool
 ) {
    const sql = `
    UPDATE learning_modules
    SET
        title = $1,
        description = $2,
        display_order = $3,
        department_id = $4,
        expected_duration_minutes = $5,
        time_limit_minutes = $6,
        updated_by = $7,
        updated_at = NOW()
    WHERE learn_mod_id = $8
    RETURNING *;
    `;
    const values = [
        title,
        description,
        displayOrder,
        departmentId, 
        expectedDurationMinutes,
        timeLimitMinutes,
        updatedBy,
        learnModId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function updateLearnModStat(
    {learnModId, isActive, updatedBy}, connection = pool
 ) {
    const sql = `
        UPDATE learning_module
        SET
            is_active = $1,
            updated_by = $2,
            updated_at = NOW()
        WHERE learn_mod_id = $3
        RETURNING *;
    `;
    const { rows } = await connection.query(sql, [
        isActive, updatedBy, learnModId
    ]);
    return rows[0];
}