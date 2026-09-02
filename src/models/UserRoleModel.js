import pool from "../config/db.js";

export async function createUserRole(userRole, connection = pool) {
    const sql = `
    INSERT INTO user_roles (
        user_id,
        role_id,
        updated_by
    )
    VALUES ($1, $2, $3)
    RETURNING
        user_role_id,
        user_id,
        role_id,
        updated_by,
        updated_at;
        `;
    const values = [
        userRole.userId,
        userRole.roleId,
        userRole.updatedBy
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function getRolesByUserId(userId, connection = pool) {
    const sql = `
        SELECT
            ur.user_role_id,
            ur.user_id,
            r.role_id,
            r.role_name,
            r.description
        FROM user_roles ur
        INNER JOIN roles r
            ON ur.role_id = r.role_id
        WHERE ur.user_id = $1
        ORDER BY r.role_id;
    `;

    const { rows } = await connection.query(sql, [userId]);

    return rows;
}

export async function getUsersByRoleId(roleId, connection = pool) {
    const sql = `
        SELECT
            ur.user_role_id,
            u.user_id,
            u.first_name,
            u.last_name,
            u.email
        FROM user_roles ur
        INNER JOIN users u
            ON ur.user_id = u.user_id
        WHERE ur.role_id = $1
        ORDER BY u.user_id;
    `;

    const { rows } = await connection.query(sql, [roleId]);

    return rows;
}


export async function removeRoleFromUser(
    userId,
    roleId,
    connection = pool
) {
    const sql = `
        DELETE FROM user_roles
        WHERE user_id = $1
          AND role_id = $2
        RETURNING
            user_role_id,
            user_id,
            role_id;
    `;

    const { rows } = await connection.query(sql, [
        userId,
        roleId
    ]);

    return rows[0];
}