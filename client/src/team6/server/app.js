import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ⭐ ENABLE CORS ⭐
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// Log every request
app.use((req, res, next) => {
  console.log("➡️ REQUEST:", req.method, req.url);
  console.log("   BODY:", req.body);
  next();
  console.log("TOKEN=", process.env.LMS_TOKEN);
});

// ----------------------
// IMPORT ROUTES
// ----------------------
import examsRoutes from "./routes/exams.routes.js";
import variantsRoutes from "./routes/variants.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import coursesRoutes from "./routes/courses.routes.js";

// ✅ ONLY USE NEW LMS PROXY
import lmsProxyRoutes from "./routes/lms.proxy.routes.js";

// ----------------------
// REGISTER ROUTES
// ----------------------

// LMS Proxy – FORWARD requests to TODU API
app.use("/api/courses", coursesRoutes);
app.use("/api/exams", examsRoutes);
app.use("/api/variants", variantsRoutes);
app.use("/api/students", studentsRoutes);

// LMS proxy ONLY for /api/lms/**
app.use("/api/lms", lmsProxyRoutes);
// ----------------------
// START SERVER
// ----------------------
app.listen(3001, () => {
  console.log("Team6 API Server running on http://localhost:3001");
});
