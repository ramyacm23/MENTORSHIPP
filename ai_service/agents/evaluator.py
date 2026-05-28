import json
from core.llm import generate_json_response

def evaluate_resume(resume_text: str) -> dict:
    system_prompt = """
    You are an elite Executive Career Agent AI.
    Your job is to analyze resumes and output a strict JSON payload.
    The JSON must contain EXACTLY these keys:
    - "atsScore": (int 0-100) combining formatting, keyword density, and impact.
    - "keywordMatches": (array of strings) 4-6 strong keywords/skills FOUND in the resume.
    - "missingKeywords": (array of strings) 4-6 important industry keywords MISSING from the resume.
    - "strengths": (array of strings) 2-4 specific strengths, each prefixed with "✓ ".
    - "improvements": (array of strings) 3-5 specific, tactical action items to improve the resume.
    - "bulletImprovements": (array of objects) 2-4 objects each with "original" (a weak bullet point from the resume) and "improved" (a rewritten, impactful version with metrics).
    - "atsRecommendations": (array of strings) 3-5 ATS optimization tips specific to this resume.

    Ensure the output is 100% valid JSON. Do not include markdown formatting like ```json in the output.
    """
    try:
        response = generate_json_response(system_prompt, f"Resume Text:\n{resume_text}")
        return json.loads(response)
    except Exception as e:
        return {"error": str(e), "raw_response": response if 'response' in locals() else None}
