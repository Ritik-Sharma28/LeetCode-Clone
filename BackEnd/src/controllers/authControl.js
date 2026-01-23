import { validate } from "../utils/validate";
import User from "../models/user";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req , res) => {
    try {

        validate(req.body)
        const {name , emailId  , password} = req.body;

        req.body.password = await bcrypt.hash(password , 10)

        await User.create(req.body)

        const token = jwt.sign({emailId} , process.env.JWT_SECRET , {expiresIn : 60*60*24})
        res.cookie("token" , token , {maxAge : 60*60*1000})

        res.status(201).send("user register successfully")
    } catch (error) {
        console.log(error)
    }
}