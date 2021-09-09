const jwt = require("jsonwebtoken");

function auth(req, res, next) {
	const token = req.header("auth-token");

	if (!token)
		return res.status(401).json({ msg: "No token, authorization denied" });

	try {
		const decoded = jwt.verify(
			req.header("auth-token"),
			process.env.AUTH_TOKEN_SECRET
		);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(400).json({
			msg: "Token not valid",
		});
	}
}

module.exports = auth;
