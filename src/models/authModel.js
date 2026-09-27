import pool from "../config/db.js";

export async function findUserForLogin(
    email, connection = pool) {
    const sql = `
        SELECT
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.password_hash,
            u.is_active,
            u.contact_number,
            u.employee_number,
            u.position,
            r.role_id,
            r.role_name,
            d.department_id,
            d.department_name
        FROM users u
        INNER JOIN user_roles ur
            ON u.user_id = ur.user_id
        INNER JOIN roles r
            ON ur.role_id = r.role_id
        LEFT JOIN departments d
            ON u.department_id = d.department_id
        WHERE u.email = $1;
    `;
    const { rows } = await connection.query(sql, [email]);
    
    return rows[0];
}