from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Try to import the AI judge model
try:
    from model.ai_judge import ml_predict_verdict
    AI_MODEL_AVAILABLE = True
    print("✅ AI Judge model loaded successfully!")
except Exception as e:
    AI_MODEL_AVAILABLE = False
    print(f"⚠️  AI Judge model not available: {e}")
    print("📝 Using fallback logic for verdicts")

# Try to import the local GenAI Reasoner
try:
    from model.gen_ai_reasoner import LocalGenAIReasoner
    genai = LocalGenAIReasoner()
    print("🧠 Local GenAI Reasoner loaded successfully!")
except Exception as e:
    genai = None
    print(f"⚠️  Local GenAI Reasoner not available: {e}")


@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "AI Court Backend API",
        "version": "2.0.0",
        "ai_model_available": AI_MODEL_AVAILABLE,
        "genai_available": genai is not None,
        "endpoints": {
            "POST /verdict": "Submit a case for judgment",
            "POST /api/genai_reason": "Generate logical & emotional reasoning",
            "GET /health": "Health check",
            "GET /": "API information"
        }
    })


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "ai_model": "loaded" if AI_MODEL_AVAILABLE else "using fallback",
        "genai": "active" if genai else "not available"
    })


@app.route('/verdict', methods=['POST'])
def get_verdict():
    """
    Endpoint to get a verdict for a case
    Expected JSON body:
    {
        "plaintiff": "...",
        "defendant": "...",
        "evidence": "..."
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        plaintiff = data.get('plaintiff', '').strip()
        defendant = data.get('defendant', '').strip()
        evidence = data.get('evidence', '').strip()

        if not plaintiff or not defendant:
            return jsonify({
                "error": "Missing required fields",
                "message": "Both plaintiff and defendant statements are required"
            }), 400

        # Use AI model if available, otherwise fallback
        if AI_MODEL_AVAILABLE:
            try:
                ml_verdict = ml_predict_verdict(plaintiff, defendant, evidence)
                verdict = {
                    "winner": ml_verdict,
                    "confidence": "high",
                    "model": "AI Judge ML Model"
                }
            except Exception as e:
                print(f"Error using AI model: {e}")
                verdict = get_fallback_verdict(plaintiff, defendant)
                verdict["model"] = "Fallback Logic (AI Model Error)"
        else:
            verdict = get_fallback_verdict(plaintiff, defendant)
            verdict["model"] = "Fallback Logic"

        return jsonify(verdict), 200

    except Exception as e:
        print(f"Error processing verdict: {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@app.route('/api/genai_reason', methods=['POST'])
def genai_reason():
    """
    Endpoint for Local GenAI to generate reasoning
    Expected JSON body:
    {
        "plaintiff": "...",
        "defendant": "...",
        "evidence": "...",
        "verdict": "Plaintiff/Defendant/Neutral"
    }
    """
    try:
        data = request.get_json()
        plaintiff = data.get("plaintiff", "")
        defendant = data.get("defendant", "")
        evidence = data.get("evidence", "")
        verdict = data.get("verdict", "")

        if genai:
            # Use GenAI if available
            reasoning = genai.generate_reasoning(plaintiff, defendant, evidence, verdict)
            model_used = "Local GenAI (Phi-3 Mini)"
            
            print(f"\n{'='*60}")
            print(f"🔍 BACKEND DEBUG - SENDING TO FRONTEND:")
            print(f"{'='*60}")
            print(f"Reasoning length: {len(reasoning)}")
            print(f"First 100 chars: '{reasoning[:100]}'")
            print(f"First char code: {ord(reasoning[0]) if reasoning else 'EMPTY'}")
            print(f"First char: '{reasoning[0]}' (visible: {reasoning[0].isprintable() if reasoning else False})")
            print(f"{'='*60}\n")
        else:
            # Use fallback reasoning
            reasoning = generate_fallback_reasoning(plaintiff, defendant, evidence, verdict)
            model_used = "Rule-Based Reasoning"
        
        return jsonify({
            "reasoning": reasoning,
            "model": model_used
        })

    except Exception as e:
        print(f"Error generating reasoning: {e}")
        # If GenAI fails, use fallback
        try:
            reasoning = generate_fallback_reasoning(
                data.get("plaintiff", ""),
                data.get("defendant", ""),
                data.get("evidence", ""),
                data.get("verdict", "")
            )
            return jsonify({
                "reasoning": reasoning,
                "model": "Rule-Based Reasoning (Fallback)"
            })
        except:
            return jsonify({"error": "GenAI reasoning failed", "message": str(e)}), 500


def get_fallback_verdict(plaintiff, defendant):
    """Rule-based fallback logic for verdict generation"""
    plaintiff_lower = plaintiff.lower()
    defendant_lower = defendant.lower()

    plaintiff_score = 0
    defendant_score = 0

    # Strong property rights keywords for defendant - INCREASED WEIGHT
    property_rights = ['my property', 'private property', 'my land', 'ownership', 'property deed', 
                       'title deed', 'my house', 'my driveway', 'my garden']
    for keyword in property_rights:
        if keyword in defendant_lower:
            defendant_score += 5  # Increased from 3 to 5 - very strong claim
    
    # Unauthorized access/trespass claims - INCREASED WEIGHT
    trespass_keywords = ['without permission', 'never asked', 'trespassing', 'unauthorized', 
                         'no right to', 'no permission', 'didnt ask', "didn't ask"]
    for keyword in trespass_keywords:
        if keyword in defendant_lower:
            defendant_score += 4  # Increased from 2 to 4
    
    # Control/rights assertions - NEW
    control_keywords = ['right to control', 'my right', 'have the right', 'control access']
    for keyword in control_keywords:
        if keyword in defendant_lower:
            defendant_score += 3
    
    # Evidence keywords - boost score significantly
    evidence_keywords = ['evidence', 'proof', 'document', 'witness', 'contract', 'receipt', 
                        'record', 'deed', 'title', 'agreement', 'written', 'signed', 'confirms']
    for keyword in evidence_keywords:
        if keyword in plaintiff_lower:
            plaintiff_score += 3
        if keyword in defendant_lower:
            defendant_score += 3

    # Clear wrongdoing by defendant
    negative_keywords = ['refused', 'failed', 'breach', 'violated', 'damaged', 'fraud', 
                        'illegal', 'stole', 'theft', 'took without', 'broke', 'destroyed']
    for keyword in negative_keywords:
        if keyword in plaintiff_lower and keyword == 'refused':
            # Special case: "refused" in property context is defendant's right
            if 'property' in defendant_lower or 'permission' in defendant_lower:
                defendant_score += 2  # Refusing access is their right
            else:
                plaintiff_score += 2
        elif keyword in plaintiff_lower:
            plaintiff_score += 2
        if keyword in defendant_lower and keyword != 'refused':
            defendant_score -= 2

    # Strong defense/justification by defendant
    defense_keywords = ['justified', 'necessary', 'reasonable', 'legal', 'rights', 
                       'complied', 'permission', 'allowed', 'authorized', 'lawful']
    for keyword in defense_keywords:
        if keyword in defendant_lower:
            defendant_score += 2
        if keyword in plaintiff_lower:
            plaintiff_score += 1

    # Payment/financial claims
    payment_keywords = ['paid', 'payment', 'money', '$', 'fee', 'cost', 'charge', 'invoice']
    for keyword in payment_keywords:
        if keyword in plaintiff_lower:
            plaintiff_score += 3  # Increased from 2 to 3
    
    # Service/product issues
    service_issues = ['unsatisfactory', 'poor quality', 'defective', 'broken', 'damaged', 
                     'not working', 'faulty', 'never received', 'didnt receive']
    for keyword in service_issues:
        if keyword in plaintiff_lower:
            plaintiff_score += 3  # Increased from 2 to 3

    # Determine winner with clearer threshold
    score_diff = abs(plaintiff_score - defendant_score)
    
    print(f"🔍 Score Debug: Plaintiff={plaintiff_score}, Defendant={defendant_score}, Diff={score_diff}")
    
    if plaintiff_score > defendant_score:
        winner = "Plaintiff"
        confidence = "high" if score_diff >= 4 else "medium"
        reasoning = (
            f"The plaintiff's arguments appear stronger based on the evidence presented. "
            f"Their claims are better supported by documentation and reasoning."
        )
    elif defendant_score > plaintiff_score:
        winner = "Defendant"
        confidence = "high" if score_diff >= 4 else "medium"
        reasoning = (
            f"The defendant provides reasonable and well-supported justifications "
            f"that effectively counter the plaintiff's claims."
        )
    else:
        winner = "Neutral"
        confidence = "medium"
        reasoning = (
            "Both parties have compelling points; additional evidence may be required "
            "for a conclusive verdict."
        )

    return {
        "winner": winner,
        "reasoning": reasoning,
        "confidence": confidence,
        "plaintiff_score": plaintiff_score,
        "defendant_score": defendant_score
    }


def generate_fallback_reasoning(plaintiff, defendant, evidence, verdict):
    """Generate detailed, case-specific reasoning using rule-based logic"""
    
    plaintiff_lower = plaintiff.lower()
    defendant_lower = defendant.lower()
    evidence_lower = evidence.lower() if evidence else ""
    
    # Analyze case type and key legal concepts
    case_type = "general dispute"
    key_factors = []
    
    # Property rights case
    if any(word in plaintiff_lower or word in defendant_lower or word in evidence_lower 
           for word in ['property', 'land', 'house', 'driveway', 'garden', 'tree']):
        case_type = "property rights dispute"
        
        # Check who has property rights
        if any(word in defendant_lower for word in ['my property', 'private property', 'my land', 'ownership']):
            key_factors.append("The defendant has clearly established property rights and ownership")
        if any(word in plaintiff_lower for word in ['my property', 'my land', 'my tree', 'planted']):
            key_factors.append("The plaintiff claims ownership and property rights")
        
        # Check for permission/authorization
        if 'without permission' in defendant_lower or 'never asked' in defendant_lower:
            key_factors.append("The plaintiff did not have permission or authorization")
        if 'permission' in plaintiff_lower and 'asked' in plaintiff_lower:
            key_factors.append("The plaintiff claims they requested permission")
        
        # Check for evidence
        if 'deed' in evidence_lower or 'title' in evidence_lower or 'ownership' in evidence_lower:
            key_factors.append("Documentary evidence (deed/title) confirms ownership claims")
    
    # Contract/Payment dispute
    elif any(word in plaintiff_lower or word in defendant_lower 
             for word in ['paid', 'payment', 'contract', 'agreement', 'invoice', 'receipt']):
        case_type = "contract or payment dispute"
        
        if 'paid' in plaintiff_lower and any(word in plaintiff_lower for word in ['never received', 'not delivered', 'didnt get']):
            key_factors.append("The plaintiff claims to have paid but not received the goods/services")
        if 'receipt' in plaintiff_lower or 'proof of payment' in plaintiff_lower:
            key_factors.append("The plaintiff has documentation of payment")
        if 'delivered' in defendant_lower or 'shipped' in defendant_lower:
            key_factors.append("The defendant claims they fulfilled their obligations")
    
    # Theft/Taking property
    elif any(word in plaintiff_lower for word in ['stole', 'took', 'theft', 'stolen', 'taken', 'missing', 'gone']):
        case_type = "theft or unauthorized taking"
        
        if 'took it' in defendant_lower or 'we took' in defendant_lower:
            key_factors.append("The defendant admits to taking the items")
        if 'fell on' in defendant_lower or 'came to' in defendant_lower:
            key_factors.append("The defendant claims the items came onto their property naturally")
        if 'signboard' in plaintiff_lower or 'sign' in plaintiff_lower or 'notice' in plaintiff_lower:
            key_factors.append("The plaintiff had posted notice/warning signs")
    
    # Damage/Quality issues
    elif any(word in plaintiff_lower or word in defendant_lower 
             for word in ['damaged', 'broken', 'defective', 'poor quality', 'unsatisfactory']):
        case_type = "product quality or damage dispute"
        
        if any(word in plaintiff_lower for word in ['damaged', 'broken', 'defective']):
            key_factors.append("The plaintiff claims the product/service was defective or damaged")
        if any(word in defendant_lower for word in ['as-is', 'no warranty', 'disclosed']):
            key_factors.append("The defendant claims proper disclosure or 'as-is' sale")
    
    # Build reasoning based on verdict
    reasoning_parts = []
    
    reasoning_parts.append(f"**Case Type:** {case_type.title()}\n")
    reasoning_parts.append(f"**Verdict:** {verdict}\n")
    
    # Logical Analysis with specific case details
    reasoning_parts.append("**Logical Analysis:**")
    
    if verdict == "Plaintiff":
        reasoning_parts.append("The court finds in favor of the plaintiff based on the following:")
        
        if key_factors:
            for factor in key_factors:
                if 'plaintiff' in factor.lower() or 'paid' in factor.lower() or 'posted' in factor.lower():
                    reasoning_parts.append(f"• {factor}")
        
        # Add specific analysis based on case type
        if case_type == "property rights dispute":
            reasoning_parts.append("• The plaintiff has demonstrated valid property rights claims")
            if 'signboard' in plaintiff_lower or 'notice' in plaintiff_lower:
                reasoning_parts.append("• Clear notice was provided to prevent unauthorized access")
        elif case_type == "contract or payment dispute":
            reasoning_parts.append("• The plaintiff has shown evidence of payment or fulfilled obligations")
            reasoning_parts.append("• The defendant failed to deliver as agreed")
        elif case_type == "theft or unauthorized taking":
            reasoning_parts.append("• The taking was without authorization or permission")
            reasoning_parts.append("• The plaintiff's property rights were violated")
        
        reasoning_parts.append("")
        
    elif verdict == "Defendant":
        reasoning_parts.append("The court finds in favor of the defendant based on the following:")
        
        if key_factors:
            for factor in key_factors:
                if 'defendant' in factor.lower() or 'ownership' in factor.lower() or 'permission' in factor.lower():
                    reasoning_parts.append(f"• {factor}")
        
        # Add specific analysis based on case type
        if case_type == "property rights dispute":
            if 'my property' in defendant_lower or 'private property' in defendant_lower:
                reasoning_parts.append("• The defendant has clear and established property rights")
                reasoning_parts.append("• Property owners have the legal right to control access to their property")
            if 'without permission' in defendant_lower or 'never asked' in defendant_lower:
                reasoning_parts.append("• The plaintiff did not obtain proper authorization")
                reasoning_parts.append("• No permission was granted for the use or access")
        elif case_type == "contract or payment dispute":
            reasoning_parts.append("• The defendant has shown evidence of fulfilling their obligations")
            reasoning_parts.append("• The defendant's actions were within the terms of the agreement")
        elif 'fell on' in defendant_lower or 'natural' in defendant_lower:
            reasoning_parts.append("• The items came onto the defendant's property through natural means")
            reasoning_parts.append("• The defendant did not actively trespass or take from the plaintiff")
        
        reasoning_parts.append("")
        
    else:  # Neutral
        reasoning_parts.append("This case presents balanced arguments from both sides:")
        
        if key_factors:
            for i, factor in enumerate(key_factors[:3]):  # Show up to 3 key factors
                reasoning_parts.append(f"• {factor}")
        else:
            reasoning_parts.append("• Both parties have presented valid points")
            reasoning_parts.append("• The legal principles involved create ambiguity")
        
        reasoning_parts.append("• Additional evidence may be needed for a definitive ruling")
        reasoning_parts.append("• Further investigation or mediation is recommended")
        reasoning_parts.append("")
    
    # Emotional/Practical Consideration
    reasoning_parts.append("**Practical Consideration:**")
    
    if verdict == "Plaintiff":
        reasoning_parts.append("The court recognizes the harm or loss suffered by the plaintiff. ")
        if case_type == "property rights dispute":
            reasoning_parts.append("Property rights are fundamental and must be protected. ")
        elif case_type == "contract or payment dispute":
            reasoning_parts.append("Parties who pay for goods or services have a right to receive them as agreed. ")
        reasoning_parts.append("Justice requires a remedy for the plaintiff's legitimate grievances.")
    elif verdict == "Defendant":
        reasoning_parts.append("The court acknowledges the defendant's rights and position. ")
        if 'my property' in defendant_lower or 'private property' in defendant_lower:
            reasoning_parts.append("Property rights are fundamental legal principles that protect ownership and control. ")
            reasoning_parts.append("The defendant has a right to control access to and use of their property. ")
        elif 'fell on' in defendant_lower or 'natural' in defendant_lower:
            reasoning_parts.append("Natural occurrences that transfer property across boundaries create complex legal questions. ")
        reasoning_parts.append("The defendant's actions appear to be within their legal rights.")
    else:
        reasoning_parts.append("The court recognizes that both parties have legitimate concerns. ")
        reasoning_parts.append("This case involves competing legal principles that require careful balancing. ")
        reasoning_parts.append("A mediated settlement might serve the interests of justice better than an adversarial ruling.")
    
    reasoning_parts.append("")
    
    # Conclusion with specific reasoning
    reasoning_parts.append("**Conclusion:**")
    
    if verdict == "Plaintiff":
        reasoning_parts.append(f"Based on the analysis of this {case_type}, the plaintiff has presented ")
        reasoning_parts.append("the stronger legal arguments. Their rights have been infringed upon, and ")
        reasoning_parts.append("the evidence supports their claims. The court finds in favor of the Plaintiff.")
    elif verdict == "Defendant":
        reasoning_parts.append(f"Based on the analysis of this {case_type}, the defendant has demonstrated ")
        reasoning_parts.append("valid legal justifications for their actions. ")
        if 'property' in defendant_lower and 'my' in defendant_lower:
            reasoning_parts.append("The defendant's property rights are clear and well-established. ")
        reasoning_parts.append("The law supports the defendant's position in this matter.")
    else:
        reasoning_parts.append(f"Based on the analysis of this {case_type}, both parties present ")
        reasoning_parts.append("compelling arguments that make a clear determination difficult. ")
        reasoning_parts.append("A neutral finding reflects the legal complexity and ambiguity present. ")
        reasoning_parts.append("The parties are encouraged to seek mediation or provide additional evidence.")
    
    return "\n".join(reasoning_parts)


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "message": "The requested endpoint does not exist"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred"
    }), 500


if __name__ == '__main__':
    print("\n" + "-" * 50)
    print("🏛️  AI COURT BACKEND SERVER")
    print("-" * 50)
    
    # Get port from environment variable (for Render) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Determine if we're in production (Render sets this)
    is_production = os.environ.get('RENDER') is not None
    
    print(f"🖥️ Server starting on port {port}")
    print(f"🌍 Environment: {'Production' if is_production else 'Development'}")
    print(f"🤖 AI Model: {'Loaded' if AI_MODEL_AVAILABLE else 'Fallback'}")
    print(f"🧠 GenAI Reasoner: {'Active' if genai else 'Unavailable'}")
    print("-" * 50 + "\n")

    # Use 0.0.0.0 to accept connections from any IP (required for Render)
    app.run(debug=not is_production, host='0.0.0.0', port=port)
