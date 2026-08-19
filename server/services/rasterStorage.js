import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,

    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

export async function uploadImage(buffer, filename) {

    const s3Client = new S3Client({
        region: process.env.AWS_REGION,

        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        },
    });

    const command = new PutObjectCommand({

        Bucket: process.env.S3_BUCKET_NAME,
    
        Key: filename,
    
        Body: buffer,
    
        ContentType: "image/png"
    
    });

    await s3Client.send(command);

}

export async function generateSignedUrl(key) {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        },
    });

    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    });

    return await getSignedUrl(
        s3Client,
        command,
        {
            expiresIn: 3600
        }
    );
}