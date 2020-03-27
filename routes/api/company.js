const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../../secert/keys").jwtSecret;
const checkAuth = require("../../validation/checkAuth");
const Company = require("../../model/Company");

//@route    GET api/company/getAll
//@desc     To get the company
//@access   PUBLIC
router.get("/getAll", (req, res) => {
  Company.find()
    .sort({ date: -1 })
    .then(company => res.json(company))
    .catch(err => res.json(err));
});

//@route    GET api/company/get/:id
//@desc     To get the company
//@access   PUBLIC
router.get("/get/:id", checkAuth, (req, res) => {
  Company.findOne({ securityKey: req.params.id })
    .then(company => res.json(company))
    .catch(err => {
      console.log(err);
      res.status(500).json("{message: No record found}");
    });
});

//@route    POST api/company/signup
//@desc     To register the company
//@access   PUBLIC
router.post("/signup", (req, res) => {
  console.log(req.body);
  const newCompany = new Company({
    name: req.body.name,
    email: req.body.email,
    securityKey: req.body.securityKey
  });

  newCompany
    .save()
    .then(company =>
      res.status(200).json({
        message: "Company Registered Successfully",
        company: company._id
      })
    )
    .catch(error => {
      console.error(error);
    });
});

//@route    POST api/company/login
//@desc     To login the company
//@access   PUBLIC
router.post("/login", (req, res) => {
  console.log(req.body);

  Company.findOne({
    name: req.body.name,
    securityKey: req.body.securityKey
  })
    .then(company => {
      const token = jwt.sign(
        {
          data: company
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

//@route    POST api/company/get
//@desc     To upload the claim
//@access   PUBLIC
router.post(
  "/upload/:id",
  claims.single("claimImage"),
  checkAuth,
  (req, res) => {
    const updatedCompanyInfo = {
      name: req.body.name,
      email: req.body.email,
      securityKey: req.body.securityKey
    };

    Company.findOne({ securityKey: req.params.id })
      .then(company => {
        Company.findByIdAndUpdate(company._id, updatedCompanyInfo)
          .then(() => res.json("{ message: Claim Added Successfully }"))
          .catch(error => {
            console.error(error);
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json("{message: No company found}");
      });
  }
);

module.exports = router;
