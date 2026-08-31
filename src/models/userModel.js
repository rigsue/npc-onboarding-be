import { pool } from "../config/db.js";

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

// export default user_model('User', createUser);