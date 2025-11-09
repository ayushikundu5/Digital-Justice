import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Backend URL - Now using deployed Render backend
  // This works from anywhere with internet connection!
  static const String baseUrl = 'https://digital-justice-wss7.onrender.com';

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
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to submit case: ${response.statusCode}');
      }
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
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to generate reasoning: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to generate reasoning: $e');
    }
  }

  // Check backend health
  static Future<bool> checkBackendHealth() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/health'));
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
