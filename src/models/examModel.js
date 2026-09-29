import pool from "../config/db.js";

export async function createExamination({
        learnModId,
        title,
        passingScore,
        attemptLimit = null,
        durationMinutes = 30,
        createdBy
    },
        connection = pool

) {
    const sql = `
        INSERT INTO exams(
            learn_mod_id,
            title,
            passing_score, 
            attempt_limit,
            duration_minutes,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [
        learnModId,
        title,
        passingScore,
        attemptLimit,
        durationMinutes,
        createdBy,
    ];
    const { rows } = await connection.query(sql, values);
    return rows[0];
}

export async function findAllExams(connection = pool) {
    const sql = `
        SELECT
            e.exam_id,
            e.learn_mod_id,
            lm.title AS module_title,
            e.title,
            e.passing_score,
            e.attempt_limit,
            e.is_active,
            e.duration_minutes,
            e.created_by,
            e.created_at,
            e.updated_by,
            e.updated_at
        FROM exams e
        INNER JOIN learning_module lm
            ON e.learn_mod_id = lm.learn_mod_id
        ORDER BY
            e.learn_mod_id,
            e.exam_id;
    `;
    const { rows } = await connection.query(sql);
    return rows;
}

export async function findExambyModId(
    learnModId, connection = pool) {
    const sql = `
        SELECT
            exam_id,
            learn_mod_id,
            title,
            passing_score, 
            attempt_limit,
            is_active,
            duration_minutes,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM exams
        WHERE learn_mod_id = $1
        ORDER BY exam_id;
    `;
    const { rows } = await connection.query (sql, [learnModId]);
    return rows[0];
}

export async function findExamById(examId, connection = pool) {
    const sql = `
        SELECT 
            e.exam_id,
            e.learn_mod_id,
            lm.title AS module_title,
            e.title,
            e.passing_score,
            e.attempt_limit,
            e.is_active,
            e.duration_minutes,
            e.created_by,
            e.created_at,
            e.updated_by,
            e.updated_at
        FROM exams e
        INNER JOIN learning_module lm
            ON e.learn_mod_id = lm.learn_mod_id
        WHERE e.exam_id = $1;        
    `;
    const { rows } = await connection.query (sql, [examId]);

    return rows[0];
}

export async function updateExamById(
    examId, 
    {learnModId,
    title,
    passingScore,
    attemptLimit,
    durationMinutes,
    updatedBy},
    connection = pool       
) {
    const sql = `
        UPDATE exams
        SET
            learn_mod_id = $1,
            title = $2,
            passing_score = $3,
            attempt_limit = $4,
            duration_minutes = $5,
            updated_by = $6,
            updated_at = NOW()
        WHERE exam_id = $7
        RETURNING *;
    `;
    const values = [
            learnModId,
            title,
            passingScore,
            attemptLimit,
            durationMinutes,
            updatedBy,
            examId
    ];
    const { rows } = await connection.query(sql, values);
    return rows[0];
}

export async function updateExamStat(
    {examId, isActive, updatedBy}, connection = pool
) {
    const sql = `
        UPDATE exams
        SET
            is_active = $1,
            updated_by = $2,
            updated_at = NOW()
        WHERE exam_id = $3
        RETURNING *;
    `;
    const { rows } = await connection.query(sql, [
        isActive, updatedBy, examId
    ]);
    return rows[0];
}