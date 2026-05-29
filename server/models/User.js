const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currentRole: { type: String, default: '' },
    targetRole: { type: String, default: 'Software Engineer' },
    yearsExperience: { type: Number, default: null },
    placementProbability: { type: Number, default: 45 },
    skills: { type: Map, of: Number, default: {} }, // e.g., {'System Design': 85}
    companyFitScores: { type: Map, of: Number, default: {} },
    streak: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', function(next) {
    const user = this;
    
    // Only hash if password has been modified
    if (!user.isModified('password')) {
        return next();
    }
    
    // Generate salt and hash
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
