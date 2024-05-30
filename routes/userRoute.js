const express = require("express");
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, updatePassword, forgotPassword, resetPassword } = require("../controllers/userController");
const router = express.Router();
const protect = require("../middleware/authMiddleware")


router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/getuser", protect, getUser)
router.get("/loggedin", loginStatus)
router.patch("/updateuser",protect, updateUser)
router.patch("/updatepassword",protect, updatePassword)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resetToken", resetPassword)

module.exports = router