import pool from "../config/db.js";

export async function createUserProgress(
    {userId, learnModId},
    connection = pool
) {
    const sql = `
        INSERT INTO user_progress (
            user_id,
            learn_mod_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;
    const { rows } = await connection.query(
        sql,
        [userId, learnModId]
    );
    return rows[0];
}

export async function findAllUserProgress(connection = pool) {
    const sql = `
        SELECT
            up.user_progress_id,
            up.user_id,
            u.first_name,
            u.last_name,
            u.email,
            up.learn_mod_id,
            lm.title AS module_title,
            up.progress_percentage,
            up.total_time_spent_seconds,
            up.status,
            up.started_at,
            up.completed_at,
            up.updated_at
        FROM user_progress up
        INNER JOIN users u
            ON up.user_id = u.user_id
        INNER JOIN learning_module lm
            ON up.learn_mod_id = lm.learn_mod_id
        ORDER BY
            u.last_name,
            u.first_name,
            lm.display_order;
    `;
    const { rows } = await connection.query(sql);

    return rows;
}

export async function findUserProgressById(
    {userProgressId},
    connection = pool
) {
    const sql = `
        SELECT
            user_progress_id,
            user_id,
            learn_mod_id,
            progress_percentage,
            total_time_spent_seconds,
            status,
            started_at,
            completed_at,
            updated_at
        FROM user_progress
        WHERE user_progress_id = $1;
    `;
    const { rows } = await connection.query(
        sql,
        [userProgressId]
    );
    return rows[0];
}

export async function findUserProgressByUser(
    {userId},
    connection = pool
) {
    const sql = `
        SELECT
            user_progress_id,
            user_id,
            learn_mod_id,
            progress_percentage,
            total_time_spent_seconds,
            status,
            started_at,
            completed_at,
            updated_at
        FROM user_progress
        WHERE user_id = $1
        ORDER BY learn_mod_id;
    `;
    const { rows } = await connection.query(
        sql,
        [userId]
    );
    return rows;
}

export async function updateUserProgress({
    userProgressId,
    progressPercentage,
    totalTimeSpentSeconds,
    status,
},
    connection = pool
) {
    const sql = `
        UPDATE user_progress
        SET
            progress_percentage = $1,
            total_time_spent_seconds = $2,
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
        updated_at = NOW()
        WHERE user_progress_id = $4
        RETURNING *;
    `;
    const values = [
        userProgressId,
        progressPercentage,
        totalTimeSpentSeconds,
        status
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}