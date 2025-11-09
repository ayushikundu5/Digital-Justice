# GenAI wrapper: tries to call OpenAI but falls back gracefully.
import os
OPENAI_KEY = os.getenv('OPENAI_API_KEY')

def gen_ai_reasoning(prompt):
    """If OPENAI_API_KEY is configured, attempts to call OpenAI ChatCompletion.
    Otherwise returns None so caller can use fallback reasoning.
    """
    if not OPENAI_KEY:
        return None

    try:
        import openai
        openai.api_key = OPENAI_KEY
        resp = openai.ChatCompletion.create(
            model='gpt-4o-mini' if False else 'gpt-4', # change as needed
            messages=[{'role': 'user', 'content': prompt}],
            max_tokens=200,
            temperature=0.2,
        )
        text = resp.choices[0].message['content']
        return text
    except Exception as exc:
        # Could not reach OpenAI - return None
        return None
