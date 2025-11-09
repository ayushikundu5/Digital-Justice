import 'package:flutter/material.dart';
import '../services/storage_service.dart';
import '../models/case_data.dart';

class CasesScreen extends StatefulWidget {
  const CasesScreen({super.key});

  @override
  State<CasesScreen> createState() => _CasesScreenState();
}

class _CasesScreenState extends State<CasesScreen> {
  List<CaseData> _cases = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCases();
  }

  Future<void> _loadCases() async {
    setState(() => _isLoading = true);
    final cases = await StorageService.getCases();
    setState(() {
      _cases = cases.reversed.toList();
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cases'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.of(context).pushNamed('/cases/new');
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadCases,
              child: _cases.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _cases.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _buildCaseCard(_cases[index]),
                        );
                      },
                    ),
            ),
    );
  }

  Widget _buildCaseCard(CaseData caseData) {
    return Card(
      child: InkWell(
        onTap: () {
          Navigator.of(context).pushNamed('/cases/${caseData.id}')
              .then((_) => _loadCases());
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      caseData.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: caseData.status == 'resolved'
                          ? Colors.green.withOpacity(0.2)
                          : Colors.orange.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      caseData.status == 'resolved' ? 'Resolved' : 'Pending',
                      style: TextStyle(
                        fontSize: 12,
                        color: caseData.status == 'resolved'
                            ? Colors.green.shade700
                            : Colors.orange.shade700,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Filed: ${_formatDate(caseData.createdAt)}',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
              if (caseData.verdict != null) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.gavel, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      'Winner: ${caseData.verdict!.winner}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.folder_open,
              size: 100,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            const SizedBox(height: 24),
            Text(
              'No Cases Found',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Create your first case to get started',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pushNamed('/cases/new');
              },
              icon: const Icon(Icons.add),
              label: const Text('Create New Case'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Theme.of(context).colorScheme.onPrimary,
              ),
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
