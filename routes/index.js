const mainRoutes = require("./mainRoutes");
const artItemRoutes = require("./artItemRoutes");
const artSubmissionRoutes = require("./artSubmissionRoutes");
const constructorMethod = (app) => {
	app.use("/", mainRoutes);
	app.use("/item", artItemRoutes);
	app.use("/submit", artSubmissionRoutes);
	app.use("*", (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;
