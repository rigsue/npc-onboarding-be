import pool from "../config/db.js"

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

export async function findAllRoles(connection = pool) {
    const sql = `
    SELECT
        role_id,
        role_name;
    FROM roles ORDER BY role_id;
    `;

    const { rows } = await connection.query(sql);

    return rows;    
}

export async function findRoleById(role_id, connection = pool) {
    const sql = `
    SELECT
        role_id,
        role_name,
        created_at;
    FROM roles 
    WHERE role_id = $1
    `;

    const values = [role_id];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}