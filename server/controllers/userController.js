import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import signToken from "../util/signToken.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Auth User and provide token / LOGIN
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // validate info
    if (user && (await user.isCorrectPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: signToken({
                username: user.name,
                email: user.email,
                _id: user._id,
            }),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    ADD new Auth User and provide token
// @route   POST /api/users
// @access  Public
const addUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User Already Exist");
    }

    //register new User if not
    const user = await User.create({ name, email, password });
    // login token
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: signToken({
                username: user.name,
                email: user.email,
                _id: user._id,
            }),
        });
    } else {
        res.status(4000);
        throw new Error("invalid user data");
    }
});

// @desc    get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    // console.log(user)
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("No User Found");
    }
});



// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    // find user
    const user = await User.findById(req.params.id);

    if (user) {
        // found user, then delete
        await user.remove();
        res.json({ message: `User ${user.name}  is removed` });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    // found user
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: signToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    authUser,
    getUserProfile,
    addUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
