
import axios from "axios";

export const sendEmail = async ({ to, subject, htmlContent }) => {
  console.log("to:", to);
  console.log("subject:", subject);
  console.log("sender:", process.env.SENDER_EMAIL);

  const data = {
    sender: {
      name: process.env.SENDER_NAME,
      email: process.env.SENDER_EMAIL,
    },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  console.log("Payload:");
  console.log(JSON.stringify(data, null, 2));

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    throw err;
  }
};