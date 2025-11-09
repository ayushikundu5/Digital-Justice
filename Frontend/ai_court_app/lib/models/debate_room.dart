class DebateRoom {
  final String roomCode;
  final String caseTitle;
  final String caseDescription;
  final String creatorRole;
  final DateTime createdAt;
  final String status;
  final String? plaintiff;
  final String? defendant;

  DebateRoom({
    required this.roomCode,
    required this.caseTitle,
    required this.caseDescription,
    required this.creatorRole,
    required this.createdAt,
    required this.status,
    this.plaintiff,
    this.defendant,
  });

  Map<String, dynamic> toJson() => {
        'roomCode': roomCode,
        'caseTitle': caseTitle,
        'caseDescription': caseDescription,
        'creatorRole': creatorRole,
        'createdAt': createdAt.toIso8601String(),
        'status': status,
        'plaintiff': plaintiff,
        'defendant': defendant,
      };

  factory DebateRoom.fromJson(Map<String, dynamic> json) => DebateRoom(
        roomCode: json['roomCode'],
        caseTitle: json['caseTitle'],
        caseDescription: json['caseDescription'],
        creatorRole: json['creatorRole'],
        createdAt: DateTime.parse(json['createdAt']),
        status: json['status'],
        plaintiff: json['plaintiff'],
        defendant: json['defendant'],
      );
}
