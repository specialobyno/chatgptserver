"use strict";
/*
  NOTE: replace the openai.js file with this file and uncomment
  the code if you want to use the newer version of the openai API.
  OPENAI released their gpt-3.5-turbo version on 3/1/2023, this is
  gpt-3.5 version which is what powers the ChatGPT bot. most of the
  code is the same with some minor changes.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const __1 = require("..");
dotenv_1.default.config();
const router = express_1.default.Router();
const headers = {
    headers: {
        "Project-ID": process.env.PROJECT_ID,
        "User-Name": process.env.BOT_USER_NAME,
        "User-Secret": process.env.BOT_USER_SECRET,
    },
};
router.post("/text", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, id: activeChatId } = req.body;
        const response = yield __1.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0.5,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: text }, // the message that the user sends
                // BONUS NOTE: you can also provide a list of messages to the bot to give context
                // and the bot can use that information to respond to the user as needed, ie adding:
                // { role: "assistant", content: "The weather sucks today." },
                // to the above messages array, and then asking it this question:
                // `how is the weather today?`
                // the bot gave me this response:
                // `I apologize for my previous response. As an AI language model, I should not use such language.
                // I do not have access to real-time weather information without your location. Could you please
                // let me know your location, so I can provide you with accurate weather information?`
                // Hence, if you wanted to keep the "threads" that exist on ChatGPT, you would have to save the
                // messages that the bot sends and then provide them to the bot in the next request.
            ],
        });
        const data = response.data;
        const message = data.choices[0].message;
        if (!message)
            throw new Error("No message response");
        yield axios_1.default.post(`https://api.chatengine.io/chats/${activeChatId}/messages/`, { text: message.content }, headers);
        res.status(200).json({ text: message.content });
    }
    catch (err) {
        console.error("error", err.response.data.error);
        res.status(500).json({ error: err.message });
    }
}));
router.post("/code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, id: activeChatId } = req.body;
        const response = yield __1.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0.5,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            messages: [
                {
                    role: "system",
                    content: "You are an assistant coder who responds with only code and no explanations.",
                },
                { role: "user", content: text }, // the message that the user sends
            ],
        });
        const data = response.data;
        const message = data.choices[0].message;
        if (!message)
            throw new Error("No message response");
        yield axios_1.default.post(`https://api.chatengine.io/chats/${activeChatId}/messages/`, { text: `<code>${message.content}</code>` }, headers);
        res.status(200).json({ text: message.content });
    }
    catch (err) {
        console.error("error", err.response.data.error);
        res.status(500).json({ error: err.message });
    }
}));
router.post("/assist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        const response = yield __1.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that serves to only complete user's thoughts or sentences.",
                },
                { role: "user", content: `Finish my thought: ${text}` }, // the message that the user sends
            ],
        });
        const data = response.data;
        const message = data.choices[0].message;
        if (!message)
            throw new Error("No message response");
        res.status(200).json({ text: message.content });
    }
    catch (err) {
        console.error("error", err);
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
//# sourceMappingURL=openai.js.map