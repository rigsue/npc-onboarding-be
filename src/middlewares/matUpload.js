import multer from "multer";
import path, { extname } from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

const uploadDir = path.resolve(
    process.cwd(),
    "uploads",
    "materialsd"
);

fs.mkdirSync(uploadDir, { recursive: true });

const allowedExtensions = new Set([
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg", ".webp", ".mp3", ".mp4"
]);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLocaleLowerCase();

        cb(null, `${randomUUID()}${extension}`);
    }
});

const upload = multer({
    storage, 

    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 20
    },

    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLocaleLowerCase();

        if(allowedExtensions.has(extension)) {
            return cb(new Error("This file type is not allowed"));
        }
        cb(null, true);
    }
})

export default upload;