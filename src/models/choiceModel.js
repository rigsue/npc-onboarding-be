import pool from "../config/db.js";

export async function createChoice(
    {questionId,
    choiceText,
    isCorrect = false,
    displayOrder = 0,
    createdBy},
    connection = pool
) {
    const sql = `
        INSERT INTO choices (
            question_id,
            choice_text,
            is_correct,
            display_order,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        questionId,
        choiceText,
        isCorrect,
        displayOrder,
        createdBy
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findAllChoices(connection = pool) {
    const sql = `
        SELECT
            choice_id,
            question_id,
            choice_text,
            is_correct,
            display_order,
            is_active,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM choices
        ORDER BY question_id, display_order;
    `;
    const { rows } = await connection.query(sql);

    return rows;
}

export async function findChoicesByQuesId(
    {questionId},
    connection = pool
) {
    const sql = `
        SELECT
            choice_id,
            question_id,
            choice_text,
            is_correct,
            display_order,
            is_active,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM choices
        WHERE question_id = $1
        ORDER BY display_order;
    `;
    const { rows } = await connection.query(sql, [questionId]);

    return rows;
}

export async function findChoiceById(
    {choiceId},
    connection = pool
) {
    const sql = `
        SELECT
            choice_id,
            question_id,
            choice_text,
            is_correct,
            display_order,
            is_active,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM choices
        WHERE choice_id = $1;
    `;
    const { rows } = await connection.query(sql, [choiceId]);

    return rows[0];
}

export async function updateChoiceById(
    {choiceId,
    choiceText,
    isCorrect,
    displayOrder,
    updatedBy},
    connection = pool
) {
    const sql = `
        UPDATE choices
        SET
            choice_text = $1,
            is_correct = $2,
            display_order = $3,
            updated_by = $4,
            updated_at = NOW()
        WHERE choice_id = $5
        RETURNING *;
    `;

    const values = [
        choiceText,
        isCorrect,
        displayOrder,
        updatedBy,
        choiceId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function updateChoiceStat(
    {choiceId,
    isActive,
    updatedBy},
    connection = pool
) {
    const sql = `
        UPDATE choices
        SET
            is_active = $1,
            updated_by = $2,
            updated_at = NOW()
        WHERE choice_id = $3
        RETURNING *;
    `;
    const values = [
        isActive,
        updatedBy,
        choiceId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}