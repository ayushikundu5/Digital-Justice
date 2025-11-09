class CaseData {
  final String id;
  final String title;
  final String plaintiff;
  final String defendant;
  final String? evidence;
  final CaseVerdict? verdict;
  final String status;
  final DateTime createdAt;

  CaseData({
    required this.id,
    required this.title,
    required this.plaintiff,
    required this.defendant,
    this.evidence,
    this.verdict,
    required this.status,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'plaintiff': plaintiff,
        'defendant': defendant,
        'evidence': evidence,
        'verdict': verdict?.toJson(),
        'status': status,
        'createdAt': createdAt.toIso8601String(),
      };

  factory CaseData.fromJson(Map<String, dynamic> json) => CaseData(
        id: json['id'],
        title: json['title'],
        plaintiff: json['plaintiff'],
        defendant: json['defendant'],
        evidence: json['evidence'],
        verdict: json['verdict'] != null
            ? CaseVerdict.fromJson(json['verdict'])
            : null,
        status: json['status'],
        createdAt: DateTime.parse(json['createdAt']),
      );
}

class CaseVerdict {
  final String winner;
  final String reasoning;
  final String confidence;
  final String model;
  final int? plaintiffScore;
  final int? defendantScore;
  final String? reasoningModel;

  CaseVerdict({
    required this.winner,
    required this.reasoning,
    required this.confidence,
    required this.model,
    this.plaintiffScore,
    this.defendantScore,
    this.reasoningModel,
  });

  Map<String, dynamic> toJson() => {
        'winner': winner,
        'reasoning': reasoning,
        'confidence': confidence,
        'model': model,
        'plaintiff_score': plaintiffScore,
        'defendant_score': defendantScore,
        'reasoning_model': reasoningModel,
      };

  factory CaseVerdict.fromJson(Map<String, dynamic> json) => CaseVerdict(
        winner: json['winner'],
        reasoning: json['reasoning'],
        confidence: json['confidence'],
        model: json['model'],
        plaintiffScore: json['plaintiff_score'],
        defendantScore: json['defendant_score'],
        reasoningModel: json['reasoning_model'],
      );
}
