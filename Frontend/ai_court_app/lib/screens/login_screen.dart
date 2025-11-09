import 'package:flutter/material.dart';
import '../services/storage_service.dart';
import '../main.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter email and password')),
      );
      return;
    }

    setState(() => _isLoading = true);

    // Simulate login delay
    await Future.delayed(const Duration(milliseconds: 500));

    await StorageService.saveUser(_emailController.text);

    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).colorScheme.primary.withOpacity(0.1),
              Theme.of(context).colorScheme.secondary.withOpacity(0.1),
            ],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Theme toggle button in top right
              Positioned(
                top: 16,
                right: 16,
                child: IconButton(
                  icon: Icon(
                    isDarkMode ? Icons.light_mode : Icons.dark_mode,
                    size: 28,
                  ),
                  onPressed: () {
                    final appState = MyApp.of(context);
                    if (appState != null) {
                      appState.toggleTheme();
                    }
                  },
                  tooltip: isDarkMode ? 'Light Mode' : 'Dark Mode',
                  style: IconButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.surface.withOpacity(0.8),
                  ),
                ),
              ),
              
              // Main content
              Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 400),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Logo and Title
                        Icon(
                          Icons.gavel,
                          size: 64,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'AI Court',
                          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                        ),
                        const SizedBox(height: 48),

                        // Login Card
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  'Welcome to AI Court',
                                  style: Theme.of(context).textTheme.headlineSmall,
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Sign in to access the legal simulation platform',
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                                      ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 32),

                                // Email Field
                                TextField(
                                  controller: _emailController,
                                  decoration: const InputDecoration(
                                    labelText: 'Email',
                                    hintText: 'your@email.com',
                                    prefixIcon: Icon(Icons.email),
                                  ),
                                  keyboardType: TextInputType.emailAddress,
                                  textInputAction: TextInputAction.next,
                                ),
                                const SizedBox(height: 16),

                                // Password Field
                                TextField(
                                  controller: _passwordController,
                                  decoration: const InputDecoration(
                                    labelText: 'Password',
                                    hintText: '••••••••',
                                    prefixIcon: Icon(Icons.lock),
                                  ),
                                  obscureText: true,
                                  textInputAction: TextInputAction.done,
                                  onSubmitted: (_) => _handleLogin(),
                                ),
                                const SizedBox(height: 24),

                                // Login Button
                                ElevatedButton(
                                  onPressed: _isLoading ? null : _handleLogin,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Theme.of(context).colorScheme.primary,
                                    foregroundColor: Theme.of(context).colorScheme.onPrimary,
                                  ),
                                  child: _isLoading
                                      ? const SizedBox(
                                          height: 20,
                                          width: 20,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: Colors.white,
                                          ),
                                        )
                                      : const Text('Sign In'),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Demo Info
                        Text(
                          'Demo mode: Use any email/password to continue',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
