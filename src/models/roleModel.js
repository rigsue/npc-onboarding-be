import { pool } from "../config/db.js"

export async function createRole(role, connection = pool) {
    const sql = `
    INSERT INTO roles (
        role_name
    )
    VALUES ($1)
    RETURNING
        role_id,
        role_name,
        created_at;
    `;
    const values = [role.roleName];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}