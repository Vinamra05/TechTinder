import {SESClient} from '@aws-sdk/client-ses';

const REGION = 'ap-south-1'; // Replace with your desired AWS region
const sesClient = new SESClient({region: REGION,credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
}});

export default sesClient;