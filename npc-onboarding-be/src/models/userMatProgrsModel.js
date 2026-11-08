import pool from "../config/db.js";

export async function createUserMatProg({
    userId,
    learnMatId,
},
    connection = pool
) {
    const sql = `
        INSERT INTO user_material_progress (
            user_id,
            learn_mat_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;
    const { rows } = await connection.query(
        sql, [userId, learnMatId]
    );
    return rows[0];
}

export async function findUserMatProgById(
    {userMaterialProgressId},
    connection = pool
) {
    const sql = `
        SELECT
            user_material_progress_id,
            user_id,
            learn_mat_id,
            progress_percentage,
            time_spent_minutes,
            status,
            started_at,
            completed_at,
            last_accessed_at,
            created_at,
            updated_at
        FROM user_material_progress
        WHERE user_material_progress_id = $1;
    `;
    const { rows } = await connection.query(
        sql,
        [userMaterialProgressId]
    );
    return rows[0];
}

export async function findUserMatProgByUser(
    {userId}, connection = pool
) {
    const sql = `
        SELECT
            user_material_progress_id,
            user_id,
            learn_mat_id,
            progress_percentage,
            time_spent_minutes,
            status,
            started_at,
            completed_at,
            last_accessed_at,
            created_at,
            updated_at
        FROM user_material_progress
        WHERE user_id = $1
        ORDER BY learn_mat_id;
    `;
    const { rows } = await connection.query(
        sql,
        [userId]
    );
    return rows;
}

export async function findUserMatProg(
    {userId, learnMatId}, connection = pool
) {
    const sql = `
        SELECT
            user_material_progress_id,
            user_id,
            learn_mat_id,
            progress_percentage,
            time_spent_minutes,
            status,
            started_at,
            completed_at,
            last_accessed_at,
            created_at,
            updated_at
        FROM user_material_progress
        WHERE user_id = $1
          AND learn_mat_id = $2;
    `;
    const { rows } = await connection.query(
        sql, [userId, learnMatId]
    );
    return rows[0];
}

export async function updateUserMatProg(
    {userMaterialProgressId,
    progressPercentage,
    timeSpentMinutes,
    status},
    connection = pool
) {
    const sql = `
        UPDATE user_material_progress
        SET
            progress_percentage = $1,
            time_spent_minutes = $2,
            status = $3,
            started_at = CASE
                WHEN started_at IS NULL
                     AND $3 <> 'pending'
                THEN NOW()
                ELSE started_at
            END,
            completed_at = CASE
                WHEN $3 = 'completed'
                THEN NOW()
                ELSE completed_at
            END,
            last_accessed_at = NOW(),
            updated_at = NOW()
        WHERE user_material_progress_id = $4
        RETURNING *;
    `;
    const values = [
        progressPercentage,
        timeSpentMinutes,
        status,
        userMaterialProgressId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}