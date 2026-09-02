import pool from "../config/db.js";

export async function createUser(user, connection = pool) {
    const sql = `
    INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        is_active,
        created_by,
        updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by;
    `;
    const values = [
        user.firstName,
        user.lastName,
        user.email,
        user.passwordHash,
        user.isActive,
        user.createdBy,
        user.updatedBy
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findUserByEmail(email, connection = pool) {
    const sql = `
    SELECT
        user_id,
        first_name,
        last_name,
        email,
        password_hash,
        is_active
    FROM users
    WHERE email = $1;
    `;

    const values = [email];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}

export async function findAllUsers(connection = pool) {
    const sql = `
    SELECT 
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by;
    FROM users ORDER BY user_id;
    `;

    const { rows } = await connection.query(sql);

    return rows;
}

export async function findUserById(user_id, connection = pool) {
    const sql = `
    SELECT
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by;
    FROM users
    WHERE user_id = $1;
    `;

    const values = [user_id];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}

export async function updateUserById(
        user_id, 
        user, 
        connection = pool
    ) {
    const sql = `
    UPDATE users
    SET        
        first_name = $1,
        last_name = $2,
        email = $3,
        is_active = $4,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $6
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by;
    `;

    const values = [
        user.firstName,
        user.lastName,
        user.email,
        user.isActive,
        user.updatedBy,
        user_id
    ]

    const { rows } = await connection.query(sql, values);

    return rows [0];
};

export async function updateUserPassword(
        user_id, 
        passwordHash, 
        connection = pool
    ) {
    const sql = `
    UPDATE users 
    SET
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $2
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        updated_at;
    `;

    const values = [
        passwordHash, user_id
    ];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}

export async function deactivateUserById(
        user_id, 
        updated_by, 
        connection = pool
    ) {
    const sql = `
    UPDATE users
    SET
        is_active = false,
        updated_by =  $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $2
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        update_at,
        updated_by;
    `;

    const values = [updated_by, user_id];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}