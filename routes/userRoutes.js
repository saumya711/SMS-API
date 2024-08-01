const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, getStudentList, deleteUser } = require("../controllers/userController");
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken");
const router = express();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUserProfile);
router.put("/profile", verifyIsLoggedIn, updateUserProfile);

// admin routes
router.get("/", verifyIsLoggedIn, verifyIsAdmin, getStudentList);
router.delete("/:id", verifyIsLoggedIn, verifyIsAdmin, deleteUser);

module.exports = router;