const OTPModel = require("../models/OTPModels"); //8
const transporter=require("../services/nodemailer")



function generateOTP() {//1
    return Math.floor(100000 + crypto.randomInt() * 900000);
}


const sendOTP=async(email)=>{
        if (!email || typeof email !== "string") {
          throw new Error("Invalid email address");
        }

        const otp=generateOTP()
  const info = await transporter.sendMail({//3
    from: `"OTP from iNoteBook" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of recipients
    subject: "OTP from iNotebook", // subject line  //4
    html: `<!DOCTYPE html> 
<html lang="en">
<head>
<meta charset="UTF-8">
<title>OTP Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fc;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fc;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.1);">

    <!-- Header -->
    <tr>
        <td align="center" style="background:linear-gradient(135deg,#4F46E5,#06B6D4);padding:35px;">
            <h1 style="color:#ffffff;margin:0;font-size:30px;">
                OTP Verification
            </h1>

            <p style="color:#e8f7ff;margin-top:10px;font-size:16px;">
                Verify your account securely
            </p>
        </td>
    </tr>

    <!-- Body -->
    <tr>
        <td style="padding:40px;">

            <h2 style="color:#333;margin-top:0;">
                Hello 👋
            </h2>

            <p style="font-size:16px;color:#555;line-height:28px;">
                Thank you for using our service.
                Please use the following One-Time Password (OTP)
                to verify your identity.
            </p>

            <!-- OTP Box -->
            <div style="
            margin:35px auto;
            width:250px;
            background:#eef5ff;
            border:2px dashed #4F46E5;
            border-radius:15px;
            text-align:center;
            padding:22px;">

                <span style="
                font-size:42px;
                letter-spacing:10px;
                color:#4F46E5;
                font-weight:bold;">
                ${otp}
                </span>

            </div>

            <p style="font-size:15px;color:#555;">
                This OTP is valid for
                <strong>10 minutes</strong>.
            </p>

            <p style="font-size:15px;color:#555;">
                Do not share this OTP with anyone.
                Our team will never ask for your OTP.
            </p>

            <div style="text-align:center;margin-top:35px;">

                <a href="#"
                style="
                text-decoration:none;
                background:#4F46E5;
                color:white;
                padding:14px 35px;
                border-radius:8px;
                font-size:16px;
                display:inline-block;">
                Verify Account
                </a>

            </div>

        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td align="center"
        style="background:#f7f9fc;padding:25px;">

            <p style="color:#888;font-size:13px;margin:0;">
                © 2026 DevSoft Technologies
            </p>

            <p style="color:#999;font-size:12px;margin-top:8px;">
                This is an automated email. Please do not reply.
            </p>

        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>`, // HTML body
  });

  
const newEntry=new OTPModel({ //9
    otp_code:otp,
    email:email
})
await newEntry.save() //10  //saving the data in mongodb(database)



console.log("OTP is sent successfully");//5
}


module.exports=sendOTP
