import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: "https://payfirst659.github.io"
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PayFirst1 backend is running");
});

app.post("/api/recharge-request", async (req, res) => {
  try {
    const {
      mobileNumber,
      operator,
      whatsappNumber,
      selectedPlan
    } = req.body;

    if (!mobileNumber || !operator ||
        !whatsappNumber || !selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const response = await fetch(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiKey: process.env.AISENSY_API_KEY,
          campaignName: "PayFirst1 Recharge Notification",
          destination: process.env.NOTIFICATION_NUMBER,
          userName: "PayFirst1",
          source: "PayFirst1 Website",
          templateParams: [
            mobileNumber,
            operator,
            whatsappNumber,
            selectedPlan
          ],
          tags: ["payfirst1"],
          attributes: {}
        })
      }
    );

    const result = await response.text();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "AiSensy request failed"
      });
    }

    res.json({
      success: true,
      message: "Recharge request sent",
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
