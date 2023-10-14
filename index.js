const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: "50mb", extended: false }));

//import routes
const authRoute = require("./routes/auth");

const uri = process.env.DB_CONNECTION;

const connectToMongo = async () => {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};

connectToMongo();

const defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY;

app.get("/", (req, res) => {
  res.send("Mailer is running on port 5000");
});

app.use("/api/user", authRoute);

app.post("/api/send_mail", async (req, res) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sender = {
    email: process.env.MY_EMAIL,
    name: `${req.body.senderFirstName + " " + req.body.senderLastName}`,
  };
  const receivers = [
    {
      email: req.body.recipientEmail,
    },
  ];
  try {
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: req.body.subject,
      textContent: "Test Email",
      htmlContent: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <html lang="en">
        
          <head></head>
        
          <body style="background-color:#ffffff;padding:10px 0">
            <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
              <tr style="width:100%">
                  <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                    <tbody>
                      <tr>
                        <td>
                          <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Hi ${req.body.recipientFirstname},</p>
                          <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Do remember to do your assignments on time and do not do it late.
                          <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">To keep your account secure, please don&#x27;t forward this email to anyone. See our Help Center for</p>
                          <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Hope you are enjoying my service?</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
              </tr>
            </table>
          </body>
        
        </html>
        `,
    });
    return res.send(sendEmail);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

app.listen(PORT, () => {
  console.log("Server is up and running");
});
