import { SendEmailCommand } from "@aws-sdk/client-ses";
import sesClient from "./sesClient.js";






const createSendEmailCommand = (toAddress, fromAddress,subject,body) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
         
        ],
        ToAddresses: [
          toAddress,
         
        ],
      },
      Message: {
       
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111827;">
              <h2 style="color: #6366f1;">👋 You’ve Got a New Connection!</h2>
              <p style="font-size: 16px; line-height: 1.6;">
                Hey there,
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                <strong>${body}</strong>
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                Log in to your <a href="https://techtinder.live" style="color: #8b5cf6; text-decoration: none;">TechTinder</a> account to view and respond to this request.
              </p>
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #6b7280;">
                This is an automated email from TechTinder • Do not reply directly.
              </p>
            </div>
          `,
          },
          Text: {
            Charset: "UTF-8",
            Data: "TEXT_FORMAT_BODY",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  

  const run = async (subject,body) => {
    const sendEmailCommand = createSendEmailCommand(
      "vinamrasharma0523@gmail.com",
      "Support@techtinder.live",
      subject,
      body
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  export default { run };