import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// =================== MongoDB Connection ===================
mongoose
  .connect("mongodb+srv://ionode:ionode@ionode.qgqbadm.mongodb.net/EVCMS")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error:", err));

// ========================= Schemas =========================
const evStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  disHighway: { type: Number, required: true, default: 0 },
  maxCapacity: { type: Number, default: 0 },
  rate: { type: Number, default: 5 },
  currPower: { type: Number, default: 0 },
  consPower: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  occupancy: { type: Boolean, default: false },
  address: { type: String, default: "Unknown" },
  connector: { type: String, default: "Type2" },
  power: { type: Number, default: 0 },
});

const userProfile = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleNo: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  wallet: { type: Number, default: 0 },
});

const Stations = mongoose.model("Station", evStationSchema);
const User = mongoose.model("User", userProfile);

// =================== CORS for React Frontend ===================
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================= cshfree Setup =======================
const cashfree = new Cashfree(
  process.env.CF_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,

  process.env.CF_CLIENT_ID,
  process.env.CF_CLIENT_SECRET
);

// ---------------- CREATE CASHFREE ORDER ----------------
app.post("/create-order", async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, error: "Invalid amount" });

    const orderRequest = {
      order_amount: amount.toString(),
      order_currency: "INR",
      customer_details: {
        customer_id: "node_sdk_" + Date.now(), // unique ID
        customer_name: customerName || "EV User",
        customer_email: customerEmail || "user@example.com",
        customer_phone: customerPhone || "9999999999",
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-success`, // redirect page in frontend
      },
    };

    const response = await cashfree.PGCreateOrder(orderRequest);

    res.status(200).json({
      success: true,
      data: response.data, // contains payment_session_id
    });
  } catch (error) {
    console.error("Cashfree Order Error:", error.response?.data || error);
    res.status(500).json({ success: false, error: "Payment order failed" });
  }
});

// ---------------- VERIFY ORDER STATUS ----------------
app.get("/verify-cashfree/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const cf = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CF_APP_ID,
      process.env.CF_SECRET
    );

    const result = await cf.PGFetchOrder(orderId);

    if (result.data.order_status === "PAID") {
      return res.json({
        success: true,
        payment: {
          orderId,
          paymentId: result.data.cf_payment_id,
        },
      });
    }

    res.json({ success: false });
  } catch (err) {
    res.json({ success: false });
  }
});

// ========================= ROUTES =========================

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running 🚀" });
});

// ---------------- USER LOGIN/REGISTER ----------------
app.post("/login", async (req, res) => {
  try {
    const { name, mobile, vehicle } = req.body;

    const existing = await User.findOne({ vehicleNo: vehicle });

    if (existing)
      return res.status(200).json({ message: "User logged in", user: existing });

    const newUser = await User.create({
      name,
      mobile,
      vehicleNo: vehicle,
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- START SESSION ----------------
app.post("/start-session", async (req, res) => {
  try {
    const { stationId, duration } = req.body;

    const station = await Stations.findById(stationId);
    if (!station)
      return res.status(404).json({ message: "Station not found" });

    const cost = station.rate * duration;

    station.occupancy = true;
    station.duration = duration;
    station.cost = cost;

    await station.save();

    res.status(200).json({ message: "Session Started", cost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- END SESSION ----------------
app.post("/end-session", async (req, res) => {
  try {
    const { stationId } = req.body;

    const station = await Stations.findById(stationId);
    if (!station)
      return res.status(404).json({ message: "Station not found" });

    station.occupancy = false;
    station.currPower += station.consPower;
    station.duration = 0;
    station.cost = 0;

    await station.save();

    res.status(200).json({ message: "Session Ended" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CREATE NEW STATION ----------------
app.post("/stations", async (req, res) => {
  try {
    const data = req.body;

    const newStation = await Stations.create(data);

    res.status(201).json({
      message: "Station Created",
      station: newStation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET ALL STATIONS ----------------
app.get("/stations", async (req, res) => {
  try {
    const stations = await Stations.find();
    res.status(200).json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET ONE STATION ----------------
app.get("/stations/:id", async (req, res) => {
  try {
    const station = await Stations.findById(req.params.id);

    if (!station)
      return res.status(404).json({ message: "Station not found" });

    res.status(200).json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- UPDATE STATION ----------------
app.put("/stations/:id", async (req, res) => {
  try {
    const updated = await Stations.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Station not found" });

    res.status(200).json({ message: "Updated", station: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DELETE STATION ----------------
app.delete("/stations/:id", async (req, res) => {
  try {
    const deleted = await Stations.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Station not found" });

    res.status(200).json({ message: "Deleted", station: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================= PAYMENT SCHEMA =========================
const paymentSchema = new mongoose.Schema({
  station: String,
  energy: Number,
  cost: Number,
  paymentId: String,
  timestamp: { type: Date, default: Date.now },
  user: String, // optional: vehicle or mobile or name
});

const Payment = mongoose.model("Payment", paymentSchema);

app.post("/api/fake-payment", async (req, res) => {
  try {
    const { station, energy, cost, user } = req.body;

    const paymentId = "pay_fake_" + Date.now();

    const newPayment = await Payment.create({
      station,
      energy,
      cost,
      paymentId,
      user,
    });

    res.json({
      success: true,
      paymentId,
      message: "Fake payment saved successfully!",
      payment: newPayment,
    });
  } catch (err) {
    console.log("Error saving payment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ timestamp: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments" });
  }
});


// ======================= START SERVER =======================
const PORT = process.env.PORT || 38923;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
