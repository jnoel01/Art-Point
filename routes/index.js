const mainRoutes = require("./mainRoutes");
const artItemRoutes = require("./artItemRoutes");
const constructorMethod = (app) => {
  app.use("/", mainRoutes);
  app.use("/item", artItemRoutes);
  app.use("*", (req, res) => {
    res.render("../views/pages/error");
  });
};

module.exports = constructorMethod;
