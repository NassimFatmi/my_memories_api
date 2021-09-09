const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

const Memory = require("../../models/Memory");

// Get all Memorys
router.get("/", async (req, res) => {
	try {
		const memories = await Memory.find({});
		res.status(200).json(memories);
	} catch (err) {
		res.status(500).json({
			msg: "An error was happend, cannot get data",
		});
	}
});

// create new Memorie
router.post("/", auth, (req, res) => {
	if (!req.body.title || !req.body.body) {
		res.status(400).json({
			msg: "title and body are required parameters",
		});
	} else {
		const memory = new Memory({
			title: req.body.title,
			body: req.body.title,
			userId: req.user.id,
		});
		memory
			.save()
			.then(() => {
				res.status(200).json({
					memory: memory,
					msg: "Item saved successfully",
				});
			})
			.catch((err) => {
				res.status(500).json({
					msg: "Cannot save data due to server error",
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
				msg: "Item not found",
			});
		}
	} catch (err) {
		res.status(400).json({
			msg: "Id unvalid",
		});
	}
});

// update a memory
router.put("/:id", auth, async (req, res) => {
	try {
		const found = await Memory.findById(req.params.id);
		if (found) {
			if (found.userId === req.user.id) {
				const updatedItem = await Memory.updateOne(
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
				return res.status(200).json({
					msg: "item updated",
				});
			} else {
				return res.status(401).json({
					msg: "can't update other users memories",
				});
			}
		} else {
			return res.status(400).json({
				msg: "Item not found",
			});
		}
	} catch (err) {
		return res.status(400).json({
			msg: "Id not valid",
		});
	}
});

// delete memory
router.delete("/:id", auth, async (req, res) => {
	try {
		const found = await Memory.findById(req.params.id);
		if (found) {
			if (found.userId === req.user.id) {
				await Memory.deleteOne({
					_id: found.id,
				});
				return res.status(200).json({
					msg: "Item deleted",
				});
			} else {
				return res.status(401).json({
					msg: "can't delete other users memories",
				});
			}
		} else {
			return res.status(400).json({
				msg: "Item not found",
			});
		}
	} catch (err) {
		res.status(400).json({
			msg: "Id not valid",
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
				msg: err.message,
			});
		});
});

module.exports = router;
