import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { createAccessToken } from "../libs/jwt.js";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
    const {email, password, username} = req.body
    
   try {

    const userFound = await User.findOne({ email });
    if (userFound)
        return res.status(400).json( ["The email is already in use"] );

    const passwordHash = await bcrypt.hash(password, 10) //hash

    const newUser = new User({
        username,
        firstName,
        email,
        password: passwordHash,
        roles: 'Administrador',
    })
    
    const userSaved = await newUser.save();
    const token = await createAccessToken({id: userSaved._id});
    res.cookie("token", token);
    res.json({
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        createdAt: userSaved.createdAt,
        updateAt: userSaved.updatedAt,
    });
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = await createAccessToken({ 
            id: userFound._id, 
            roles: userFound.roles // Incluye los roles en el token
        });

        res.cookie("token", token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updateAt: userFound.updatedAt,
            roles: userFound.roles // Puedes incluir los roles en la respuesta también
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)

    if (!userFound) return res.status(400).json({ message: "User not found"});
    return res.json({
        id: userFound._id,
        username: userFound.username,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updateAt: userFound.updateAt,
    });
    // res.send('profile');
};

export const verifyToken = async (req, res) => {
    const {token} = req.cookies

    if (!token) return res.status(401).json({ message: "No autorizado"});

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "No autorizado"});
        
        const userFound = await User.findById(user.id)
        if (!userFound) res.status(401).json({ message: "No autorizado"});

        return res.json({
            id: userFound._id,
            username: userFound.username,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
            roles: userFound.roles,
        })
    })
}