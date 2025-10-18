import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { BadRequestError } from 'core/shared/errors';
import { config } from '../../config';


const uploadDir = "public/uploads/cars";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `car-${uniqueSuffix}${extension}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = config.allowedFileTypes;
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequestError(`Formato de archivo no válido. Solo se aceptan: ${allowedMimeTypes.join(', ')}`));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: config.maxFileSize
    }
});