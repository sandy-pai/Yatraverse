import multer from 'multer';

// Use memory storage — no files written to disk.
// The buffer is converted to a Base64 data URI in the controller.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

// Middleware that accepts a single file under the field name "image"
export const uploadImage = upload.single('image');
