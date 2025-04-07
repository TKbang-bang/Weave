const multer = require("multer");
const path = require("path");

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: function (req, file, cb) {
    const now = Date.now();
    const originalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${now}-${originalName}`);
  },
});

// Filtro de archivos: solo imágenes o videos
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo imágenes y videos."));
  }
};

// Middleware de carga con límites
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = upload;
