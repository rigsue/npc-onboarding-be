import pool from "../config/db.js";

export async function createExamAtt({
    examId,
    userProgressId,
    attemptNumber,
    totalPoints,
    deadlineAt
    },
    connection = pool
) {
    const sql = `
        INSERT INTO exam_attempts (
            exam_id,
            user_progress_id,
            attempt_number,
            total_points,
            deadline_at
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        examId,
        userProgressId,
        attemptNumber,
        totalPoints,
        deadlineAt,
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findAllExamAtt(connection = pool) {
    const sql = `
        SELECT
            ea.exam_attempt_id,
            ea.exam_id,
            ea.user_progress_id,
            ea.attempt_number,
            ea.score,
            ea.total_points,
            ea.percentage,
            ea.is_passed,
            ea.deadline_at,
            ea.status,
            ea.started_at,
            ea.completed_at
        FROM exam_attempts ea
        ORDER BY ea.exam_attempt_id;
    `;
    const { rows } = await connection.query(sql);

    return rows;
}

export async function findExamAttById(
    {examAttemptId}, connection = pool
) {
    const sql = `
        SELECT
            ea.exam_attempt_id,
            ea.exam_id,
            ea.user_progress_id,
            ea.attempt_number,
            ea.score,
            ea.total_points,
            ea.percentage,
            ea.is_passed,
            ea.deadline_at,
            ea.status,
            ea.started_at,
            ea.completed_at
        FROM exam_attempts ea
        WHERE ea.exam_attempt_id = $1;
    `;
    const { rows } = await connection.query(sql, [examAttemptId]);

    return rows[0];
}

export async function findExamAttByUserProgress(
    {userProgressId}, connection = pool
) {
    const sql = `
        SELECT
            ea.exam_attempt_id,
            ea.exam_id,
            ea.user_progress_id,
            ea.attempt_number,
            ea.score,
            ea.total_points,
            ea.percentage,
            ea.is_passed,
            ea.deadline_at,
            ea.status,
            ea.started_at,
            ea.completed_at
        FROM exam_attempts ea
        WHERE ea.user_progress_id = $1
        ORDER BY ea.attempt_number;
    `;
    const { rows } = await connection.query(sql, [userProgressId]);

    return rows;
}

export async function updateExamAttRes({
    examAttemptId,
    score,
    percentage,
    isPassed,
    status,
},
    connection = pool
) {
    const sql = `
        UPDATE exam_attempts
        SET
            score = $1,
            percentage = $2,
            is_passed = $3,
            status = $4,
            completed_at = NOW()
        WHERE exam_attempt_id = $5
        RETURNING *;
    `;
    const values = [
        score,
        percentage,
        isPassed,
        status,
        examAttemptId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function updateExamAttStat(
    {examAttemptId, status},
    connection = pool
) {
    const sql = `
        UPDATE exam_attempts
        SET
            status = $1
        WHERE exam_attempt_id = $2
        RETURNING *;
    `;

    const { rows } = await connection.query(
        sql,
        [status, examAttemptId]
    );
    return rows[0];
}