import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/storage_service.dart';
import '../models/debate_room.dart';

class DebateStartScreen extends StatefulWidget {
  const DebateStartScreen({super.key});

  @override
  State<DebateStartScreen> createState() => _DebateStartScreenState();
}

class _DebateStartScreenState extends State<DebateStartScreen> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _role = 'plaintiff';
  String? _roomCode;
  bool _isCreated = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  String _generateRoomCode() {
    final random = Random();
    return (100000 + random.nextInt(900000)).toString();
  }

  Future<void> _createRoom() async {
    if (_titleController.text.trim().isEmpty ||
        _descriptionController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }

    final code = _generateRoomCode();
    final room = DebateRoom(
      roomCode: code,
      caseTitle: _titleController.text,
      caseDescription: _descriptionController.text,
      creatorRole: _role,
      createdAt: DateTime.now(),
      status: 'waiting',
    );

    await StorageService.addDebateRoom(room);

    setState(() {
      _roomCode = code;
      _isCreated = true;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Debate room created!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _copyCode() {
    if (_roomCode != null) {
      Clipboard.setData(ClipboardData(text: _roomCode!));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Room code copied to clipboard!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isCreated) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Room Created'),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(
                Icons.check_circle,
                size: 80,
                color: Colors.green,
              ),
              const SizedBox(height: 24),
              Text(
                'Room Created!',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'Share this code with your opponent',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 32),
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Text(
                        'Room Code',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _roomCode!,
                            style: Theme.of(context).textTheme.displaySmall?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  fontFamily: 'monospace',
                                ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.copy),
                            onPressed: _copyCode,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Case Title',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      Text(
                        _titleController.text,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Your Role',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      Text(
                        _role == 'plaintiff' ? '👤 Plaintiff' : '🛡️ Defendant',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Card(
                color: Theme.of(context).colorScheme.primaryContainer,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: const [
                      Text(
                        '📋 Next Steps:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Text(
                        '1. Share the room code with your opponent\n'
                        '2. They should click "Join Debate" and enter this code\n'
                        '3. Once they join, you can both enter the debate room\n'
                        '4. Present your arguments and submit to AI for judgment',
                        style: TextStyle(fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor: Theme.of(context).colorScheme.onPrimary,
                  ),
                  child: const Text('Back to Debate Home'),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Start a Debate'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Icon(
              Icons.add_circle,
              size: 64,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 16),
            Text(
              'Start a Debate',
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Set up your case topic and get a room code to share',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      controller: _titleController,
                      decoration: const InputDecoration(
                        labelText: 'Case Title *',
                        hintText: 'e.g., Contract Breach Dispute',
                        prefixIcon: Icon(Icons.title),
                      ),
                      maxLength: 100,
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _descriptionController,
                      decoration: const InputDecoration(
                        labelText: 'Case Description *',
                        hintText: 'Provide background and context for the case...',
                        prefixIcon: Icon(Icons.description),
                        alignLabelWithHint: true,
                      ),
                      maxLines: 4,
                      maxLength: 500,
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Your Role *',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _role = 'plaintiff'),
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: _role == 'plaintiff'
                                      ? Colors.blue
                                      : Colors.grey,
                                  width: 2,
                                ),
                                borderRadius: BorderRadius.circular(12),
                                color: _role == 'plaintiff'
                                    ? Colors.blue.withOpacity(0.1)
                                    : null,
                              ),
                              child: Column(
                                children: const [
                                  Text('👤', style: TextStyle(fontSize: 32)),
                                  SizedBox(height: 8),
                                  Text(
                                    'Plaintiff',
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    'Bringing the claim',
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _role = 'defendant'),
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: _role == 'defendant'
                                      ? Colors.red
                                      : Colors.grey,
                                  width: 2,
                                ),
                                borderRadius: BorderRadius.circular(12),
                                color: _role == 'defendant'
                                    ? Colors.red.withOpacity(0.1)
                                    : null,
                              ),
                              child: Column(
                                children: const [
                                  Text('🛡️', style: TextStyle(fontSize: 32)),
                                  SizedBox(height: 8),
                                  Text(
                                    'Defendant',
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    'Defending the claim',
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _createRoom,
              icon: const Icon(Icons.add),
              label: const Text('Create Debate Room'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Theme.of(context).colorScheme.onPrimary,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
