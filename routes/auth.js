const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post(
  "/signup",
  [
    check("email", "Please provide a valide email").isEmail(),
    check(
      "password",
      "Please provide a password that greater than 5 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { password, email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      res.status(400).json({
        errors: [
          {
            msg: "This user already exist",
          },
        ],
      });
      return;
    }
    let hashPwd = await bcrypt.hash(password, 10);

    users.push({
      email,
      password: hashPwd,
    });
    const token = await JWT.sign(
      {
        email,
      },
      "12dddknvoiv009*3nl/%&%€#SF",
      {
        expiresIn: 3600000,
      }
    );

    res.json({
      token,
    });
  }
);

router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  let user = users.find((user) => {
    return user.email === email;
  });
  if (!user) {
    res.status(400).json({
      errors: [
        {
          msg: "Invalid Credentials 1",
        },
      ],
    });
    return;
  }
  
  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({
      errors: [
        {
          msg: "Invalid Credentials 2",
        },
      ],
    });
    return;
  }
  const token = await JWT.sign(
    {
      email,
    },
    "12dddknvoiv009*3nl/%&%€#SF",
    {
      expiresIn: 3600000,
    }
  );

  res.json({
    token,
  });
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
