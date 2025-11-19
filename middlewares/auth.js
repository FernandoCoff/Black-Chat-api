import User from "../models/User"
import jwt from  "jsonwebtoken"

// MIDDLEWARE TO PROTECTED ROUTES
export const protectRoute = async (req, res, next) => {
  const token = req.headers.token

  if(!token)return res.status(401).json({succes: false, message: 'Não autorizado!'})

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if(!user) return res.status(401).json({success: false, message: 'Não autorizado!'})

    req.user = user
    next()
  }catch(error){
    console.log(`ERRO AO AUTENTICAR USUÁRIO: ${error.message}`)
    return res.status(500).json({ success: false, message : `Erro ao autenticar usuário`})
  }
}

