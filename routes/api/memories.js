const express = require("express");
const router = express.Router();

const Memory = require("../../models/Memory");

// Get all Memorys
router.get("/", async (req, res) => {
	try {
		const memories = await Memory.find({});
		res.status(200).json(memories);
	} catch (err) {
		res.status(500).json({
			message: "An error was happend, cannot get data",
			code: err.code,
		});
	}
});

// create new Memorie
router.post("/", (req, res) => {
	if (!req.body.title || !req.body.body) {
		res.status(400).json({
			message: "title and body are required parameters",
		});
	} else {
		const memory = new Memory(req.body);
		memory
			.save()
			.then(() => {
				res.status(200).json({
					memory: memory,
					message: "Item saved successfully",
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Cannot save data due to server error",
					code: err.code,
				});
			});
	}
});

// get a single memorie
router.get("/:id", async (req, res) => {
	try {
		const found = await Memory.findById(req.params.id);
		if (found) {
			res.status(200).json(found);
		} else {
			res.status(400).json({
				message: "Item not found",
			});
		}
	} catch (err) {
		res.status(400).json({
			message: "Id unvalid",
		});
	}
});

// update a memory
router.put("/:id", async (req, res) => {
	try {
		const found = await Memory.findById(req.params.id);
		if (found) {
			await Memory.updateOne(
				{
					_id: found.id,
				},
				{
					$set: {
						title: req.body.title ? req.body.title : found.title,
						body: req.body.body ? req.body.body : found.body,
					},
				}
			);
			res.status(200).json({
				message: "item updated",
			});
		} else {
			res.status(400).json({
				message: "Item not found",
			});
		}
	} catch (err) {
		res.status(400).json({
			message: "Id not valid",
		});
	}
});

// delete memory
router.delete("/:id", async (req, res) => {
	try {
		const found = await Memory.findById(req.params.id);
		if (found) {
			await Memory.deleteOne({
				_id: found.id,
			});
			res.status(200).json({
				message: "Item deleted",
			});
		} else {
			res.status(400).json({
				message: "Item not found",
			});
		}
	} catch (err) {
		res.status(400).json({
			message: "Id not valid",
		});
	}
});

// Search
router.post("/search", (req, res) => {
	const searchItem = req.body.searchItem.trim();
	Memory.find({ title: new RegExp("^" + searchItem + ".*", "i") })
		.limit(4)
		.exec()
		.then((memories) => {
			res.json(memories);
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
});

module.exports = router;
