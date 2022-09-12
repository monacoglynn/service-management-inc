import jwt from "jsonwebtoken";

const signToken = ({ username, email, _id }) =>{
    const payload = { username, email, _id }
    return jwt.sign({data:payload},process.env.JWT_SECRET, { expiresIn: '10h' })
}

export default signToken