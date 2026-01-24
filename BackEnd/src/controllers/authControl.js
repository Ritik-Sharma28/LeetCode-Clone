import { validate } from "../utils/validate.js";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {

        validate(req.body)
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)
        req.body.role = "user"


        const user = await User.create(req.body)

        const token = jwt.sign({ emailId, _id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 })

        res.status(201).send("user register successfully")
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        validate(req.body)
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId })

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials")

        const token = jwt.sign({ emailId, _id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 })

        res.status(200).send("Login successful")
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) })

        res.status(200).send("Logout successful")
    } catch (error) {
        console.log(error)
    }
}