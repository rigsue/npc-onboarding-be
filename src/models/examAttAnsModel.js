import pool from "../config/db.js";

export async function createExamAttAns({
    examAttemptId,
    questionId,
    choiceId = null,
    answerText = null,
    isCorrect = null,
    pointsAwarded = null
},
    connection = pool

) {
    const sql = `
        INSERT INTO exam_attempt_answers (
            exam_attempt_id,
            question_id,
            choice_id,
            answer_text,
            is_correct,
            points_awarded
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [
    examAttemptId,
    questionId,
    choiceId,
    answerText,
    isCorrect,
    pointsAwarded
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findAllExamAttempts(connection = pool) {
    const sql = `
        SELECT
            attempt_answer_id,
            exam_attempt_id,
            question_id,
            choice_id,
            answer_text,
            is_correct,
            points_awarded,
            answered_at
        FROM exam_attempt_answers
        WHERE exam_attempt_id = $1
        ORDER BY attempt_answer_id;
    `;
    const { rows } = await connection.query(sql);

    return rows;
}

export async function findExamAttAnsById(
    {attemptAnswerId}, connection = pool
) {
    const sql = `
        SELECT
            attempt_answer_id,
            exam_attempt_id,
            question_id,
            choice_id,
            answer_text,
            is_correct,
            points_awarded,
            answered_at
        FROM exam_attempt_answers
        WHERE attempt_answer_id = $1;
    `;
    const { rows } = await connection.query(
        sql,
        [attemptAnswerId]
    );
    return rows[0];
}

export async function findExamAttAnsByAtt(
    {examAttemptId}, connection = pool
) {
    const sql = `
        SELECT
            attempt_answer_id,
            exam_attempt_id,
            question_id,
            choice_id,
            answer_text,
            is_correct,
            points_awarded,
            answered_at
        FROM exam_attempt_answers
        WHERE exam_attempt_id = $1
        ORDER BY question_id;
    `;
    const { rows } = await connection.query(
        sql,
        [examAttemptId]
    );
    return rows;
}

export async function updateExamAttAns({
    attemptAnswerId,
    choiceId = null,
    answerYext = null,
    isCorrect = null,
    pointsAwarded = null
},
    connection = pool
) {
    const sql = `
        UPDATE exam_attempt_answers
        SET
            choice_id = $1,
            answer_text = $2,
            is_correct = $3,
            points_awarded = $4
        WHERE attempt_answer_id = $5
        RETURNING *;
    `;
    const values = [
        choiceId,
        answerYext,
        isCorrect,
        pointsAwarded,
        attemptAnswerId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}