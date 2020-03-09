const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validation/AESEncryptionAndDecryption");

const User = require("../../model/User");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./assets/upload/");
  },
  filename: (req, file, callBack) => {
    callBack(null, req.params.id + ".png");
  }
});

const claims = multer({ storage: storage });

//@route    GET api/user/getAll
//@desc     To get the user
//@access   PUBLIC
router.get("/getAll", (req, res) => {
  User.find()
    .sort({ date: -1 })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

//@route    GET api/user/get/:id
//@desc     To get the user
//@access   PUBLIC
router.get("/get/:id", (req, res) => {
  User.findOne({ securityKey: validate.encryptMethod(req.params.id) })
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

//@route    POST api/user/get
//@desc     To register the user
//@access   PUBLIC
router.post("/insert", (req, res) => {
  console.log(req.body);
  const newUser = new User({
    name: validate.encryptMethod(req.body.name),
    email: validate.encryptMethod(req.body.email),
    securityKey: validate.encryptMethod(req.body.securityKey)
  });

  newUser
    .save()
    .then(user => res.json(user))
    .catch(error => {
      console.error(error);
    });
});

//@route    GET api/user/get
//@desc     To register the user
//@access   PUBLIC
router.post("/upload/:id", claims.single("claimImage"), (req, res, next) => {
  const claim = {
    claimDesc: validate.encryptMethod(req.body.claimDesc),
    claimImagePath:
      "/home/xgod666/Documents/practise/projects/InsuranceApp/assets/upload/" +
      validate.encryptMethod(req.params.id) +
      ".png",
    claimDate: Date.now
  };

  User.findOne({ securityKey: validate.encryptMethod(req.params.id) })
    .then(user => {
      user.claims.push(claim);
      console.log(user);
      User.findByIdAndUpdate(user._id, user)
        .then(() => res.json("{ message: Claim Added Successfully }"))
        .catch(error => {
          console.error(error);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
