import 'package:flutter/material.dart';
import '../services/storage_service.dart';

class DebateJoinScreen extends StatefulWidget {
  const DebateJoinScreen({super.key});

  @override
  State<DebateJoinScreen> createState() => _DebateJoinScreenState();
}

class _DebateJoinScreenState extends State<DebateJoinScreen> {
  final _codeController = TextEditingController();
  bool _isJoining = false;
  String? _errorMessage;

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _joinRoom() async {
    if (_codeController.text.length != 6) {
      setState(() => _errorMessage = 'Please enter a valid 6-digit room code');
      return;
    }

    setState(() {
      _isJoining = true;
      _errorMessage = null;
    });

    try {
      final room = await StorageService.getDebateRoomByCode(_codeController.text);

      if (room == null) {
        setState(() {
          _errorMessage = 'Room not found. Please check the code and try again.';
        });
        return;
      }

      if (room.status == 'completed') {
        setState(() {
          _errorMessage = 'This debate has already been completed.';
        });
        return;
      }

      // Successfully found room
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Room found! Joining...'),
            backgroundColor: Colors.green,
          ),
        );

        await Future.delayed(const Duration(milliseconds: 500));

        // In a real app, this would navigate to a debate room screen
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Success'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Joined debate room: ${room.caseTitle}'),
                const SizedBox(height: 8),
                Text('Your role: ${room.creatorRole == "plaintiff" ? "Defendant" : "Plaintiff"}'),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.of(context).pop();
                },
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isJoining = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Join a Debate'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.login,
                size: 64,
                color: Colors.green,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Join a Debate',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Enter the 6-digit room code shared by your opponent',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),

            if (_errorMessage != null)
              Card(
                color: Colors.red.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(Icons.error, color: Colors.red.shade700),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _errorMessage!,
                          style: TextStyle(color: Colors.red.shade700),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            if (_errorMessage != null) const SizedBox(height: 16),

            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Text(
                      'Room Code',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _codeController,
                      decoration: const InputDecoration(
                        hintText: '000000',
                        prefixIcon: Icon(Icons.key),
                      ),
                      textAlign: TextAlign.center,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontFamily: 'monospace',
                            letterSpacing: 8,
                          ),
                      onChanged: (value) {
                        if (value.length == 6) {
                          FocusScope.of(context).unfocus();
                        }
                        setState(() => _errorMessage = null);
                      },
                      onSubmitted: (_) {
                        if (_codeController.text.length == 6) {
                          _joinRoom();
                        }
                      },
                    ),
                    Text(
                      '${_codeController.text.length}/6 digits entered',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _isJoining || _codeController.text.length != 6
                    ? null
                    : _joinRoom,
                icon: _isJoining
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.login),
                label: Text(_isJoining ? 'Joining...' : 'Join Debate Room'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
            const SizedBox(height: 24),

            Card(
              color: Theme.of(context).colorScheme.surfaceVariant,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.info_outline, size: 20),
                        SizedBox(width: 8),
                        Text(
                          '💡 How to Join:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      '1. Get the 6-digit room code from the debate creator\n'
                      '2. Enter the code above\n'
                      '3. Click "Join Debate Room"\n'
                      '4. You\'ll be assigned the opposing role automatically',
                      style: TextStyle(fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Back to Debate Home'),
            ),
          ],
        ),
      ),
    );
  }
}
