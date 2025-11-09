import re
def normalize_text(text):
    if not text:
        return ''
    text = text.lower().strip()
    # remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text

def extract_features(p_text, d_text, e_text):
    """Basic heuristic features: lengths, keyword counts, overlap of named tokens."""
    feats = {}
    feats['len_p'] = len(p_text.split())
    feats['len_d'] = len(d_text.split())
    feats['len_e'] = len(e_text.split())
    # simple keyword counts
    for kw in ['contract','breach','invoice','proof','witness','force majeure','fraud','negligence']:
        feats[f'kw_p_{kw}'] = p_text.count(kw)
        feats[f'kw_d_{kw}'] = d_text.count(kw)
    # overlap
    p_tokens = set(re.findall(r"\b\w+\b", p_text))
    d_tokens = set(re.findall(r"\b\w+\b", d_text))
    feats['token_overlap'] = len(p_tokens & d_tokens)
    return feats
