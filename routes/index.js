const mainRoutes = require("./mainRoutes");
const artItemRoutes = require("./artItemRoutes");
const constructorMethod = (app) => {
  app.use("/", mainRoutes);
  app.use("/item", artItemRoutes);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
