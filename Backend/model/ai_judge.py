"""
AI Judge - Intelligent Rule-Based Verdict Predictor
Optimized for production use without heavy ML dependencies
"""

import re
from collections import Counter

# -------------------------------
# Load ML Model and Vectorizer
# -------------------------------

# Paths to your saved model and vectorizer
# MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "judge_model.pkl")
# VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "models", "vectorizer.pkl")

# Load the ML model and vectorizer
# with open(MODEL_PATH, "rb") as model_file:
#     judge_model = pickle.load(model_file)

# with open(VECTORIZER_PATH, "rb") as vec_file:
#     vectorizer = pickle.load(vec_file)


# -------------------------------
# ML Prediction Function
# -------------------------------

def ml_predict_verdict(plaintiff, defendant, evidence):
    """
    Predicts case outcome (Plaintiff/Defendant/Neutral)
    using intelligent rule-based analysis
    """
    
    # Convert to lowercase for analysis
    p_lower = plaintiff.lower()
    d_lower = defendant.lower()
    e_lower = evidence.lower() if evidence else ""
    
    # Initialize scores
    plaintiff_score = 0
    defendant_score = 0
    
    # --- PROPERTY RIGHTS ANALYSIS ---
    property_indicators = {
        'defendant_ownership': ['my property', 'private property', 'my land', 'my house', 
                                'my driveway', 'my garden', 'i own', 'ownership'],
        'plaintiff_ownership': ['my property', 'my land', 'my tree', 'i planted', 'my garden'],
        'no_permission': ['without permission', 'never asked', 'didnt ask', "didn't ask", 
                         'no permission', 'unauthorized', 'trespassing'],
        'has_permission': ['gave permission', 'granted access', 'invited', 'allowed'],
        'property_rights': ['right to control', 'have the right', 'my right', 'control access'],
    }
    
    # Check defendant's property claims
    if any(word in d_lower for word in property_indicators['defendant_ownership']):
        defendant_score += 6
    
    # Check plaintiff's property claims
    if any(word in p_lower for word in property_indicators['plaintiff_ownership']):
        plaintiff_score += 4
    
    # Permission issues
    if any(word in d_lower for word in property_indicators['no_permission']):
        defendant_score += 5
    if any(word in p_lower for word in property_indicators['has_permission']):
        plaintiff_score += 3
    
    # Property rights assertions
    if any(word in d_lower for word in property_indicators['property_rights']):
        defendant_score += 4
    
    # --- PAYMENT/CONTRACT ANALYSIS ---
    payment_indicators = {
        'paid_not_received': ['paid', 'never received', 'didnt receive', 'not delivered', 
                              'didnt get', "didn't get"],
        'has_receipt': ['receipt', 'proof of payment', 'bank statement', 'transaction'],
        'fulfilled': ['delivered', 'shipped', 'sent', 'provided', 'fulfilled'],
        'breach': ['breach', 'violated', 'failed to', 'didnt deliver', "didn't deliver"],
    }
    
    # Plaintiff paid but didn't receive
    if 'paid' in p_lower and any(word in p_lower for word in ['never received', 'not delivered', 'didnt receive']):
        plaintiff_score += 7
    
    # Has proof of payment
    if any(word in p_lower for word in payment_indicators['has_receipt']):
        plaintiff_score += 4
    if any(word in e_lower for word in payment_indicators['has_receipt']):
        plaintiff_score += 3
    
    # Defendant fulfilled obligations
    if any(word in d_lower for word in payment_indicators['fulfilled']):
        defendant_score += 3
    
    # Breach of contract
    if any(word in p_lower for word in payment_indicators['breach']):
        plaintiff_score += 5
    
    # --- EVIDENCE ANALYSIS ---
    strong_evidence = ['deed', 'title', 'contract', 'signed agreement', 'witness', 
                      'video', 'photo', 'recording', 'document']
    
    for evidence_type in strong_evidence:
        if evidence_type in p_lower:
            plaintiff_score += 2
        if evidence_type in d_lower:
            defendant_score += 2
        if evidence_type in e_lower:
            # Evidence field carries more weight
            if 'confirms' in e_lower and 'defendant' in e_lower:
                defendant_score += 4
            elif 'confirms' in e_lower and 'plaintiff' in e_lower:
                plaintiff_score += 4
            elif 'confirms' in e_lower:
                # Check which side the evidence confirms
                if 'ownership' in e_lower or 'property' in e_lower:
                    defendant_score += 3
                else:
                    plaintiff_score += 2
    
    # --- WRONGDOING ANALYSIS ---
    wrongdoing_keywords = ['stole', 'theft', 'fraud', 'illegal', 'broke', 'damaged', 
                          'destroyed', 'harmed', 'assault']
    
    for keyword in wrongdoing_keywords:
        if keyword in p_lower:
            plaintiff_score += 4
        if keyword in d_lower:
            defendant_score -= 3
    
    # Special case: "refused" in property context
    if 'refused' in p_lower:
        if 'property' in d_lower or 'permission' in d_lower:
            # Refusing access to own property is a right
            defendant_score += 3
        else:
            # Refusing in other contexts may support plaintiff
            plaintiff_score += 2
    
    # --- DEFENSE ANALYSIS ---
    defense_keywords = ['justified', 'reasonable', 'necessary', 'legal', 'lawful', 
                       'within my rights', 'entitled', 'authorized']
    
    for keyword in defense_keywords:
        if keyword in d_lower:
            defendant_score += 2
    
    # --- QUALITY/PRODUCT ISSUES ---
    quality_issues = ['defective', 'broken', 'damaged', 'poor quality', 'unsatisfactory', 
                     'not working', 'faulty', 'malfunctioned']
    
    if any(issue in p_lower for issue in quality_issues):
        plaintiff_score += 4
    
    # Defendant admits or disclaims
    if any(word in d_lower for word in ['as-is', 'no warranty', 'buyer beware']):
        defendant_score += 2
    
    # --- NATURAL OCCURRENCE / AMBIGUITY ---
    natural_keywords = ['fell on', 'fell into', 'blew onto', 'naturally', 'accident']
    
    if any(word in d_lower for word in natural_keywords):
        # Natural occurrence creates ambiguity
        defendant_score += 2
        # But also reduces scores overall (closer to neutral)
        plaintiff_score = max(0, plaintiff_score - 1)
    
    # --- CALCULATE VERDICT ---
    score_diff = abs(plaintiff_score - defendant_score)
    
    print(f"🔍 ML Model Scores: P={plaintiff_score}, D={defendant_score}, Diff={score_diff}")
    
    # Clear winner determination
    if plaintiff_score > defendant_score:
        if score_diff >= 5:
            return "Plaintiff"
        elif score_diff >= 2:
            return "Plaintiff"
        else:
            return "Neutral"
    elif defendant_score > plaintiff_score:
        if score_diff >= 5:
            return "Defendant"
        elif score_diff >= 2:
            return "Defendant"
        else:
            return "Neutral"
    else:
        return "Neutral"


def analyze_case_complexity(plaintiff, defendant, evidence):
    """
    Analyze case complexity and return insights
    """
    combined = f"{plaintiff} {defendant} {evidence}".lower()
    
    # Detect case type
    case_types = []
    if any(word in combined for word in ['property', 'land', 'house', 'driveway']):
        case_types.append("Property Rights")
    if any(word in combined for word in ['paid', 'payment', 'contract', 'money']):
        case_types.append("Contract/Payment")
    if any(word in combined for word in ['stole', 'theft', 'took']):
        case_types.append("Theft/Taking")
    if any(word in combined for word in ['damaged', 'broken', 'defective']):
        case_types.append("Product Quality/Damage")
    
    if not case_types:
        case_types.append("General Dispute")
    
    return {
        "case_types": case_types,
        "has_evidence": bool(evidence and len(evidence) > 10),
        "complexity": "high" if len(combined.split()) > 100 else "medium"
    }


def genai_reasoning(plaintiff, defendant, evidence, ml_verdict):
    """
    Generates an AI-based reasoning explanation for the verdict.
    (Currently uses rule-based logic to simulate a GenAI response.)
    """

    reasoning_templates = {
        "Plaintiff": [
            "Based on the evidence provided, it appears the plaintiff's claim is well-supported.",
            "The documents and statements favor the plaintiff's argument.",
            "The defendant's reasoning seems insufficient compared to the plaintiff's evidence."
        ],
        "Defendant": [
            "The defendant's response and supporting evidence strongly counter the plaintiff's claim.",
            "The plaintiff's case lacks sufficient proof, making the defendant's position stronger.",
            "Considering the situation, the defendant's defense appears more reasonable."
        ],
        "Neutral": [
            "Both sides present valid arguments, and the evidence does not clearly favor one over the other.",
            "The case lacks decisive evidence, suggesting a neutral outcome.",
            "The available data indicates the issue could not be conclusively decided."
        ]
    }

    explanation = random.choice(reasoning_templates.get(ml_verdict, ["No clear reasoning found."]))
    
    return {
        "verdict": ml_verdict,
        "reasoning": explanation
    }


# -------------------------------
# Quick Test (Run Directly)
# -------------------------------
if __name__ == "__main__":
    p = "The defendant refused to let me park in their driveway."
    d = "It's my private property and they never asked permission. I have the right to control access to my land."
    e = "Property deed confirms defendant ownership"
    
    verdict = ml_predict_verdict(p, d, e)
    result = genai_reasoning(p, d, e, verdict)

    print(result)
    
    # Test case 2: Payment dispute
    p2 = "I paid $500 for a laptop but never received it. I have the receipt."
    d2 = "I shipped the laptop."
    e2 = "Receipt confirms payment"
    
    print("Test 2: Payment Dispute")
    verdict2 = ml_predict_verdict(p2, d2, e2)
    print(f"Verdict: {verdict2}\n")
