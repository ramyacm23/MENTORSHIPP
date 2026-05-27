from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from agents.evaluator import evaluate_resume
from agents.planner import generate_roadmap
from agents.mentor import generate_nudge
import io
from fastapi.responses import StreamingResponse

app = FastAPI(title="CareerAgent AI Brain")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Request Models ====================

class ResumePayload(BaseModel):
    resume_text: str

class RoadmapPayload(BaseModel):
    target_role: str
    timeline_weeks: int = 8

class MentorPayload(BaseModel):
    streak: int
    xp: int
    risk_level: str

class ProfilePayload(BaseModel):
    cgpa: float
    skills: List[str]
    projects: int
    years_experience: float
    target_role: str

class InterviewPayload(BaseModel):
    mode: str  # "HR", "DSA", "SystemDesign"
    user_response: str
    question_number: int

class SkillGapPayload(BaseModel):
    current_skills: List[str]
    target_role: str

class CompanyPayload(BaseModel):
    company_name: str
    target_role: str

class ProgressPayload(BaseModel):
    user_id: str
    tasks_completed: int
    total_tasks: int
    days_active: int
    total_days: int

class ResourceItem(BaseModel):
    text: str
    href: Optional[str] = None

class DepItem(BaseModel):
    label: Optional[str] = None
    chip: Optional[str] = None

class PhaseItem(BaseModel):
    name: str
    colorClass: str
    duration: str
    level: str
    topics: List[str]
    resources: List[ResourceItem]
    outcomes: List[str]
    deps: List[DepItem]

class RoadmapPdfPayload(BaseModel):
    phases: List[PhaseItem]
    total_time: Optional[str] = "varies"

@app.get("/")
def read_root():
    return {"status": "AI Service Running", "model": "llama-3.1-8b-instant"}

@app.post("/evaluate/resume")
async def api_evaluate_resume(payload: ResumePayload):
    return evaluate_resume(payload.resume_text)

@app.post("/plan/roadmap")
async def api_plan_roadmap(payload: RoadmapPayload):
    return generate_roadmap(payload.target_role, payload.timeline_weeks)

@app.post("/mentor/nudge")
async def api_mentor_nudge(payload: MentorPayload):
    return generate_nudge(payload.streak, payload.xp, payload.risk_level)

# ==================== SMART PROFILE ANALYZER ====================

@app.post("/analyze/profile")
async def analyze_profile(payload: ProfilePayload):
    """Smart Profile Analyzer - calculates placement probability & gaps"""
    try:
        # Calculate placement probability (mock ML logic)
        base_score = 50
        cgpa_score = min(payload.cgpa / 4.0 * 20, 20)
        skills_score = min(len(payload.skills) * 5, 20)
        project_score = min(payload.projects * 5, 20)
        exp_bonus = min(payload.years_experience * 3, 20)
        
        placement_probability = min(base_score + cgpa_score + skills_score + project_score + exp_bonus, 99)
        
        # Generate skill gaps
        all_skills = ["Python", "Java", "DSA", "SQL", "APIs", "React", "Docker", "AWS","System Design"]
        user_skills = [skill.lower() for skill in payload.skills]
        skill_gaps = [
            s for s in all_skills
            if s.lower() not in user_skills
        ]
        
        return {
            "status": "success",
            "placement_probability": round(placement_probability, 1),
            "skill_gap": skill_gaps[:5],
            "tier": "Elite" if placement_probability > 80 else "Intermediate" if placement_probability > 60 else "Beginner",
            "next_milestone": f"Master {skill_gaps[0] if skill_gaps else 'Advanced topics'}",
            "message": f"You're {placement_probability:.0f}% ready for {payload.target_role}"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
@app.post("/download/roadmap/pdf")
async def download_roadmap_pdf(payload: RoadmapPdfPayload):
    try:
        from jinja2 import Environment, FileSystemLoader
        from playwright.sync_api import sync_playwright
        import asyncio

        env = Environment(loader=FileSystemLoader("templates/"))
        template = env.get_template("roadmap.html")

        rendered_html = template.render(
            phases=[p.model_dump() for p in payload.phases],
            total_time=payload.total_time,
            skill_order=" → ".join(p.name for p in payload.phases),
        )

        print("HTML rendered, length:", len(rendered_html))

        def generate_pdf():
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                
                page.set_viewport_size({"width": 1200, "height": 900})
                page.set_content(rendered_html, wait_until="networkidle")
                
                page.wait_for_timeout(2000)
                pdf = page.pdf(
                    format="A4",
                    print_background=True,
                    margin={"top": "10mm", "bottom": "10mm", "left": "8mm", "right": "8mm"}
                )
                browser.close()
                return pdf

        loop = asyncio.get_event_loop()
        pdf_bytes = await loop.run_in_executor(None, generate_pdf)

        print("PDF generated, size:", len(pdf_bytes))

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="roadmap.pdf"'}
        )
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ==================== SKILL GAP ANALYZER ====================

@app.post("/analyze/skill-gap")
async def skill_gap_analysis(payload: SkillGapPayload):
    """Analyze skill gaps for target role"""
    all_skills = {
        "Software Engineer": ["Python", "Java", "DSA", "System Design", "SQL", "APIs", "Git"],
        "Product Manager": ["Product Strategy", "Data Analysis", "Communication", "Roadmapping"],
        "Data Scientist": ["Python", "ML", "Statistics", "SQL", "TensorFlow", "Pandas"],
        "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
    }
    
    required = all_skills.get(payload.target_role, [])
    gaps = [s for s in required if s not in payload.current_skills]
    heatmap = {skill: 1 if skill in payload.current_skills else 0 for skill in required}
    
    return {
        "current_skills": payload.current_skills,
        "required_skills": required,
        "skill_gaps": gaps,
        "completion": f"{len(payload.current_skills)}/{len(required)}",
        "heatmap": heatmap
    }

# ==================== COMPANY INTELLIGENCE ====================

@app.post("/intelligence/company")
async def company_intelligence(payload: CompanyPayload):
    """Company hiring patterns & difficulty"""
    company_profiles = {
        "Google": {"difficulty": 9, "pattern": "DSA + System Design heavy", "hiring_rate": "0.5%"},
        "Amazon": {"difficulty": 8, "pattern": "DSA + LPs (Leadership Principles)", "hiring_rate": "1.2%"},
        "Meta": {"difficulty": 9, "pattern": "System Design focused", "hiring_rate": "0.8%"},
        "Microsoft": {"difficulty": 7, "pattern": "Balanced DSA + System Design", "hiring_rate": "2.5%"},
        "Apple": {"difficulty": 8, "pattern": "Low-level design, optimization", "hiring_rate": "1.0%"},
        "TCS": {"difficulty": 4, "pattern": "Basic DSA + communication", "hiring_rate": "15%"},
        "Infosys": {"difficulty": 4, "pattern": "Aptitude + general coding", "hiring_rate": "12%"},
    }
    
    company = company_profiles.get(payload.company_name, {"difficulty": 5, "pattern": "Balanced", "hiring_rate": "5%"})
    
    return {
        "company": payload.company_name,
        "difficulty": company["difficulty"],
        "pattern": company["pattern"],
        "hiring_rate": company["hiring_rate"],
        "recommendation": f"Focus on {company['pattern']} for {payload.company_name}",
        "match_score": max(95 - (company["difficulty"] * 10), 20)
    }

# ==================== INTERVIEW FEEDBACK ====================

@app.post("/interview/feedback")
async def interview_feedback(payload: InterviewPayload):
    """Real-time interview feedback"""
    feedback_prompts = {
        "HR": "Evaluate the response for clarity, communication, confidence, and relevance to the question.",
        "DSA": "Evaluate the solution for correctness, efficiency, edge cases, and code quality.",
        "SystemDesign": "Evaluate the design for scalability, reliability, maintainability, and completeness."
    }
    
    return {
        "mode": payload.mode,
        "confidence_score": 7.2,
        "clarity_score": 8.1,
        "accuracy_score": 6.9,
        "feedback": f"Good structure. Consider {['more specific examples', 'better time complexity', 'horizontal scaling'][hash(payload.user_response) % 3]}.",
        "areas_to_improve": ["Speak more concisely", "Include metrics", "Address edge cases"],
        "next_question": f"Tell us about a time you had to..."
    }

# ==================== PROGRESS & PREDICTION ====================

@app.post("/progress/predict")
async def predict_placement(payload: ProgressPayload):
    """Predict placement probability based on progress"""
    completion_rate = payload.tasks_completed / payload.total_tasks if payload.total_tasks > 0 else 0
    consistency_rate = payload.days_active / payload.total_days if payload.total_days > 0 else 0
    
    placement_chance = 50 + (completion_rate * 30) + (consistency_rate * 20)
    trend = "📈 Improving" if completion_rate > 0.7 else "📉 Declining" if completion_rate < 0.3 else "→ Stable"
    
    return {
        "current_placement_chance": round(placement_chance, 1),
        "trend": trend,
        "completion_rate": f"{completion_rate*100:.0f}%",
        "consistency_rate": f"{consistency_rate*100:.0f}%",
        "prediction": f"At this rate, {round(placement_chance, 0):.0f}% placement chance by target date",
        "alert": "⚠️ You're 18% below target" if placement_chance < 65 else None
    }

# ==================== RISK DETECTION ====================

@app.post("/risk/detect")
async def detect_risk(payload: ProgressPayload):
    """Detect inactivity and performance risks"""
    completion_rate = payload.tasks_completed / payload.total_tasks if payload.total_tasks > 0 else 0
    
    risks = []
    if payload.days_active < 3:
        risks.append("⚠️ Inactivity detected - less than 3 days active")
    if completion_rate < 0.3:
        risks.append("📉 Low task completion rate")
    if payload.total_tasks > 10 and payload.tasks_completed < 5:
        risks.append("🚨 Falling behind schedule")
    
    return {
        "risk_level": "high" if len(risks) > 2 else "medium" if len(risks) > 0 else "low",
        "alerts": risks,
        "recommendation": "Increase daily practice and complete pending milestones"
    }

# ==================== MENTOR CONTEXT ====================

@app.post("/mentor/context")
async def mentor_with_context(payload: dict):
    """Context-aware mentor with Groq AI"""
    from core.llm import generate_json_response
    import json as json_module
    
    user_input = payload.get("user_input", "")
    context = payload.get("context", "")
    
    print(f"🤖 Mentor received: {user_input}")
    
    system_prompt = """You are an expert career mentor, interview coach, and mentor who can discuss various topics.
You are knowledgeable, friendly, and engaging. You can tell jokes, have casual conversations, and answer questions about anything.
However, always try to connect broader topics back to career development when relevant.
Keep responses concise but insightful. Return JSON with 'suggestion' and 'action' as strings."""
    
    user_prompt = f"""User is asking: "{user_input}"

Context about the user: {context if context else "No specific context provided"}

Please respond naturally to their question or request. If it's career-related, provide actionable career advice.
If it's a joke request, tell them a good joke (preferably tech/programming related but can be any good joke).
If it's general conversation, engage naturally but try to relate it to their career growth if possible.

Respond as JSON with exactly these string fields:
- suggestion: Your main response (can be advice, a joke, or an answer to their question - one paragraph or a few sentences)
- action: A specific action they could take, OR if it's a joke/casual topic, this can be something fun or a callback to career development

Example for a joke: {{"suggestion": "Why do programmers prefer dark mode? Because light attracts bugs! 😄", "action": "Use dark mode to avoid those bugs!"}}
Example for career: {{"suggestion": "To prepare for interviews...", "action": "Start practicing coding problems today"}}"""
    
    try:
        print(f"📡 Calling Groq API...")
        response = generate_json_response(system_prompt, user_prompt)
        print(f"✅ Groq Response: {response}")
        
        data = json_module.loads(response)
        
        # Ensure fields are strings
        result = {
            "suggestion": str(data.get("suggestion", "")),
            "action": str(data.get("action", "")),
            "motivation": "You're making progress - keep going!"
        }
        print(f"📤 Sending to frontend: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Groq Error: {e}")
        print(f"⚠️ Using fallback response for: {user_input}")
        return {
            "suggestion": f"I'd love to help with: {user_input}. Let's break this down into actionable steps.",
            "action": "Focus on consistent practice - small steps lead to big progress.",
            "motivation": "You're doing great by seeking guidance!"
        }
