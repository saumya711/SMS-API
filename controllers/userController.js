const User = require("../models/userModel");
const generateAuthToken = require("../utils/generateAuthToken");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");

const registerUser = async (req, res) => {
    try {
      const { firstName, lastName, email, regNumber, password, phoneNumber, address } = req.body;
      if (!(firstName && lastName && email && regNumber && password)) {
        return res.status(400).json({ error: "All inputs are required" });
      }
      const hashedPassword = hashPassword(password);
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        const user = await User.create({
          firstName,
          lastName,
          email: email.toLowerCase(),
          regNumber,
          password: hashedPassword,
          enrolledSubjects: [],
          phoneNumber,
          address
        });
        res
          .cookie(
            "access_token",
            generateAuthToken(
              user._id,
              user.firstName,
              user.lastName,
              user.email,
              user.isAdmin
            ),
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            }
          )
          .status(201)
          .json({
            success: "User Created",
            userCreated: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              regNumber: user.regNumber,
              isAdmin: user.isAdmin,
              enrolledSubjects: user.enrolledSubjects,
              phoneNumber: user.phoneNumber,
              address: user.address,
            },
          });
      }
    } catch (err) {
      res.status(400).json({
        err: err.message
      });
    }
  };


  const loginUser = async (req, res) => {
    try {
      const { email, password, doNotLogout } = req.body;
      if (!(email && password)) {
        return res.status(400).send("All inputs are required");
      }
  
      const user = await User.findOne({ email }).orFail();
  
      if (user && comparePasswords(password, user.password)) {
        let cookieParams = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        };
  
        if (doNotLogout) {
          cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 };
        }
  
        return res
          .cookie(
            "access_token",
            generateAuthToken(
              user._id,
              user.firstName,
              user.lastName,
              user.email,
              user.isAdmin
            ),
            cookieParams
          )
          .json({ // just pass the access_token as response  to as an alternative for access_token isue
            access_token:generateAuthToken(
              user._id,
              user.firstName,
              user.lastName,
              user.email,
              user.isAdmin
            ),
            success: "User Logged in",
            userLoggedIn: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              isAdmin: user.isAdmin,
              email: user.email,
              regNumber: user.regNumber,
              phoneNumber: user.phoneNumber,
              address: user.address,
              doNotLogout,
            },
          });
      } else {
        return res.status(401).send("Wrong Credentials");
      }
    } catch (err) {
      res.status(400).json({
        err: err.message
      });
    }
  };

  const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).orFail();
      return res.send(user);
    } catch (err) {
      res.status(400).json({
        err: err.message
      });
    }
  };

  const updateUserProfile = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).orFail();
  
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.regNumber = req.body.regNumber || user.regNumber;
  
      if (req.body.phoneNumber !== undefined) {
        user.phoneNumber = req.body.phoneNumber;
      }
      if (req.body.address !== undefined) {
        user.address = req.body.address;
      }
      if (req.body.enrolledSubjects !== undefined) {
        user.enrolledSubjects = req.body.enrolledSubjects;
      }
  
      if (req.body.password && req.body.password !== user.password) {
        user.password = hashPassword(req.body.password);
      }
  
      await user.save();
  
      res.json({
        success: "User Updated",
        userUpdated: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          regNumber: user.regNumber,
          phoneNumber: user.phoneNumber,
          address: user.address,
          enrolledSubjects: user.enrolledSubjects,
        },
      });
    } catch (err) {
      res.status(400).json({
        err: err.message
      });
    }
  };


  const getStudentList = async (req, res) => {
    try {
      const users = await User.find({isAdmin: false});
      return res.json(users);
    } catch (err) {
      res.status(400).json({
        err: err.message
      });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id).orFail();
      res.send("User Removed")
    } catch (err) {
      res.status(400).json({
        err: err.message
      });
    }
  };

  module.exports = {
    registerUser, loginUser, getUserProfile, updateUserProfile, getStudentList, deleteUser
  };