import express from "express"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()
const router = express.Router()
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    console.log(username)
    const chatEngineResponse = await axios.get(`https://api.chatengine.io/users/me`, {
      headers: {
        "Project-ID": process.env.PROJECT_ID!,
        "User-Name": username,
        "User-Secret": password,
      },
    })
    console.log(chatEngineResponse.data)
    res.status(200).json({ response: chatEngineResponse.data })
  } catch (err: any) {
    console.error("error", err.message)
    res.status(500).json({ error: err.message })
  }
})
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body
    const chatEngineResponse = await axios.post(
      `https://api.chatengine.io/users`,
      {
        username: username,
        secret: password,
      },
      {
        headers: { "Private-Key": process.env.PRIVATE_KEY! },
      }
    ) 
    res.status(200).json({ response: chatEngineResponse.data })
  } catch (err: any) {
    console.error("error", err)
    res.status(500).json({ error: err.message })
  }
})
export default router
