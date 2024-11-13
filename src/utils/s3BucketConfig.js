require('dotenv').config();
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const { logger } = require('../utils/logger');

const _s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const _uploads = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (_req, _file, _cb) => {
    const _filetypes = /jpeg|jpg|png/;
    const _mimetype = _filetypes.test(_file.mimetype);
    const _extname = _filetypes.test(
      path.extname(_file.originalname).toLowerCase()
    );
    if (_mimetype && _extname) {
      return _cb(null, true);
    }
    return _cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
  },
});

const uploadFileToS3 = (_file) => {
  const _params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_9e550abf5adb_${_file.originalname}`,
    Body: _file.buffer,
    ContentType: _file.mimetype,
  };

  return new Promise((_resolve, _reject) => {
    _s3.upload(_params, (_error, _data) => {
      if (_error) {
        _reject(new Error('File upload failed'));
      } else {
        _resolve(_data.Location);
      }
    });
  });
};

const deleteFromS3 = async (_url) => {
  const _urlParts = new URL(_url);
  const _bucket = _urlParts.hostname.split('.')[0];
  const _key = decodeURIComponent(_urlParts.pathname.substring(1));

  const _deleteParams = {
    Bucket: _bucket,
    Key: _key,
  };

  await _s3.deleteObject(_deleteParams).promise();
  return true;
};

const uploadSvgToS3 = async (_params) => {
  const { title } = _params;
  const _folderPath = path.join(__dirname, '../data/icons');
  let _fileName = `${title.replace(/\s+/g, '').toLowerCase()}.svg`;
  const _filePath = path.join(_folderPath, _fileName);
  // Check if file exists
  if (!fs.existsSync(_filePath)) {
    return null;
  }
  const _fileContent = fs.readFileSync(_filePath);
  const _param = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `icons/${_fileName}`,
    Body: _fileContent,
    ContentType: 'image/svg+xml',
  };
  try {
    const _data = await _s3.upload(_param).promise();
    return _data.Location;
  } catch (_error) {
    logger.info(`=====> ERROR S3 SERVICE`);
    logger.error(_error.message);
    throw _error;
  }
};

const uploadToS3 = async (_filePath, _fileName) => {
  const _fileContent = fs.readFileSync(_filePath);

  const _params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `icons/${_fileName}`, // File name you want to save as in S3
    Body: _fileContent,
    ContentType: 'image/svg+xml',
  };

  // Uploading files to the bucket
  const _data = await _s3.upload(_params).promise();
  return _data.Location; // The URL of the uploaded file
};

module.exports = {
  uploads: _uploads,
  uploadFileToS3,
  deleteFromS3,
  uploadSvgToS3,
  uploadToS3,
};
