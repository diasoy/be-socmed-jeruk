import express from "express";
import postRoutes from "./routes/postRoutes.js";

const app = express();
const port = 3000;

app.use("/api", postRoutes);

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
