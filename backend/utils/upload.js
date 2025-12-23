import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
    url: process.env.DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ['image/png', 'image/jpg', 'image/jpeg'];

        if (!match.includes(file.mimetype)) return null;

        return {
            bucketName: 'photos',
            filename: `${Date.now()}-${file.originalname}`
        };
    }
});

const upload = multer({ storage });

export default upload;   // ✅ THIS LINE IS REQUIRED
