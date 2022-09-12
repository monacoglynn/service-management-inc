import jwt from 'jsonwebtoken'
import {User} from '../models/index.js'
import expressAsyncHandler from 'express-async-handler'
const protect = expressAsyncHandler (async (req,res,next) =>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        // console.log('totken found')
        try {
            // get token and decode it
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            // console.log(decoded)

            // fetch user
            req.user = await User.findById(decoded.data._id).select('-password')

            next()

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('no Auth')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('not authorized no token')
    }
    
})
const verifiedAdmin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error('This area for Admin only!!!!')
    }
}
export {protect,verifiedAdmin}