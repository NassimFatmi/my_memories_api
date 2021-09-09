const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/api/auth");
const memoriesRouter = require("./routes/api/memories");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.DATABASE_CONNECT).catch((err) => {
	if (err) throw err;
});

mongoose.connection.on("error", (err) => {
	throw err.code;
});

mongoose.connection.once("open", () => console.log("Connected to database"));

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(cors());

app.use("/api/user", authRouter);
app.use("/api/memories", memoriesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
