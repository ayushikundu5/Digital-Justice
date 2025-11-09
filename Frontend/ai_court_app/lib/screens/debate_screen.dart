import 'package:flutter/material.dart';

class DebateScreen extends StatelessWidget {
  const DebateScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Debate'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Icon(
              Icons.chat,
              size: 64,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 16),
            Text(
              'Live Debate',
              style: Theme.of(context).textTheme.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Engage in real-time legal debates with another user. Present your arguments, counter each other\'s claims, and let AI judge the outcome.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),

            // Features
            Row(
              children: [
                Expanded(
                  child: _buildFeatureCard(
                    context,
                    Icons.people,
                    '2-Player Mode',
                    'Real-time interaction',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFeatureCard(
                    context,
                    Icons.flash_on,
                    'AI Judgment',
                    'Unbiased verdict',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildFeatureCard(
              context,
              Icons.chat_bubble,
              'Structured Debate',
              'Turn-based arguments',
            ),
            const SizedBox(height: 32),

            // Start Debate Button
            Card(
              elevation: 4,
              child: InkWell(
                onTap: () {
                  Navigator.of(context).pushNamed('/debate/start');
                },
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primaryContainer,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.add_circle,
                          size: 48,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Start a Debate',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Create a new debate room and invite an opponent',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).pushNamed('/debate/start');
                        },
                        icon: const Icon(Icons.add),
                        label: const Text('Create Debate Room'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).colorScheme.primary,
                          foregroundColor: Theme.of(context).colorScheme.onPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Join Debate Button
            Card(
              elevation: 4,
              child: InkWell(
                onTap: () {
                  Navigator.of(context).pushNamed('/debate/join');
                },
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.login,
                          size: 48,
                          color: Colors.green,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Join a Debate',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Enter a room code to join an existing debate',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).pushNamed('/debate/join');
                        },
                        icon: const Icon(Icons.login),
                        label: const Text('Join Debate Room'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // How It Works
            Card(
              color: Theme.of(context).colorScheme.surfaceVariant,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'How It Works',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 16),
                    _buildHowItWorksStep(context, '1', 'Create or Join',
                        'Start a debate room or join using a 6-digit code'),
                    _buildHowItWorksStep(context, '2', 'Present Arguments',
                        'Both parties present their case: Plaintiff vs. Defendant'),
                    _buildHowItWorksStep(context, '3', 'Submit to AI',
                        'Once both parties submit, AI analyzes and renders verdict'),
                    _buildHowItWorksStep(context, '4', 'View Results',
                        'Get comprehensive AI judgment with detailed reasoning'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureCard(
    BuildContext context,
    IconData icon,
    String title,
    String description,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 32, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              description,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHowItWorksStep(
    BuildContext context,
    String number,
    String title,
    String description,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
