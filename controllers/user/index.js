import cloudinary from '../../helpers/cloudnary.js'
import { generateToken } from '../../helpers/utils.js'
import User from '../../models/User.js'
import bcrypt from 'bcryptjs'

// CREATE A NEW USER
export const createNewUser = async (req, res) => {
  const { email, name, password, bio } = req.body

  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Todos os campos são obrigatórios!' })
  }

  try {
    const user = await User.findOne({ email })
    if (user)
      return res
        .status(409)
        .json({ success: false, message: 'Usuário já existe!' })

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      bio,
    })

    const token = generateToken(newUser._id)

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
      },
    })
  } catch (error) {
    console.log(`ERRO AO CRIAR O USUÁRIO: ${error.message}`)
    return res
      .status(500)
      .json({ success: false, message: `Erro ao criar o usuário` })
  }
}

// USER LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Os campos email e senha são obrigatórios!',
    })
  }

  try {
    const user = await User.findOne({ email })
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'Email ou senha inválidos' })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, message: 'Email ou senha inválidos' })

    const token = generateToken(user._id)

    return res.status(200).json({
      success: true,
      message: 'Usuário autenticado com sucesso!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
      },
    })
  } catch (error) {
    console.log(`ERRO AO AUTENTICAR USUÁRIO: ${error.message}`)
    return res
      .status(500)
      .json({ success: false, message: `Erro ao autenticar usuário` })
  }
}

// CONTROLLER TO CHECK IF USER IS AUTHENTICATED
export const checkAuth = async (req, res) => {
  res.status(200).json({ success: true, message: 'Ativo', user: req.user })
}

// CONTROLLER TO UPTATE USER PROFILE
export const updateProfile = async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ success: false, message: 'Erro na requisição!' })
  }

  try {
    const { avatar, name, bio } = req.body
    const user = await User.findById(req.user._id)

    if (!avatar) {
      await user.updateOne({ name, bio }, { new: true })
    } else {
      const upload = await cloudinary.uploader.upload(avatar)
      await user.updateOne(
        { name, bio, avatar: upload.secure_url },
        { new: true },
      )
    }
  } catch (error) {
    console.log(`ERRO AO ATUALIZAR PERFIL: ${error.message}`)
    return res
      .status(500)
      .json({ success: false, message: `Erro ao atualizar perfil.` })
  }
}
