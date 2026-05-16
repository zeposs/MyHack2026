import json
from google import genai
from google.genai import types
from database import settings


_client = genai.Client(api_key=settings.GEMINI_API_KEY)


def _safe_json(text: str) -> list:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


async def rank_mentors(startup: dict, mentors: list[dict]) -> list[dict]:
    mentor_list_text = json.dumps(mentors, indent=2, default=str)

    prompt = f"""You are an AI assistant for Cradle, Malaysia's national startup funding agency.
Your job is to rank mentors for a startup applicant based on fit.

Startup profile:
- Name: {startup.get('startup_name')}
- Industry: {startup.get('industry')}
- Stage: {startup.get('business_stage')}
- Problem: {startup.get('problem_statement')}
- Solution: {startup.get('solution_summary')}
- Target market: {startup.get('target_market')}
- Funding needed: RM {startup.get('funding_needed')}

Available mentors:
{mentor_list_text}

Rank every mentor from best to worst fit. For each mentor return a JSON object with exactly these fields:
- mentor_profile_id: string (copy from input)
- rank_position: integer (1 = best)
- match_score: float 0-100
- skill_match_score: float 0-100
- industry_match_score: float 0-100
- stage_match_score: float 0-100
- availability_score: float (100 if available, 50 if limited, 0 if unavailable)
- past_feedback_score: float 0-100 (based on average_rating * 20; 0 if no rating)
- goal_fit_score: float 0-100
- confidence_score: float 0-100
- reason_summary: string (2-3 sentences: why this mentor fits, what evidence supports it, any caveats)

Return ONLY a valid JSON array. No markdown. No explanation outside the array.
"""

    response = await _client.aio.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.3),
    )
    raw = response.text
    results = _safe_json(raw)

    for r in results:
        for field in [
            "match_score", "skill_match_score", "industry_match_score",
            "stage_match_score", "availability_score", "past_feedback_score",
            "goal_fit_score", "confidence_score"
        ]:
            r[field] = round(float(r.get(field, 0)), 2)
        r["ai_model_name"] = settings.GEMINI_MODEL

    results.sort(key=lambda x: x["rank_position"])
    return results
