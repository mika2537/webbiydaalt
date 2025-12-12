import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️ REQUEST:", req.method, req.url);
  console.log("   BODY:", req.body);
  next();
});

import examsRoutes from "./routes/exams.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import lmsProxyRoutes from "./routes/lms.proxy.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import variantsRoutes from "./routes/variants.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";

app.use("/api/exams", examsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/lms", lmsProxyRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/variants", variantsRoutes);
app.use("/api/statistics", statisticsRoutes);

const PORT = process.env.PORT || 3001;

await connectDB();

app.listen(PORT, () => {
  console.log(`✅ Team6 API running on http://localhost:${PORT}`);
});
