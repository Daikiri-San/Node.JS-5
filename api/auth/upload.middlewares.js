const path = require("path");
const multer = require("multer");
const { promises: fsPromises } = require("fs");

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    const { ext } = path.parse(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

async function compressImage(req, res, next) {
  if (!req.file) {
    next();
  }

  if (req.file) {
    console.log(req.file);
  }
  const { path: uncompressedFilePath, filename } = req.file;
  const COMPRESSING_DESTINATING = process.env.COMPRESSED_IMAGES_FOLDER;

  await imagemin([uncompressedFilePath], {
    destination: COMPRESSING_DESTINATING,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  req.file.path = path.join(COMPRESSING_DESTINATING, filename);

  await fsPromises.unlink(uncompressedFilePath);

  next();
}

module.exports = { upload: multer({ storage }), compressImage };
