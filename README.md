# AI Career Mentor

An intelligent career coaching platform powered by advanced AI agents, designed to guide professionals through comprehensive career development, interview preparation, and skill assessment.

## Overview

AI Career Mentor combines machine learning, personalized coaching, and interactive features to create an adaptive learning experience. The platform intelligently evaluates your profile, creates customized roadmaps, conducts mock interviews, and provides real-time mentorship.

## Key Features

- **Intelligent Profile Analysis** - AI-powered assessment of skills, experience, and career goals
- **Adaptive Roadmaps** - Personalized career development paths based on your profile and aspirations
- **Mock Interview Studio** - Practice interviews with AI evaluation and feedback
- **Career Intelligence** - Company insights and role-specific recommendations
- **Smart Resume Lab** - Resume analysis and optimization suggestions
- **Gamification Elements** - Engagement features to motivate progress
- **Real-Time Mentorship** - Chat interface with AI mentor for guidance
- **Progress Tracking** - Comprehensive analytics and achievement monitoring

## Architecture

**Backend (ai_service/)**
- Python-based service with specialized AI agents
- Mentor Agent: Provides guidance and explanations
- Evaluator Agent: Assesses user performance and skills
- Planner Agent: Creates personalized development roadmaps
- LLM Integration: Advanced language models for intelligent responses

**Frontend (client/)**
- Next.js React application
- Responsive design with Tailwind CSS
- Features: Interview prep, profile dashboard, roadmaps, gamification
- Firebase authentication integration

**Server (server/)**
- Express.js backend API
- MongoDB integration for user and progress data
- RESTful endpoints for analysis and user management

## Getting Started

1. **Backend Setup**
   ```bash
   cd ai_service
   pip install -r requirements.txt
   playwright install chromium
   python main.py
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Server Setup**
   ```bash
   cd server
   npm install
   npm start
   ```

## Technology Stack

- **Backend**: Python, LangChain/LLM frameworks
- **Frontend**: React, Next.js, Tailwind CSS
- **Server**: Node.js, Express, MongoDB
- **Authentication**: Firebase

## License

MIT License - see LICENSE file for details
