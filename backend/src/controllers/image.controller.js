import OpenAI from "openai";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";

dotenv.config();

const getOpenAIClient = () => {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const openai = getOpenAIClient();
        if (!openai) {
            return res.status(503).json({ message: "AI Image Generation is currently unavailable (Missing API Key)" });
        }

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;

        // Optional: Upload to Cloudinary to have a persistent version
        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
            folder: "generated_images",
        });

        res.status(200).json({ imageUrl: uploadResponse.secure_url });
    } catch (error) {
        console.error("Error in generateImage controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
