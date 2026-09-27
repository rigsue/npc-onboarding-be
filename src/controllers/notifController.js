import {
    createNotif,
    findNotifById,
    findNotifsByUser,
    addNotifRecipient,
    markNotifAsRead
} from "../models/notifModel.js";

export async function makeNotif(req, res, next) {
    try {
        const {
            title,
            description,
            notificationType,
            recipients
        } = req.body;
        if (
            !title ||
            !description ||
            !notificationType
        ) {
            const error = new Error(
                "Title, description, and notification type are required"
            );
            error.status = 400;
            error.code = "missing_notification_fields";
            throw error;
        }
        if (
            !Array.isArray(recipients) ||
            recipients.length === 0
        ) {
            const error = new Error(
                "At least one notification recipient is required"
            );
            error.status = 400;
            error.code = "missing_notification_recipients";
            throw error;
        }
        const notification = await createNotif(
            title,
            description,
            notificationType,
            req.user.userId
        );
        for (const userId of recipients) {
            await addNotifRecipient(
                notification.notificationId,
                userId
            );
        }
        return res.status(201).json({
            message: "Notification created successfully",
            data: notification
        });
    } catch (err) {
        next(err);
    }
}

export async function getNotifById(req, res, next) {
    try {
        const { id } = req.params;

        const notification = await findNotifById(id);

        if (!notification) {
            const error = new Error(
                "Notification not found"
            );
            error.status = 404;
            error.code = "notification_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Notification retrieved successfully",
            data: notification
        });
    } catch (err) {
        next(err);
    }
}

export async function getMyNotifs(req, res, next) {
    try {
        const notifications =
            await findNotifsByUser(
                req.user.userId
            );
        return res.status(200).json({
            message: "Notifications retrieved successfully",
            data: notifications
        });
    } catch (err) {
        next(err);
    }
}

export async function markNotifyAsRead(req, res, next) {
    try {
        const { id } = req.params;

        const notification =
            await markNotifAsRead(
                id,
                req.user.userId
            );
        if (!notification) {
            const error = new Error(
                "Notification recipient record not found"
            );
            error.status = 404;
            error.code = "notification_recipient_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Notification marked as read",
            data: notification
        });
    } catch (err) {
        next(err);
    }
}