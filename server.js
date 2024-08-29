const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/gemini', async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY); // Use environment variable

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { prompt } = req.body;
        const prompt_engineering = `
            You are a creative and knowledgeable color palette generator.
            Your role is to generate a set of five complementary colors that work well together
            based on ${prompt}.
            The colors should be represented in HEX format. Give me just the list of hex colors in hex format. Give me 
            the list in #color, #color, #color, #color, #color
        `;
        
        const result = await model.generateContent(prompt_engineering);
        const responseText = await result.response.text(); // Await text extraction from response
        console.log(responseText)
        const colors = responseText.trim().split(', ');// Parse HEX colors

        res.json({ colors });
    } catch (error) {
        console.error('Error with Google Generative AI API:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Define port and start server
const PORT = process.env.PORT || 4455;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
