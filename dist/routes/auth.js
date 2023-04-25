"use strict";
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
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log(username);
        const chatEngineResponse = yield axios_1.default.get(`https://api.chatengine.io/users/me`, {
            headers: {
                "Project-ID": process.env.PROJECT_ID,
                "User-Name": username,
                "User-Secret": password,
            },
        });
        console.log(chatEngineResponse.data);
        res.status(200).json({ response: chatEngineResponse.data });
    }
    catch (err) {
        console.error("error", err.message);
        res.status(500).json({ error: err.message });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const chatEngineResponse = yield axios_1.default.post(`https://api.chatengine.io/users`, {
            username: username,
            secret: password,
        }, {
            headers: { "Private-Key": process.env.PRIVATE_KEY },
        });
        res.status(200).json({ response: chatEngineResponse.data });
    }
    catch (err) {
        console.error("error", err);
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map