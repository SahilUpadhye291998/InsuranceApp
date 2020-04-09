const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../../secert/keys").jwtSecret;
const checkAuth = require("../../validation/checkAuth");

const User = require("../../model/User");
const Company = require("../../model/Company");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./assets/upload/");
  },
  filename: (req, file, callBack) => {
    callBack(null, req.params.id + ".png");
  },
});

const claims = multer({ storage: storage });

//@route    GET api/user/getAll
//@desc     To get the user
//@access   PUBLIC
router.get("/getAll", (req, res) => {
  User.find()
    .sort({ date: -1 })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

//@route    GET api/user/get/:id
//@desc     To get the user
//@access   PUBLIC
router.get("/get/:id", checkAuth, (req, res) => {
  console.log(req.body);
  User.findOne({ _id: req.params.id })
    .then((user) => res.json(user))
    .catch((err) => {
      console.log(err);
      res.status(500).json("{message: No record found}");
    });
});

//@route    GET api/user/get/:id
//@desc     To get the user
//@access   PUBLIC
router.post("/payInsurance", checkAuth, (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const compName = req.body.compName;
  const premiumAmount = req.body.premiumAmount;
  User.findOne({ _id: id })
    .then((user) => {
      user.paidAmount = user.paidAmount + parseInt(premiumAmount);
      User.findByIdAndUpdate({ _id: user._id }, user)
        .then(() => console.log("User Updated Successfully"))
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            message: "Some error has occured please contact web master",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("{message: No record found}");
    });

  Company.findOne({
    name: compName,
  }).then((company) => {
    company.amountWithCompany =
      company.amountWithCompany + parseInt(premiumAmount);

    Company.findByIdAndUpdate({ _id: company._id }, company)
      .then((company) => {
        console.log("Company Updated Successfully");
        res.status(200).json({
          message: "Update Successful",
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({
          message: "Some error has occured please contact web master",
        });
      });
  });
});

router.post("/updateInsuranceAmount", checkAuth, (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const amount = req.body.amount;
  User.findOne({ _id: id })
    .then((user) => {
      user.amount = parseInt(amount);
      User.findByIdAndUpdate({ _id: user._id }, user)
        .then(() => {
          console.log("User Updated Successfully");
          res.status(200).json({
            message: "User Policy is Updated Successfully",
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            message: "Some error has occured please contact web master",
          });
        });
    })
    .catch((err) => {
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
    securityKey: req.body.securityKey,
    amount: 0,
  });

  newUser
    .save()
    .then((user) =>
      res.status(200).json({
        message: "User Registered Successfully",
        user: user._id,
      })
    )
    .catch((error) => {
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
    securityKey: req.body.securityKey,
  })
    .then((user) => {
      const token = jwt.sign(
        {
          data: user,
        },
        jwtSecret,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        message: "Record found",
        token: token,
        id: user._id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "No record found" });
    });
});

//@route    POST api/user/get
//@desc     To upload the claim
//@access   PUBLIC
router.post(
  "/upload/:id",
  claims.single("claimImage"),
  checkAuth,
  (req, res, next) => {
    const newString = req.params.id + "_" + Date.now;
    const claim = {
      claimDesc: req.body.claimDesc,
      claimImagePath: __dirname + "/assets/upload/" + newString + ".png",
      claimDate: Date.now,
    };

    User.findOne({ _id: req.params.id })
      .then((user) => {
        user.claims.push(claim);
        console.log(user);
        User.findByIdAndUpdate(user._id, user)
          .then(() => res.json({ message: " Claim Added Successfully " }))
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "No user found" });
      });
  }
);

module.exports = router;
