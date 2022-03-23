import S3 from "react-aws-s3";

const config = {
  bucketName: "vfse",
  region: "us-east-2",
  accessKeyId: "AKIAUIJ6MUSTHFCSHH45",
  secretAccessKey: "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",
};

const ReactS3Client = new S3(config);

export const uploadImageToS3 = (imageFile) =>
  new Promise((resolve, reject) => {
    ReactS3Client.uploadFile(imageFile)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
