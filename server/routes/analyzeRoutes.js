const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { Storage } = require('megajs');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/resume', upload.single('resume'), async (req, res) => {
    try {
        let rawText;

        if (req.file) {
            // 1. Parse PDF Text securely using Buffer memory
            const data = await pdfParse(req.file.buffer);
            rawText = data.text;

            // 2. Backup CV to Mega.nz asynchronously
            const email = process.env.MEGA_EMAIL;
            const password = process.env.MEGA_PASSWORD;
            if (email && password) {
                // Run without blocking response via IIFE
                (async () => {
                    try {
                        const storage = await new Storage({ email, password }).ready;
                        
                        let rootFolder = storage.root.children.find(f => f.name === 'AiMentor_Resumes');
                        if (!rootFolder) rootFolder = await storage.mkdir('AiMentor_Resumes');
                        
                        const userName = req.body.name || 'Executive_Candidate';
                        let userFolder = rootFolder.children.find(f => f.name === userName);
                        if (!userFolder) userFolder = await rootFolder.mkdir(userName);
                        
                        const filename = `${userName}_CV_${Date.now()}.pdf`;
                        await userFolder.upload({ name: filename }, req.file.buffer).complete;
                        console.log(`Successfully backed up CV to Mega.nz: /AiMentor_Resumes/${userName}/${filename}`);
                    } catch (megaErr) {
                        console.error('Mega.nz upload failed:', megaErr.message);
                    }
                })();
            }
        } else if (req.body && req.body.resume_text) {
            // Text pasted directly — no file to parse or backup
            rawText = req.body.resume_text;
        } else {
            return res.status(400).json({ message: 'No file or resume text provided' });
        }

        // 3. Pass parsed text to Python Agentic Service
        const aiRes = await axios.post(`${process.env.AI_SERVICE_URL}/evaluate/resume`, { resume_text: rawText });
        
        // Return the evaluated JSON payload to the frontend
        res.json(aiRes.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error parsing resume', error: error.message });
    }
});

module.exports = router;
