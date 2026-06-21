import 'package:flutter/material.dart';
import '../models/salon.dart';
import '../models/service.dart';
import '../models/working_hours.dart';
import '../models/slot.dart';
import '../services/salon_service.dart' as svc_api;

class SalonProvider extends ChangeNotifier {
  final svc_api.SalonService _salonService = svc_api.SalonService();

  List<Salon> _nearbySalons = [];
  List<Salon> _searchResults = [];
  Salon? _selectedSalon;
  List<SalonService> _salonServices = [];
  List<WorkingHours> _workingHours = [];
  List<TimeSlot> _availableSlots = [];
  SlotConfig? _slotConfig;
  bool _isLoading = false;
  String? _error;

  List<Salon> get nearbySalons => _nearbySalons;
  List<Salon> get searchResults => _searchResults;
  Salon? get selectedSalon => _selectedSalon;
  List<SalonService> get salonServices => _salonServices;
  List<WorkingHours> get workingHours => _workingHours;
  List<TimeSlot> get availableSlots => _availableSlots;
  SlotConfig? get slotConfig => _slotConfig;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchNearbySalons(double lat, double lng) async {
    _isLoading = true;
    notifyListeners();
    try {
      _nearbySalons = await _salonService.getNearbySalons(lat, lng);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> searchSalons(String query) async {
    _isLoading = true;
    notifyListeners();
    try {
      _searchResults = await _salonService.searchSalons(query);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> selectSalon(String id) async {
    _isLoading = true;
    notifyListeners();
    try {
      _selectedSalon = await _salonService.getSalonById(id);
      _salonServices = await _salonService.getSalonServices(id);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchWorkingHours(String salonId) async {
    try {
      _workingHours = await _salonService.getWorkingHours(salonId);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<void> fetchAvailableSlots(String salonId, DateTime date) async {
    try {
      _availableSlots = await _salonService.getAvailableSlots(salonId, date);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<void> fetchSlotConfig(String salonId) async {
    try {
      _slotConfig = await _salonService.getSlotConfig(salonId);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  void clearSelectedSalon() {
    _selectedSalon = null;
    _salonServices = [];
    _workingHours = [];
    _availableSlots = [];
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
