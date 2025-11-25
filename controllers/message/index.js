import User from '../../models/User.js'
import Message from '../../models/Message.js'
import cloudinary from '../../helpers/cloudnary.js'
import { io, userSocketMap } from '../../index.js'

// GET ALL USERS EXEPT THE LOGGED USER
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id
    const filtredUsers = await User.find({ _id: { $ne: userId } }).select(
      '-password',
    )

    // COUNT NUMBERS OF MESSAGES NOT SEEN
    const unseenMessages = {}
    const promises = filtredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      })
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length
      }
    })

    await Promise.all(promises)
    res.status(200).json({ success: true, users: filtredUsers, unseenMessages })
  } catch (error) {
    console.log(`ERRO AO BUSCAR USUÁRIOS: ${error.message}`)
    return res
      .status(500)
      .json({ success: false, message: `Erro ao buscar usuários.` })
  }
}

// GET ALL MESSAGES FOR SELECTED USER
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params
    const myId = req.user._id

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: selectedUserId,
        },
        {
          senderId: selectedUserId,
          receiverId: myId,
        },
      ],
    })

    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
      },
      {
        seen: true,
      },
    )

    res.status(200).json({
      success: true,
      messages,
    })
  } catch (error) {
    console.log(`ERRO AO BUSCAR MENSAGENS: ${error.message}`)
    return res
      .status(500)
      .json({ success: false, message: `Erro ao buscar mensagens.` })
  }
}

// MARK TO MESSAGE AS SEEN USING MESSAGE ID
export const markAsSeen = async (req, res) => {
  try {
    const { id } = req.params
    await Message.findByIdAndUpdate(id, { seen: true })
    res
      .status(200)
      .json({ success: true, message: `Mensagem marcada como vista.` })
  } catch (error) {
    console.log(`ERRO AO MARCAR MENSAGEM COMO VISTA: ${error.message}`)
    return res
      .status(500)
      .json({ success: false, message: `Erro ao marcar mensagem como vista.` })
  }
}

// SEND MESSAGE TO SELECTED USER
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    let imageUrl = null
    if (image) {
      const upload = await cloudinary.uploader.upload(image)
      imageUrl = upload.secure_url
    }

    const newMessage = await Message.create({
      text,
      image: imageUrl,
      senderId,
      receiverId,
    })

    // EMIT THE NEW MESSAGE TO THE RECEIVER'S SOCKET
    const receiverSocketId = userSocketMap[receiverId]
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    return res.status(201).json({
      success: true,
      newMessage,
    })
  } catch (error) {
    console.log(`ERRO AO ENVIAR MENSAGEM: ${error.message}`)
    return res
      .status(500)
      .json({ success: false, message: `Erro ao enviar mensagem.` })
  }
}
