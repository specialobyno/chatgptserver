import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import { Configuration, OpenAIApi } from 'openai';
import openaiRoutes from './routes/openai'
import authRoutes from './routes/auth'
dotenv.config()

const app = express();
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors())

// OPENAI CONFIGURATION 

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);


// ROUTES SECTION 

app.use('/openai', openaiRoutes)
app.use('/auth', authRoutes)
app.get('/', (req, res) => res.send("I GOT YOUR PING PONG"))
// SERVER SETUP
const PORT = process.env.PORT || 9000
app.listen(PORT, ()=> {
    console.log(`🟢🟢🟢... App listening on http://localhost:${PORT}`)
})