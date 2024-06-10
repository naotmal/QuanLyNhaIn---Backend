const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto")
const Token = require("../models/tokenModel")
const sendEmail = require("../utils/sendEmail")

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
};


//Register user

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be up to 6 characters")
    }

    //Check if user email already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("Email has already been used")
    }




    // Create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    //Generate Token
    const token = generateToken(user._id)

    // send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    });

    if (user) {
        const { _id, name, email, photo, phone, department } = user
        res.status(201).json({
            _id, name, email, photo, phone, department, token,
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

//Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    //validate request
    if (!email || !password) {
        res.status(400)
        throw new Error("Please add email and password");
    }
    //check if user exists
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("User not found, please signup");
    }

    //user exists, check password
    const passwordIsCorrect = await bcrypt.compare(password, user.password)
    //Generate Token
    const token = generateToken(user._id)
    if (passwordIsCorrect) {
        // send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        });
    }

    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, department } = user
        res.status(200).json({
            _id, name, email, photo, phone, department, token,
        })
    } else {
        res.status(400)
        throw new Error("Invalid email or password");
    }
});

// logout user
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({ message: "Successfuly logged out" });
});

//Get user profile
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        const { _id, name, email, photo, phone, department } = user
        res.status(200).json({
            _id, name, email, photo, phone, department,
        })
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

//Get login status
const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    }
    //Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
        return res.json(true);
    }
    return res.json(false);



});
//Update user
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        const { name, email, photo, phone, department } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.photo = req.body.photo || photo;
        user.department = req.body.department || department;

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            department: updatedUser.department,

        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
});

//Update password
const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const { oldPassword, password } = req.body
    if (!user) {
        res.status(400)
        throw new Error("User not found, please signup")
    }
    //validate
    if (!oldPassword || !password) {
        res.status(400)
        throw new Error("Please add old and new password")
    }

    // Check if old password is correct
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    //Save new password
    if (user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password change succesful")
    } else {
        res.status(400)
        throw new Error("Old password is incorrect")
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404)
        throw new Error("User does not exist")
    }

    //delete token 
    let token = await Token.findOne({ userId: user._id })
    if (token) {
        await token.deleteOne()
    }
    //Create reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id
    console.log(resetToken)
    //Hash token before saving to data
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    //Save Token to db
    await new Token({
        userId: user._id,
        token: hashedToken,
        createAt: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000
    })
    //construct reset url 
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    //Reset email
    const message = `
<h2>Hello ${user.name}</h2>
<p>Please use 30 minutes link below to reset your password</p>
<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
`;
    const subject = "Password Reset Request"
    const send_to = user.email
    const sent_from = process.env.EMAIL_USER
    try {
        await sendEmail(subject, message, send_to, sent_from)
        res.status(200).json({ success: true, message: "Reset email sent" })
    } catch (error) {
        res.status(500)
        throw new Error("Email not sent, please try agian")
    }
});

//Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    const { resetToken } = req.params
    //Hash token, compare to one in data base
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // find token
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: { $gt: Date.now() }
    })
    if (!userToken) {
        res.status(404);
        throw new Error("Invalid or Expired Token")
    }
    // find user
    const user = await User.findOne({ _id: userToken.userId })
    user.password = password
    await user.save()
    res.status(200).json({
        message: "Password Reset Successful, Please login"
    });
});
module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    updatePassword,
    forgotPassword,
    resetPassword,
}