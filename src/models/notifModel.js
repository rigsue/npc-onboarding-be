import pool from "../config/db.js";

export async function createNotif(
    {title,
    description,
    notificationType,
    createdBy = null},
    connection = pool
) {
    const sql = `
        INSERT INTO notifications (
            title,
            description,
            notification_type,
            created_by
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [
        title,
        description,
        notificationType,
        createdBy
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
}

export async function findNotifById(
    {notificationId}, connection = pool
) {
    const sql = `
        SELECT *
        FROM notifications
        WHERE notification_id = $1;
    `;
    const { rows } = await connection.query(
        sql, [notificationId]
    );
    return rows[0];
}

export async function findNotifsByUser(
    {userId}, connection = pool
) {
    const sql = `
        SELECT
            n.notification_id,
            n.title,
            n.description,
            n.notification_type,
            nr.is_read,
            nr.read_at,
            n.created_at
        FROM notification_recipients nr
        INNER JOIN notifications n
            ON nr.notification_id = n.notification_id
        WHERE nr.user_id = $1
        ORDER BY n.created_at DESC;
    `;
    const { rows } = await connection.query(
        sql, [userId]
    );
    return rows;
}

export async function addNotifRecipient(
    {notificationId, userId},
    connection = pool
) {
    const sql = `
        INSERT INTO notification_recipients (
            notification_id,
            user_id
        )
        VALUES ($1, $2)
        RETURNING *;
    `;
    const { rows } = await connection.query(
        sql, [notificationId, userId]
    );
    return rows[0];
}

export async function markNotifAsRead(
    {notificationId, userId},
    connection = pool
) {
    const sql = `
        UPDATE notification_recipients
        SET
            is_read = true,
            read_at = NOW()
        WHERE notification_id = $1
          AND user_id = $2
        RETURNING *;
    `;
    const { rows } = await connection.query(
        sql, [notificationId, userId]
    );
    return rows[0];
}