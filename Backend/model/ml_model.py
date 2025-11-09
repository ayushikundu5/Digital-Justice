# This module provides a simple ML scoring function.
# For now it uses a heuristic. You can replace it with a trained model.
import json, os
from .preprocessing import extract_features

SAMPLE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_cases.json')

def score_case_ml(p_text, d_text, e_text):
    """Return a score from 0..1 favoring plaintiff if close to 1."""
    # Heuristic scoring:
    p = p_text or ''
    d = d_text or ''
    e = e_text or ''

    score = 0.5
    # Length matters slightly (longer, more detailed -> +0.05)
    lp = len(p.split())
    ld = len(d.split())
    if lp > ld + 10:
        score += 0.06
    if ld > lp + 10:
        score -= 0.06

    # keywords that favor plaintiff
    fav_keywords = ['breach','contract','invoice','proof','fraud','damages']
    for kw in fav_keywords:
        if kw in p:
            score += 0.04
        if kw in d:
            score -= 0.03

    # evidence keywords
    if 'invoice' in e or 'receipt' in e or 'photo' in e:
        score += 0.1

    # Clamp
    if score < 0: score = 0.0
    if score > 1: score = 1.0
    return round(score, 4)
