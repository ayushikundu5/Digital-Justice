import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/case_data.dart';
import '../models/debate_room.dart';

class StorageService {
  static const String casesKey = 'cases';
  static const String userKey = 'user';
  static const String debateRoomsKey = 'debateRooms';

  // Save user
  static Future<void> saveUser(String email) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
        userKey, jsonEncode({'email': email, 'id': DateTime.now().toString()}));
  }

  // Get user
  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString(userKey);
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }

  // Clear user
  static Future<void> clearUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(userKey);
  }

  // Save cases
  static Future<void> saveCases(List<CaseData> cases) async {
    final prefs = await SharedPreferences.getInstance();
    final casesJson = cases.map((c) => c.toJson()).toList();
    await prefs.setString(casesKey, jsonEncode(casesJson));
  }

  // Get cases
  static Future<List<CaseData>> getCases() async {
    final prefs = await SharedPreferences.getInstance();
    final casesStr = prefs.getString(casesKey);
    if (casesStr != null) {
      final List<dynamic> casesList = jsonDecode(casesStr);
      return casesList.map((c) => CaseData.fromJson(c)).toList();
    }
    return [];
  }

  // Add case
  static Future<void> addCase(CaseData caseData) async {
    final cases = await getCases();
    cases.add(caseData);
    await saveCases(cases);
  }

  // Get case by ID
  static Future<CaseData?> getCaseById(String id) async {
    final cases = await getCases();
    try {
      return cases.firstWhere((c) => c.id == id);
    } catch (e) {
      return null;
    }
  }

  // Save debate rooms
  static Future<void> saveDebateRooms(List<DebateRoom> rooms) async {
    final prefs = await SharedPreferences.getInstance();
    final roomsJson = rooms.map((r) => r.toJson()).toList();
    await prefs.setString(debateRoomsKey, jsonEncode(roomsJson));
  }

  // Get debate rooms
  static Future<List<DebateRoom>> getDebateRooms() async {
    final prefs = await SharedPreferences.getInstance();
    final roomsStr = prefs.getString(debateRoomsKey);
    if (roomsStr != null) {
      final List<dynamic> roomsList = jsonDecode(roomsStr);
      return roomsList.map((r) => DebateRoom.fromJson(r)).toList();
    }
    return [];
  }

  // Add debate room
  static Future<void> addDebateRoom(DebateRoom room) async {
    final rooms = await getDebateRooms();
    rooms.add(room);
    await saveDebateRooms(rooms);
  }

  // Get debate room by code
  static Future<DebateRoom?> getDebateRoomByCode(String code) async {
    final rooms = await getDebateRooms();
    try {
      return rooms.firstWhere((r) => r.roomCode == code);
    } catch (e) {
      return null;
    }
  }
}
