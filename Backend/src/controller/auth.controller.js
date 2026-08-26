
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const config = require("../config/config.js")
const cookieParser  = require("cookie-parser")

async function signUp(req, res) {
    
        const {
            name,
            email,
            college,
            year,
            branch,
            semester,
            preferredLanguage,
            password
        } = req.body;
        if (
            !name ||
            !email ||
            !college ||
            !year ||
            !branch ||
            !semester ||
            !preferredLanguage ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

      
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
       const newUser =  await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            year,
            branch,
            semester,
            preferredLanguage
        });
        
        const accessToken = jwt.sign(
        {
            user_id:id
        },config.JWT_SECRET,
        {
            expiresIn:"15m",
        })

        const refreshToken = jwt.sign(
            {
                user_id:id
            },config.JWT_SECRET,
            {
                expiresIn:"7d",
            }
        )

    res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"strict",
    maxAge:7*24*60*60*1000
    } );

        return res.status(201).json({
        message:"User saved successfully",
        accessToken,
        newUser
        });

}

async function login(req,res){
    const {email,password} = req.query;
    
    const User  = User.findOne({email:email});
    if(!User){
        return res.json({
            status:404,
            success:false,
            message:"User not found"

        })
    }

    const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
     );

     if(!isPasswordCorrect){
        return res.status(400).json({
            success:false,
            message:"Wrong Password"
        })
     }

    const accessToken = jwt.sign(
        {
            user_id:id
        },config.JWT_SECRET,
        {
            expiresIn:"15m",
        })

        const refreshToken = jwt.sign(
            {
                user_id:id
            },config.JWT_SECRET,
            {
                expiresIn:"7d",
            }
        )

    res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"strict",
    maxAge:7*24*60*60*1000
    } );



     res.status(200).json({
        success:true,
        accessToken,
        User
     })

}


async function refreshToken(req,res){
    const token = req.cookie.refreshToken
    if(!token){
        return res.status(404).json({
            success:false,
            message:"Invalid token"
        })
    }

    const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
    );

    

    if(!decoded){
        return res.status(400).json({
            success:false,
            message:"Invalid Token"
        })
    }

    const id = decoded.id

    const accessToken = jwt.sign(
        {
            user_id:id
        },config.JWT_SECRET,
        {
            expiresIn:"15m",
        })

        const refreshToken = jwt.sign(
            {
                user_id:id
            },config.JWT_SECRET,
            {
                expiresIn:"7d",
            }
        )

    res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"strict",
    maxAge:7*24*60*60*1000
    } );



     res.status(200).json({
        success:true,
        accessToken,
        User
     })


}




module.exports = { signUp , login,refreshToken};