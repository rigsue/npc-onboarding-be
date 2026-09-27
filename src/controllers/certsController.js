import {
    createCert,
    findCertById,
    findCertByNumber,
    findCertsByUserProgress,
    revokeCert
} from "../models/certsModel.js";

export async function makeCert(req, res, next) {
    try {
        const {
                userProgressId,
                certNumber,
                certVerification,
                certificateFile,
                tempVersion,
                expiresAt
        } = req.body;
        if (
            !userProgressId ||
            !certNumber ||
            !certVerification
        ) {
            const error = new Error(
                "User progress ID, certificate number, and verification code are required"
            );
            error.status = 400;
            error.code = "missing_certificate_fields";
            throw error;
        }
        const certificate = await createCert(
            userProgressId,
            certNumber,
            certVerification,
            certificateFile,
            tempVersion,
            expiresAt
        );
        return res.status(201).json({
            message: "Certificate created successfully",
            data: certificate
        });
    } catch (err) {
        next(err);
    }
}

export async function getCertById(req, res, next) {
    try {
        const { id } = req.params;

        const certificate = await findCertById(id);

        if (!certificate) {
            const error = new Error("Certificate not found");
            error.status = 404;
            error.code = "certificate_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Certificate retrieved successfully",
            data: certificate
        });
    } catch (err) {
        next(err);
    }
}

export async function verifyCert(req, res, next) {
    try {
        const { certNumber } = req.params;

        const certificate = await findCertByNumber(
            certNumber
        );
        if (!certificate) {
            const error = new Error(
                "Certificate not found"
            );
            error.status = 404;
            error.code = "certificate_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Certificate verified",
            data: certificate
        });
    } catch (err) {
        next(err);
    }
}

export async function getCertsByUserProgress(req, res, next
) {
    try {
        const { userProgressId } = req.params;

        const certificates =
            await findCertsByUserProgress(
                userProgressId
            );
        return res.status(200).json({
            message: "Certificates retrieved successfully",
            data: certificates
        });
    } catch (err) {
        next(err);
    }
}

export async function revokeCertificate(req, res, next
) {
    try {
        const { id } = req.params;
        const { revokedReason } = req.body;

        if (!revokedReason) {
            const error = new Error(
                "Revocation reason is required"
            );
            error.status = 400;
            error.code = "missing_revocation_reason";
            throw error;
        }
        const certificate = await revokeCert(
            id,
            req.user.userId,
            revokedReason
        );
        if (!certificate) {
            const error = new Error(
                "Certificate not found"
            );
            error.status = 404;
            error.code = "certificate_not_found";
            throw error;
        }
        return res.status(200).json({
            message: "Certificate revoked successfully",
            data: certificate
        });
    } catch (err) {
        next(err);
    }
}