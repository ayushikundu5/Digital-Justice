const API_BASE_URL = 'http://localhost:5000';

export interface CaseSubmission {
  plaintiff: string;
  defendant: string;
  evidence?: string;
}

export interface VerdictResponse {
  winner: string;
  reasoning?: string;
  confidence: string;
  model: string;
  plaintiff_score?: number;
  defendant_score?: number;
}

export interface GenAIReasoningRequest {
  plaintiff: string;
  defendant: string;
  evidence?: string;
  verdict: string;
}

export interface GenAIReasoningResponse {
  reasoning: string;
  model: string;
}

export const submitCase = async (caseData: CaseSubmission): Promise<VerdictResponse> => {
  const response = await fetch(`${API_BASE_URL}/verdict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plaintiff: caseData.plaintiff,
      defendant: caseData.defendant,
      evidence: caseData.evidence || '',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit case');
  }

  return response.json();
};

export const generateReasoning = async (data: GenAIReasoningRequest): Promise<GenAIReasoningResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/genai_reason`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plaintiff: data.plaintiff,
      defendant: data.defendant,
      evidence: data.evidence || '',
      verdict: data.verdict,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate reasoning');
  }

  return response.json();
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
