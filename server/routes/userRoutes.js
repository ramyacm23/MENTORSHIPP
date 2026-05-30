const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/authMiddleware');

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
            process.env.JWT_SECRET || 'your-secret-key',
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
                process.env.JWT_SECRET || 'your-secret-key',
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
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// GET authenticated user profile — fetches profile fields from MongoDB
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        res.json({
            name: user.name,
            email: user.email,
            currentRole: user.currentRole || '',
            targetRole: user.targetRole || '',
            yearsExperience: user.yearsExperience || ''
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT authenticated profile update — persists allowed fields to MongoDB
const ALLOWED_PROFILE_FIELDS = ['name', 'currentRole', 'targetRole', 'yearsExperience'];

router.put('/profile', authenticateUser, async (req, res) => {
    try {
        const updates = {};

        // Whitelist: only pick allowed fields from the request body
        for (const field of ALLOWED_PROFILE_FIELDS) {
            if (req.body[field] !== undefined) {
                const value = String(req.body[field]).trim();
                if (value.length > 200) {
                    return res.status(400).json({ message: `${field} must be under 200 characters` });
                }
                updates[field] = value;
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            name: updatedUser.name,
            email: updatedUser.email,
            currentRole: updatedUser.currentRole || '',
            targetRole: updatedUser.targetRole || '',
            yearsExperience: updatedUser.yearsExperience || ''
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        if (!user) return res.status(404).json({ message: 'User not found' });

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
