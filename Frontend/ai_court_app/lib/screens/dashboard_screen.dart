import 'package:flutter/material.dart';
import '../services/storage_service.dart';
import '../models/case_data.dart';
import 'package:intl/intl.dart';
import '../main.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
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
      _cases = cases;
      _isLoading = false;
    });
  }

  int get _totalCases => _cases.length;
  int get _pendingCases =>
      _cases.where((c) => c.status == 'pending').length;
  int get _completedCases =>
      _cases.where((c) => c.status == 'resolved').length;

  List<CaseData> get _recentCases =>
      _cases.reversed.take(3).toList();

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: Icon(isDarkMode ? Icons.light_mode : Icons.dark_mode),
            onPressed: () {
              final appState = MyApp.of(context);
              if (appState != null) {
                appState.toggleTheme();
              }
            },
            tooltip: isDarkMode ? 'Light Mode' : 'Dark Mode',
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadCases,
          ),
        ],
      ),
      drawer: _buildDrawer(),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadCases,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome to AI Court',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Manage your legal cases',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                    const SizedBox(height: 24),

                    // Stats Cards
                    Row(
                      children: [
                        Expanded(
                          child: _buildStatCard(
                            'Total Cases',
                            _totalCases.toString(),
                            Icons.description,
                            Colors.blue,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildStatCard(
                            'Pending',
                            _pendingCases.toString(),
                            Icons.schedule,
                            Colors.orange,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildStatCard(
                            'Completed',
                            _completedCases.toString(),
                            Icons.check_circle,
                            Colors.green,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    // Recent Cases Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Recent Cases',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        TextButton.icon(
                          onPressed: () {
                            Navigator.of(context).pushNamed('/cases/new');
                          },
                          icon: const Icon(Icons.add),
                          label: const Text('New Case'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    if (_recentCases.isEmpty)
                      _buildEmptyState()
                    else
                      ..._recentCases.map((caseData) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: _buildCaseCard(caseData),
                          )),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 12),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCaseCard(CaseData caseData) {
    return Card(
      child: InkWell(
        onTap: () {
          Navigator.of(context).pushNamed('/cases/${caseData.id}');
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
                      caseData.status == 'resolved' ? 'Completed' : 'Pending',
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
                'ID: ${caseData.id}',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(
              Icons.gavel,
              size: 64,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            const SizedBox(height: 16),
            Text(
              'No cases yet',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Create a new case to get started',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pushNamed('/cases/new');
              },
              icon: const Icon(Icons.add),
              label: const Text('Create First Case'),
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

  Widget _buildDrawer() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                const Icon(Icons.gavel, size: 48, color: Colors.white),
                const SizedBox(height: 8),
                const Text(
                  'AI Court',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.of(context).pop();
            },
          ),
          ListTile(
            leading: const Icon(Icons.folder),
            title: const Text('Cases'),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).pushNamed('/cases');
            },
          ),
          ListTile(
            leading: const Icon(Icons.add_circle),
            title: const Text('New Case'),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).pushNamed('/cases/new');
            },
          ),
          ListTile(
            leading: const Icon(Icons.chat),
            title: const Text('Debate'),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).pushNamed('/debate');
            },
          ),
          const Divider(),
          ListTile(
            leading: Icon(isDarkMode ? Icons.light_mode : Icons.dark_mode),
            title: Text(isDarkMode ? 'Light Mode' : 'Dark Mode'),
            onTap: () {
              final appState = MyApp.of(context);
              if (appState != null) {
                appState.toggleTheme();
              }
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () async {
              await StorageService.clearUser();
              if (mounted) {
                Navigator.of(context).pushReplacementNamed('/');
              }
            },
          ),
        ],
      ),
    );
  }
}
