import pool from "../config/db.js";

export async function createQuestion({question}, connection = pool) {

    const sql = `
        INSERT INTO questions (
            exam_id,
            question,
            question_type,
            points,
            display_order,
            is_active,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            question_id,
            exam_id,
            question,
            question_type,
            points,
            display_order,
            is_active,
            created_by,
            created_at;
    `;
    const values = [
        question.examId,
        question.question,
        question.questionType,
        question.points ?? 1,
        question.displayOrder ?? 0,
        question.isActive ?? true,
        question.createdBy
    ];
    const { rows } = await connection.query(sql, values);
    return rows[0];
}

export async function findAllQuestions(connection = pool) {
    const sql = `
        SELECT
            q.question_id,
            q.exam_id,
            e.title AS exam_title,
            q.question,
            q.question_type,
            q.points,
            q.display_order,
            q.is_active,
            q.created_by,
            q.created_at,
            q.updated_by,
            q.updated_at
        FROM questions q
        INNER JOIN exams e
            ON q.exam_id = e.exam_id
        ORDER BY
            q.exam_id,
            q.display_order;
    `;
    const { rows } = await connection.query(sql);
    return rows;
}  

export async function findQuesByExamId(
    {examId}, connection = pool
) {
    const sql = `
        SELECT
            question_id,
            exam_id,
            question,
            question_type,
            points,
            display_order,
            is_active,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM questions
        WHERE exam_id = $1
        ORDER BY display_order;
    `;
    const values = [examId];
    const { rows } = await connection.query(sql, values);
    return rows;
}

export async function findQuesById(
    {questionId}, connection = pool
) {
    const sql = `
        SELECT
            q.question_id,
            q.exam_id,
            e.title AS exam_title,
            q.question,
            q.question_type,
            q.points,
            q.display_order,
            q.is_active,
            q.created_by,
            q.created_at,
            q.updated_by,
            q.updated_at
        FROM questions q
        INNER JOIN exams e
            ON q.exam_id = e.exam_id
        WHERE q.question_id = $1;
    `;
    const values = [questionId];
    const { rows } = await connection.query(sql, values);
    return rows[0];
}

export async function updateQuesById(
    {questionId, question},
    connection = pool
) {
    const sql = `
        UPDATE questions
        SET
            question = $1,
            question_type = $2,
            points = $3,
            display_order = $4,
            updated_by = $5,
            updated_at = NOW()
        WHERE question_id = $6
        RETURNING
            question_id,
            exam_id,
            question,
            question_type,
            points,
            display_order,
            is_active,
            updated_by,
            updated_at;
    `;
    const values = [
        question.question,
        question.questionType,
        question.points,
        question.displayOrder,
        question.updatedBy,
        questionId
    ];
    const { rows } = await connection.query(sql, values);
    return rows[0];
}

export async function updateQuesStatus(
    {questionId,
    isActive,
    updatedBy},
    connection = pool
) {
    const sql = `
        UPDATE questions
        SET
            is_active = $1,
            updated_by = $2,
            updated_at = NOW()
        WHERE question_id = $3
        RETURNING
            question_id,
            is_active,
            updated_by,
            updated_at;
    `;
    const values = [
        isActive,
        updatedBy,
        questionId
    ];
    const { rows } = await connection.query(sql, values);
    return rows[0];
}