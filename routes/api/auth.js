const router = require("express").Router();
const User = require("../../models/User");
const { registerValidation, loginValidation } = require("../../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/auth");

router.post("/register", async (req, res) => {
	// Valdidate the attributes
	const { error } = await registerValidation(req.body);
	if (error) return res.status(400).json({ msg: error.details[0].message });

	// verify existence of the email
	const userExist = await User.findOne({ email: req.body.email });
	if (userExist) return res.status(400).json({ msg: "Email already exist" });

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const newUser = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});

	try {
		const savedUser = await newUser.save();
		const token = jwt.sign(
			{ id: savedUser._id },
			process.env.AUTH_TOKEN_SECRET,
			{
				expiresIn: 3600,
			}
		);
		res.status(200).send({
			token,
			user: {
				_id: savedUser.id,
				name: savedUser.name,
				email: savedUser.email,
			},
			msg: "Registred successfuly",
		});
	} catch (err) {
		res.status(500).send({ msg: "Could not register" });
	}
});

router.post("/login", async (req, res) => {
	// Valdidate the attributes
	const { error } = await loginValidation(req.body);
	if (error) return res.status(400).json({ msg: error.details[0].message });

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).json({ msg: "User doesn't exist" });

	const passwordValidation = await bcrypt.compare(
		req.body.password,
		user.password
	);

	if (!passwordValidation)
		return res.status(400).json({ msg: "Email or Password is incorrect" });

	// create token
	const token = jwt.sign({ id: user.id }, process.env.AUTH_TOKEN_SECRET, {
		expiresIn: 3600,
	});

	res.json({
		msg: "Authentification successful",
		token,
		user: {
			_id: user.id,
			name: user.name,
			email: user.email,
		},
	});
});

router.get("/auth", auth, (req, res) => {
	User.findById(req.user.id)
		.select("-password")
		.then((user) => res.json(user))
		.catch((err) => res.status(400).json({ msg: "Token invalid" }));
});

module.exports = router;
