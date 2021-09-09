const mongoose = require("mongoose");

// create the Schema
const memorySchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	userId: {
		type: String,
		required: true,
	},
});

const Memory = mongoose.model("Memorie", memorySchema);

module.exports = Memory;
