require('dotenv').config();
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const { logger } = require('../utils/logger');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploads = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
  },
});

const uploadFileToS3 = (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_9e550abf5adb_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(new Error('File upload failed'));
      } else {
        resolve(data.Location);
      }
    });
  });
};

const deleteFromS3 = async (url) => {
  const urlParts = new URL(url);
  const bucket = urlParts.hostname.split('.')[0];
  const key = decodeURIComponent(urlParts.pathname.substring(1));

  const deleteParams = {
    Bucket: bucket,
    Key: key,
  };

  await s3.deleteObject(deleteParams).promise();
  return true;
};

const uploadSvgToS3 = async (params) => {
  const { title } = params;
  const folderPath = path.join(__dirname, '../data/icons');
  let fileName = `${title.replace(/\s+/g, '').toLowerCase()}.svg`;
  const filePath = path.join(folderPath, fileName);
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileContent = fs.readFileSync(filePath);
  const param = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `icons/${fileName}`,
    Body: fileContent,
    ContentType: 'image/svg+xml',
  };
  try {
    const data = await s3.upload(param).promise();
    return data.Location;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

const uploadToS3 = async (filePath, fileName) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `icons/${fileName}`, // File name you want to save as in S3
    Body: fileContent,
    ContentType: 'image/svg+xml',
  };

  // Uploading files to the bucket
  const data = await s3.upload(params).promise();
  return data.Location; // The URL of the uploaded file
};

module.exports = {
  uploads,
  uploadFileToS3,
  deleteFromS3,
  uploadSvgToS3,
  uploadToS3,
};
