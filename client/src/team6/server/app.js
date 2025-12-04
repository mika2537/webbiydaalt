import express from "express";

import examsRoutes from "./routes/exams.routes.js";
import variantsRoutes from "./routes/variants.routes.js";
import studentsRoutes from "./routes/students.routes.js";

const app = express();
app.use(express.json());

app.use("/exams", examsRoutes);
app.use("/variants", variantsRoutes);
app.use("/students", studentsRoutes);

app.listen(3001, () => {
  console.log("Team6 API Server running on http://localhost:3001");
});
