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

// Log every incoming request
app.use((req, res, next) => {
  console.log("➡️ REQUEST:", req.method, req.url);
  next();
});

// Import routes
import examsRoutes from "./routes/exams.routes.js";
import variantsRoutes from "./routes/variants.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import lmsRoutes from "./routes/lms.routes.js";
import coursesRoutes from "./routes/courses.routes.js";

// Register routes
app.use("/api/courses", coursesRoutes);
app.use("/api", lmsRoutes);
app.use("/api/exams", examsRoutes);
app.use("/api/variants", variantsRoutes);
app.use("/api/students", studentsRoutes);

// Start server
app.listen(3001, () => {
  console.log("Team6 API Server running on http://localhost:3001");
});
