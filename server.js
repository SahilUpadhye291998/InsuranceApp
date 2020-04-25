require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//import user routes
const user = require("./routes/api/user");
const company = require("./routes/api/company");

const app = express();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//connect to database
const db = process.env.MONGODB_URI || require("./secert/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connection Successful`);
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.set("useFindAndModify", false);

const PORT = process.env.PORT || 3000;

app.use("/api/user", user);
app.use("/api/company", company);

app.listen(PORT, (req, res, next) => {
  console.log(`Server started at port ${PORT}`);
});

