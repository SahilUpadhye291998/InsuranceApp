const express = require("express");
const mongoose = require("mongoose");

//import user routes
const user = require("./routes/api/user");

const app = express();
app.use(express.json());

//connect to database
const db = require("./secert/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`Connection Successful`);
  })
  .catch(err => {
    console.log(err);
  });

mongoose.set("useFindAndModify", false);

const PORT = process.env.PORT || 3000;

app.use("/api/user", user);

app.listen(PORT, (req, res, next) => {
  console.log(`Server started at port ${PORT}`);
});
