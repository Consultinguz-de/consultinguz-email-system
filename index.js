import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { email, subject, message, htmlContent } = req.body;

  if (!email || (!message && !htmlContent)) {
    return res.status(400).json({
      success: false,
      error: "email va (message yoki htmlContent) majburiy",
    });
  }

  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "BREVO_API_KEY topilmadi (environmentda o'rnating)",
      });
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Consultinguz.de", email: "infoconsulting@akhrorweb.uz" },
        to: [{ email }],
        subject: subject || "Yangi xabar",
        textContent: message || undefined,
        htmlContent: htmlContent || (message ? `<p>${message}</p>` : undefined),
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Email server running on port", PORT));
