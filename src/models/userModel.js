import pool from "../config/db.js";

export async function createUser(user, connection = pool) {
    const sql = `
    INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        is_active,
        department_id,
        contact_number,
        employee_number,
        position,
        created_by,
        updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        department_id,
        contact_number,
        employee_number,
        position,
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
        user.departmentId,
        user.contactNumber,
        user.employeeNumber,
        user.position,
        user.createdBy,
        user.updatedBy
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findUserByEmail(email, connection = pool) {
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
        d.department_name
    FROM users u
    INNER JOIN user_roles ur
        ON u.user_id = ur.user_id
    INNER JOIN roles r
        ON ur.role_id = r.role_id
    INNER JOIN departments d
        ON u.department_id = d.department_id
    WHERE u.email = $1;
    `;

    const values = [email];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}

export async function findAllUsers(connection = pool) {
    const sql = `
    SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.is_active,
        d.department_id,
        d.department_name,
        u.contact_number,  
        u.employee_number,
        u.position,      
        r.role_id,
        r.role_name,
        u.created_at,
        u.updated_at,
        u.created_by,
        u.updated_by
    FROM users u
    INNER JOIN user_roles ur
        ON u.user_id = ur.user_id
    INNER JOIN roles r
        ON ur.role_id = r.role_id
    INNER JOIN departments d
        ON u.department_id = d.department_id
    ORDER BY u.user_id;
    `;

    const { rows } = await connection.query(sql);

    return rows;
}

export async function findUserById(userId, connection = pool) {
    const sql = `
    SELECT
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.is_active,
        d.department_id,
        d.department_name,
        u.contact_number,
        u.employee_number,
        u.position,
        u.created_at,
        u.updated_at,
        u.created_by,
        u.updated_by
    FROM users u
    INNER JOIN departments d
        ON u.department_id = d.department_id
    WHERE u.user_id = $1;
    `;

    const values = [userId];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}

export async function updateUserById(
        userId,  user, connection = pool
    ) {
    const sql = `
    UPDATE users
    SET        
        first_name = $1,
        last_name = $2,
        email = $3,
        department_id = $4,
        contact_number = $5,
        employee_number = $6,
        position = $7,
        updated_by = $8,
        updated_at = NOW()
    WHERE users.user_id = $9
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        department_id,
        contact_number,
        employee_number,
        position,
        created_at,
        updated_at,
        created_by,
        updated_by;
    `;

    const values = [
        user.firstName,
        user.lastName,
        user.email,
        user.departmentId,
        user.contactNumber,
        user.employeeNumber,
        user.position,
        user.updatedBy,
        userId
    ]

    const { rows } = await connection.query(sql, values);

    return rows [0];
};

export async function updateUserPassword(
        userId, passwordHash, connection = pool
    ) {
    const sql = `
    UPDATE users 
    SET
        password_hash = $1,
        updated_at = NOW()
    WHERE user_id = $2
    RETURNING
        user_id,
        updated_at;
    `;

    const values = [
        passwordHash, userId
    ];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}

export async function deactivateUserById(
        userId, updatedBy, connection = pool
    ) {
    const sql = `
    UPDATE users
    SET
        is_active = false,
        updated_by =  $1,
        updated_at = NOW()
    WHERE user_id = $2
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        updated_at,
        updated_by;
    `;

    const values = [updatedBy, userId];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}

export async function activateUserById(
        userId, updatedBy, connection = pool
    ) {
    const sql = `
    UPDATE users
    SET
        is_active = true,
        updated_by =  $1,
        updated_at = NOW()
    WHERE user_id = $2
    RETURNING
        user_id,
        first_name,
        last_name,
        email,
        is_active,
        updated_at,
        updated_by;
    `;

    const values = [updatedBy, userId];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}