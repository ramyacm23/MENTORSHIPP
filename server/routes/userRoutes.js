const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getAuthenticatedUser(req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return { status: 401, body: { message: 'No token provided' } };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return { status: 404, body: { message: 'User not found' } };
        }

        return { user };
    } catch (error) {
        return { status: 401, body: { message: 'Invalid token' } };
    }
}

function sanitizeUser(user) {
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;
    return sanitizedUser;
}

// Signup endpoint
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        user.comparePassword(password, async (err, isPasswordValid) => {
            if (err) {
                return res.status(500).json({ message: 'Error validating password' });
            }

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Update last active
            user.lastActive = new Date();
            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current user profile
router.get('/me', async (req, res) => {
    const result = await getAuthenticatedUser(req);
    if (result.status) {
        return res.status(result.status).json(result.body);
    }

    res.json(sanitizeUser(result.user));
});

router.get('/profile', async (req, res) => {
    const result = await getAuthenticatedUser(req);
    if (result.status) {
        return res.status(result.status).json(result.body);
    }

    res.json(sanitizeUser(result.user));
});

router.put('/profile', async (req, res) => {
    const result = await getAuthenticatedUser(req);
    if (result.status) {
        return res.status(result.status).json(result.body);
    }

    try {
        const { name, currentRole, targetRole, yearsExperience } = req.body;
        const user = result.user;

        if (typeof name === 'string') {
            user.name = name.trim();
        }

        if (typeof currentRole === 'string') {
            user.currentRole = currentRole.trim();
        }

        if (typeof targetRole === 'string') {
            user.targetRole = targetRole.trim();
        }

        if (yearsExperience === '' || yearsExperience === null || yearsExperience === undefined) {
            user.yearsExperience = null;
        } else {
            const parsedYears = Number(yearsExperience);

            if (!Number.isFinite(parsedYears) || parsedYears < 0) {
                return res.status(400).json({ message: 'Years of experience must be a valid non-negative number' });
            }

            user.yearsExperience = parsedYears;
        }

        await user.save();
        res.json(sanitizeUser(user));
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to update profile' });
    }
});

router.get('/:id/profile', async (req, res) => {
    try {
        // Fallback mock if no specific ID or DB empty
        if (req.params.id === 'default' || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.json({
                placementProbability: 68,
                skills: {
                    'System Design': 85,
                    'Cloud Arch': 92,
                    'Distributed Systems': 60,
                    'Leadership': 75
                },
                companyFitScores: {
                    'Google': 92,
                    'AWS': 84,
                    'Netflix': 71
                },
                streak: 14,
                totalXP: 1240
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            placementProbability: user.placementProbability,
            skills: user.skills,
            companyFitScores: user.companyFitScores,
            streak: user.streak,
            totalXP: user.totalXP
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
