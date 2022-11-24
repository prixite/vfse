import S3 from "react-aws-s3";

const config = {
  bucketName: process.env.AWS_STORAGE_BUCKET_NAME,
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Url: `https://${process.env.AWS_STORAGE_BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com`,
  dirName: "media",
};

const ReactS3Client = new S3(config);

export const uploadImageToS3 = (imageFile: string) =>
  new Promise((resolve, reject) => {
    ReactS3Client.uploadFile(imageFile)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });

export const deleteImageFromS3 = async (url: string) => {
  const deleteResult = await fetch(url, { method: "delete" });
  return {
    ...deleteResult,
    message: "File deleted",
  };
};
