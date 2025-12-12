import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// LOGGING
app.use((req, res, next) => {
  console.log("➡️ REQUEST:", req.method, req.url);
  console.log("   BODY:", req.body);
  next();
});

// -----------------------------------
// ROUTES
// -----------------------------------
import examsRoutes from "./routes/exams.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import lmsProxyRoutes from "./routes/lms.proxy.routes.js";

// Local exam CRUD
app.use("/api/exams", examsRoutes);

// Local student answer + result
app.use("/api/students", studentsRoutes);

// TODU LMS proxy
app.use("/api/lms", lmsProxyRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Team6 API running on http://localhost:${PORT}`);
});
