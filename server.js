const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const fs = require("fs");
const routes = require("./routes");
const path = require("path");
const ejs = require("ejs");

const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })
);

app.set("views", path.join(__dirname, "/pages"));
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

app.get("*", async (req, res) => {
  fs.readdir("./pages", async (err, files) => {
    if (err) res.status(404).json({ message: "Error: " + err });
    if (
      files.some(
        (file) =>
          file.endsWith(".ejs") &&
          (req.originalUrl !== "/"
            ? req.originalUrl.replace("/", "") + ".ejs" === file
            : "index.ejs" === file)
      )
    ) {
      res.render(
        req.originalUrl !== "/"
          ? req.originalUrl.replace("/", "") + ".ejs"
          : "index.ejs"
      );
    } else {
      return res.json({ message: "404 not found" });
    }
  });
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server active | port: ", PORT);
});
