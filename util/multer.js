const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');


const s3Storage = new aws.S3();

const storageS3 = multerS3({
  s3: s3Storage,
  bucket: 'blogtemplateadsp16bucket',
  metdata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname
    });
  },
  key: function (req, file, cb) {
    cb(null, file.originalname);
  },
  acl: 'public-read'
})

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// })

const upload = multer({
  storage: storageS3
});


module.exports = upload;