import 'package:flutter/material.dart';
import '../services/storage_service.dart';
import '../models/case_data.dart';

class CaseDetailScreen extends StatefulWidget {
  final String caseId;

  const CaseDetailScreen({super.key, required this.caseId});

  @override
  State<CaseDetailScreen> createState() => _CaseDetailScreenState();
}

class _CaseDetailScreenState extends State<CaseDetailScreen> {
  CaseData? _caseData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCase();
  }

  Future<void> _loadCase() async {
    final caseData = await StorageService.getCaseById(widget.caseId);
    setState(() {
      _caseData = caseData;
      _isLoading = false;
    });
  }

  Color _getWinnerColor(String winner) {
    if (winner.toLowerCase() == 'plaintiff') return Colors.blue;
    if (winner.toLowerCase() == 'defendant') return Colors.red;
    return Colors.grey;
  }

  Color _getConfidenceColor(String confidence) {
    if (confidence.toLowerCase() == 'high') return Colors.green;
    if (confidence.toLowerCase() == 'medium') return Colors.orange;
    return Colors.red;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Case Details'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _caseData == null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64),
                      const SizedBox(height: 16),
                      Text(
                        'Case not found',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.gavel,
                            size: 40,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _caseData!.title,
                                  style: Theme.of(context).textTheme.headlineSmall,
                                ),
                                const SizedBox(height: 8),
                                Wrap(
                                  spacing: 8,
                                  runSpacing: 8,
                                  children: [
                                    Chip(
                                      label: Text('ID: ${_caseData!.id}'),
                                      labelStyle: const TextStyle(fontSize: 12),
                                    ),
                                    Chip(
                                      label: Text(_caseData!.status.toUpperCase()),
                                      labelStyle: const TextStyle(fontSize: 12),
                                      backgroundColor:
                                          _caseData!.status == 'resolved'
                                              ? Colors.green.withOpacity(0.2)
                                              : Colors.orange.withOpacity(0.2),
                                    ),
                                    Chip(
                                      label: Text(_formatDate(_caseData!.createdAt)),
                                      labelStyle: const TextStyle(fontSize: 12),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Plaintiff Statement
                      _buildStatementCard(
                        'Plaintiff Statement',
                        _caseData!.plaintiff,
                        Icons.person,
                        Colors.blue,
                      ),
                      const SizedBox(height: 16),

                      // Defendant Statement
                      _buildStatementCard(
                        'Defendant Statement',
                        _caseData!.defendant,
                        Icons.shield,
                        Colors.red,
                      ),
                      const SizedBox(height: 16),

                      // Evidence (if provided)
                      if (_caseData!.evidence != null &&
                          _caseData!.evidence!.isNotEmpty) ...[
                        _buildStatementCard(
                          'Additional Evidence',
                          _caseData!.evidence!,
                          Icons.description,
                          Colors.purple,
                        ),
                        const SizedBox(height: 16),
                      ],

                      // AI Verdict
                      if (_caseData!.verdict != null)
                        _buildVerdictCard()
                      else
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                const Icon(Icons.info_outline, size: 48),
                                const SizedBox(height: 12),
                                Text(
                                  'No Verdict Available',
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'This case does not have a verdict yet.',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildStatementCard(
    String title,
    String content,
    IconData icon,
    Color color,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              content,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVerdictCard() {
    final verdict = _caseData!.verdict!;

    return Card(
      elevation: 4,
      color: Theme.of(context).colorScheme.primaryContainer,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.gavel,
                  color: Theme.of(context).colorScheme.primary,
                  size: 28,
                ),
                const SizedBox(width: 8),
                Text(
                  'AI Judge Verdict',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Winner and Confidence
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Winner',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: _getWinnerColor(verdict.winner),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          verdict.winner,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Confidence',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: _getConfidenceColor(verdict.confidence),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          verdict.confidence.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Scores
            if (verdict.plaintiffScore != null ||
                verdict.defendantScore != null) ...[
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 16),
              Text(
                'Analysis Scores',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  if (verdict.plaintiffScore != null)
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.1),
                          border: Border.all(color: Colors.blue),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Plaintiff Score',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${verdict.plaintiffScore}',
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineMedium
                                  ?.copyWith(
                                    color: Colors.blue,
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  const SizedBox(width: 12),
                  if (verdict.defendantScore != null)
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.1),
                          border: Border.all(color: Colors.red),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Defendant Score',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${verdict.defendantScore}',
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineMedium
                                  ?.copyWith(
                                    color: Colors.red,
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ],

            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),

            // Reasoning
            Row(
              children: [
                const Icon(Icons.description, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Legal Reasoning',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: Theme.of(context).colorScheme.outline,
                ),
              ),
              child: Text(
                verdict.reasoning,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),

            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 8),

            // AI Model Info
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Verdict Model',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      Text(
                        verdict.model,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ],
                  ),
                ),
                if (verdict.reasoningModel != null)
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Reasoning Model',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        Text(
                          verdict.reasoningModel!,
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    fontFamily: 'monospace',
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
