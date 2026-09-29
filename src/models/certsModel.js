import pool from "../config/db.js";

export async function createCert(
    userProgressId,
    certNumber,
    certVerification,
    certFile = null,
    tempVersion = null,
    expiresAt = null,
    connection = pool
) {
    const sql = `
        INSERT INTO certificates (
            user_progress_id,
            cert_number,
            cert_verification,
            cert_file,
            temp_version,
            issued_at,
            expires_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), $6)
        RETURNING *;
    `;
    const values = [
        userProgressId,
        certNumber,
        certVerification,
        certFile,
        tempVersion,
        expiresAt
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findCertById(
    certId, connection = pool
) {
    const sql = `
        SELECT *
        FROM certificates
        WHERE cert_id = $1;
    `;
    const { rows } = await connection.query(
        sql,
        [certId]
    );
    return rows[0];
}

export async function findCertByNumber(
    {certNumber}, connection = pool
) {
    const sql = `
        SELECT *
        FROM certificates
        WHERE cert_number = $1;
    `;
    const { rows } = await connection.query(
        sql, [certNumber]
    );
    return rows[0];
}

export async function findCertsByUserProgress(
    userProgressId, connection = pool
) {
    const sql = `
        SELECT *
        FROM certificates
        WHERE user_progress_id = $1
        ORDER BY issued_at DESC;
    `;
    const { rows } = await connection.query(
        sql, [userProgressId]
    );
    return rows;
}

export async function revokeCert(
    certId,
    revokedBy,
    revokedReason,
    connection = pool
) {
    const sql = `
        UPDATE certificates
        SET
            is_revoked = true,
            revoked_by = $1,
            revoked_at = NOW(),
            revoked_reason = $2
        WHERE cert_id = $3
        RETURNING *;
    `;
    const values = [
        revokedBy,
        revokedReason,
        certId
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}