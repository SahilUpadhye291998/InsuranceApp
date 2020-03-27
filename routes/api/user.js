const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../../secert/keys").jwtSecret;
const checkAuth = require("../../validation/checkAuth");

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
router.get("/get/:id", checkAuth, (req, res) => {
  User.findOne({ securityKey: req.params.id })
    .then(user => res.json(user))
    .catch(err => {
      console.log(err);
      res.status(500).json("{message: No record found}");
    });
});

//@route    POST api/user/signup
//@desc     To register the user
//@access   PUBLIC
router.post("/signup", (req, res) => {
  console.log(req.body);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    securityKey: req.body.securityKey
  });

  newUser
    .save()
    .then(user =>
      res.status(200).json({
        message: "User Registered Successfully",
        user: user._id
      })
    )
    .catch(error => {
      console.error(error);
    });
});

//@route    POST api/user/login
//@desc     To login the user
//@access   PUBLIC
router.post("/login", (req, res) => {
  console.log(req.body);

  User.findOne({
    name: req.body.name,
    securityKey: req.body.securityKey
  })
    .then(user => {
      const token = jwt.sign(
        {
          data: user
        },
        jwtSecret,
        { expriresIn: "1h" }
      );
      return res.status(200).json({
        message: "Record found",
        token: token
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("{message: No record found}");
    });
});

//@route    GET api/user/get
//@desc     To upload the claim
//@access   PUBLIC
router.post(
  "/upload/:id",
  claims.single("claimImage"),
  checkAuth,
  (req, res, next) => {
    const claim = {
      claimDesc: req.body.claimDesc,
      claimImagePath:
        "/home/xgod666/Documents/practise/projects/InsuranceApp/assets/upload/" +
        req.params.id +
        ".png",
      claimDate: Date.now
    };

    User.findOne({ securityKey: req.params.id })
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
        res.status(500).json("{message: No user found}");
      });
  }
);

module.exports = router;
