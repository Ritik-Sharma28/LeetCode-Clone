import { validate } from "../utils/validate.js";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {redisClient} from "../config/redis.js"


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
    } catch (err) {
        res.status(400).send("Error: "+err);
    }
}

export const login = async (req, res) => {
    try {
        // validate(req.body)
       
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(400).send("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials")

        const token = jwt.sign({ emailId, _id: user._id , role: user.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 })

        res.status(200).send("Login successful")
    } catch (err) {
        res.status(401).send("Error: "+err);
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token
        const payload = jwt.decode(token)
        
        await redisClient.expireAt(`token:${token}`,payload.exp);
        await redisClient.set(`token:${token}` , "blocked" )

        res.status(200).send("Logout successful")
    } catch (err) {
        res.status(503).send("Error: "+err);
    }
}

export const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}

export const adminRegister = async (req, res) => {
    try {
        if( req.result.role !== "admin")
            throw new Error("Invalid Credentials")
        console.log(req.body)
        validate(req.body)
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)

        const user = await User.create(req.body)

        // const token = jwt.sign({ emailId, _id: user._id , role: user.role}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
        // res.cookie("token", token, { maxAge: 60 * 60 * 1000 })

        res.status(201).send("user register successfully")
    } catch (error) {
        res.status(400).send("Error: "+ error);
    }
}