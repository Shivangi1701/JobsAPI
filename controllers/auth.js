const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors"); // by default we eill get index.js

const register = async (req, res) => {
  const user = await User.create({ ...req.body }); // mongoose validator - spreads the content of req.body and allows User.create to create user
  const token = user.createJWT(); // created through mongoose methods present in model - User.js
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token }); // sending user name and token as the property
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePasswords(password);
  // compare password
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
