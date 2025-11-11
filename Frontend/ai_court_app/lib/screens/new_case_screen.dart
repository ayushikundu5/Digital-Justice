import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../models/case_data.dart';

class NewCaseScreen extends StatefulWidget {
  const NewCaseScreen({super.key});

  @override
  State<NewCaseScreen> createState() => _NewCaseScreenState();
}

class _NewCaseScreenState extends State<NewCaseScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _plaintiffController = TextEditingController();
  final _defendantController = TextEditingController();
  final _evidenceController = TextEditingController();
  bool _isLoading = false;
  bool _backendError = false;
  bool _checkingBackend = true;
  String _backendStatus = 'Checking backend connection...';

  @override
  void initState() {
    super.initState();
    _checkBackendConnection();
  }

  Future<void> _checkBackendConnection() async {
    setState(() {
      _checkingBackend = true;
      _backendStatus = 'Waking up backend server...';
      _backendError = false;
    });

    try {
      // First, try to wake up the backend
      await ApiService.wakeUpBackend();
      
      // Wait a moment for it to start
      await Future.delayed(const Duration(seconds: 2));
      
      // Check if backend is healthy
      final isHealthy = await ApiService.checkBackendHealth(maxRetries: 3);
      
      if (mounted) {
        setState(() {
          _checkingBackend = false;
          if (isHealthy) {
            _backendStatus = 'Backend connected successfully!';
            _backendError = false;
            // Clear success message after 3 seconds
            Future.delayed(const Duration(seconds: 3), () {
              if (mounted) {
                setState(() => _backendStatus = '');
              }
            });
          } else {
            _backendStatus = 'Backend connection failed. It may be starting up - please wait 30-60 seconds and try submitting.';
            _backendError = true;
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _checkingBackend = false;
          _backendStatus = 'Could not reach backend. Please check your internet connection.';
          _backendError = true;
        });
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _plaintiffController.dispose();
    _defendantController.dispose();
    _evidenceController.dispose();
    super.dispose();
  }

  Future<void> _submitCase() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _backendError = false;
      _backendStatus = 'Submitting case to AI backend...';
    });

    try {
      // Step 1: Submit case to get verdict
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Analyzing case with AI...')),
      );

      final verdictResponse = await ApiService.submitCase(
        plaintiff: _plaintiffController.text,
        defendant: _defendantController.text,
        evidence: _evidenceController.text,
      );

      // Step 2: Generate detailed reasoning
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Generating detailed reasoning...')),
      );

      final reasoningResponse = await ApiService.generateReasoning(
        plaintiff: _plaintiffController.text,
        defendant: _defendantController.text,
        evidence: _evidenceController.text,
        verdict: verdictResponse['winner'],
      );

      // Step 3: Create case object
      final caseData = CaseData(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleController.text,
        plaintiff: _plaintiffController.text,
        defendant: _defendantController.text,
        evidence: _evidenceController.text,
        verdict: CaseVerdict(
          winner: verdictResponse['winner'],
          reasoning: reasoningResponse['reasoning'],
          confidence: verdictResponse['confidence'],
          model: verdictResponse['model'],
          plaintiffScore: verdictResponse['plaintiff_score'],
          defendantScore: verdictResponse['defendant_score'],
          reasoningModel: reasoningResponse['model'],
        ),
        status: 'resolved',
        createdAt: DateTime.now(),
      );

      // Step 4: Save to storage
      await StorageService.addCase(caseData);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Case submitted and verdict generated!'),
            backgroundColor: Colors.green,
          ),
        );

        // Navigate to case details
        await Future.delayed(const Duration(milliseconds: 500));
        Navigator.of(context).pushReplacementNamed('/cases/${caseData.id}');
      }
    } catch (e) {
      setState(() {
        _backendError = true;
        _backendStatus = e.toString().replaceFirst('Exception: ', '');
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to submit case: ${e.toString()}'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 5),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create New Case'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _checkingBackend ? null : _checkBackendConnection,
            tooltip: 'Retry backend connection',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.gavel,
                    size: 32,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Create New Case',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        Text(
                          'Submit a legal case for AI-powered judgment',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Backend status message
              if (_backendStatus.isNotEmpty)
                Card(
                  color: _backendError 
                      ? Colors.red.shade50 
                      : _checkingBackend 
                          ? Colors.blue.shade50 
                          : Colors.green.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        if (_checkingBackend)
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.blue.shade700,
                            ),
                          )
                        else
                          Icon(
                            _backendError ? Icons.error : Icons.check_circle,
                            color: _backendError 
                                ? Colors.red.shade700 
                                : Colors.green.shade700,
                          ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _backendStatus,
                            style: TextStyle(
                              color: _backendError 
                                  ? Colors.red.shade700 
                                  : _checkingBackend 
                                      ? Colors.blue.shade700 
                                      : Colors.green.shade700,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              if (_backendStatus.isNotEmpty) const SizedBox(height: 16),

              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Case Information',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),

                      // Case Title
                      TextFormField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          labelText: 'Case Title *',
                          hintText: 'e.g., Smith vs. Johnson - Contract Dispute',
                          prefixIcon: Icon(Icons.title),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter a case title';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Plaintiff Statement
                      TextFormField(
                        controller: _plaintiffController,
                        decoration: const InputDecoration(
                          labelText: 'Plaintiff Statement *',
                          hintText:
                              'Enter the plaintiff\'s arguments, claims, and perspective...',
                          prefixIcon: Icon(Icons.person),
                          alignLabelWithHint: true,
                        ),
                        maxLines: 5,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter plaintiff statement';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Defendant Statement
                      TextFormField(
                        controller: _defendantController,
                        decoration: const InputDecoration(
                          labelText: 'Defendant Statement *',
                          hintText:
                              'Enter the defendant\'s defense, counter-arguments, and perspective...',
                          prefixIcon: Icon(Icons.shield),
                          alignLabelWithHint: true,
                        ),
                        maxLines: 5,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter defendant statement';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Evidence
                      TextFormField(
                        controller: _evidenceController,
                        decoration: const InputDecoration(
                          labelText: 'Additional Evidence (Optional)',
                          hintText:
                              'Enter any additional evidence, documents, witness statements...',
                          prefixIcon: Icon(Icons.description),
                          alignLabelWithHint: true,
                        ),
                        maxLines: 4,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: _isLoading ? null : _submitCase,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Theme.of(context).colorScheme.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoading
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(width: 12),
                          Text('Processing with AI...'),
                        ],
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.gavel),
                          SizedBox(width: 8),
                          Text('Submit Case for AI Judgment'),
                        ],
                      ),
              ),
              const SizedBox(height: 12),

              Text(
                'The AI will analyze the case and generate a verdict with detailed reasoning',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
