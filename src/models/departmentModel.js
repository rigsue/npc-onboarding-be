import pool from "../config/db.js";

export async function makeDepartment(department, connection = pool) {
    const sql = `
    INSERT INTO departments (
        department_name,
        description,
        is_active,
        created_by,
        updated_by
    )
    VALUES ($1, $2, $3, $4, $5,)
    RETURNING
        department_id,
        department_name,
        description,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by;
    `;
    const values = [
        department.departmentName,
        department.description,
        department.isActive,
        department.createdBy,
        department.updatedBy
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findAllDepartments(connection = pool) {
    const sql = `
    SELECT
        department_id,
        department_name,
        description,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by
    FROM departments
    ORDER BY department_id;
    `;
    const { rows } = await connection.query(sql);

    return rows;
}

export async function findDepartmentById(department_id, connection = pool) {
    const sql = `
    SELECT
        department_id,
        department_name,
        description,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by
    FROM departments
    WHERE department_id = $1;
    `;
    const values= [department_id];

    const { rows } = await connection.query(sql, values);

    return rows [0];
};

export async function updateDepartmentById(
    department_id, 
    department, 
    connection = pool
) {
    const sql = `
    UPDATE departments
    SET
        department_name = $1,
        description = $2,
        is_active = $3,
        updated_by = $4,
        updated_at = $5 = CURRENT_TIMESTAMP
    WHERE department_id = $6
    RETURNING
        department_id,
        department_name,
        description,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by;
    `;
    const values = [
        department.departmentName,
        department.description,
        department.isActive,
        department.updatedBy,
        department_id
    ];
    const  { rows } = await connection.query(sql, values);
    return rows [0];
};

export async function deactivateDepartmentById(
    department_id,
    updated_by,
    connection = pool
) {
    const sql = `
    is_active = false,
    updated_by = $1,
    updated_at = CURRENT_TIMESTAMP
WHERE department_id = $2
RETURNING
    department_id,
    department_name,
    description,
    isActive,
    created_at,
    updated_at,
    created_by,
    updated-by;
    `;

    const values = [updated_by, department_id];

    const { rows } = await connection.query(sql, values);

    return rows [0];
}