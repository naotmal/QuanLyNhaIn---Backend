const express = require("express");
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, updatePassword, forgotPassword, resetPassword, deleteUser, getUsers, upgradeUser } = require("../controllers/userController");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware")


router.post("/register", registerUser)
router.post("/", loginUser)
router.get("/logout", logout)
router.get("/getuser", protect, getUser)
router.get("/getusers", protect, adminOnly, getUsers)
router.post("/upgradeuser", protect, adminOnly, upgradeUser)
router.get("/loggedin", loginStatus)
router.patch("/updateuser", protect, updateUser)
router.delete("/:id", protect, adminOnly, deleteUser)
router.patch("/updatepassword", protect, updatePassword)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resetToken", resetPassword)

module.exports = router