import 'dart:convert';
import 'dart:async';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiService {
  // Backend URL - Now using deployed Render backend
  // This works from anywhere with internet connection!
  static const String baseUrl = 'https://digital-justice-wss7.onrender.com';
  
  // Timeout durations
  static const Duration connectionTimeout = Duration(seconds: 90); // Longer for cold starts
  static const Duration receiveTimeout = Duration(seconds: 60);

  // Submit case for verdict
  static Future<Map<String, dynamic>> submitCase({
    required String plaintiff,
    required String defendant,
    String? evidence,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verdict'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'plaintiff': plaintiff,
          'defendant': defendant,
          'evidence': evidence ?? '',
        }),
      ).timeout(
        connectionTimeout,
        onTimeout: () {
          throw TimeoutException(
            'Connection timeout. The backend may be starting up (cold start). Please try again in a moment.',
          );
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to submit case: ${response.statusCode}');
      }
    } on TimeoutException catch (e) {
      throw Exception('Request timeout: ${e.message}. The backend may be waking up, please wait 30-60 seconds and try again.');
    } on SocketException catch (e) {
      throw Exception('Network error: Unable to connect to backend. Please check your internet connection and try again. Error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to connect to backend: $e');
    }
  }

  // Generate reasoning using GenAI
  static Future<Map<String, dynamic>> generateReasoning({
    required String plaintiff,
    required String defendant,
    String? evidence,
    required String verdict,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/genai_reason'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'plaintiff': plaintiff,
          'defendant': defendant,
          'evidence': evidence ?? '',
          'verdict': verdict,
        }),
      ).timeout(
        receiveTimeout,
        onTimeout: () {
          throw TimeoutException('Request timeout while generating reasoning');
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to generate reasoning: ${response.statusCode}');
      }
    } on TimeoutException catch (e) {
      throw Exception('Request timeout: ${e.message}');
    } on SocketException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to generate reasoning: $e');
    }
  }

  // Check backend health with retry logic
  static Future<bool> checkBackendHealth({int maxRetries = 3}) async {
    for (int i = 0; i < maxRetries; i++) {
      try {
        final response = await http.get(
          Uri.parse('$baseUrl/health'),
        ).timeout(
          Duration(seconds: 30),
        );
        
        if (response.statusCode == 200) {
          return true;
        }
      } catch (e) {
        if (i == maxRetries - 1) {
          return false;
        }
        // Wait before retrying
        await Future.delayed(Duration(seconds: 2));
      }
    }
    return false;
  }
  
  // Wake up the backend (useful for cold starts)
  static Future<void> wakeUpBackend() async {
    try {
      await http.get(Uri.parse('$baseUrl/')).timeout(Duration(seconds: 60));
    } catch (e) {
      // Ignore errors, this is just to wake up the backend
    }
  }
}
