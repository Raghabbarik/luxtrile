import 'package:flutter/material.dart';
import '../models/booking.dart';
import '../services/booking_service.dart';

class BookingProvider extends ChangeNotifier {
  final BookingService _bookingService = BookingService();

  List<Booking> _myBookings = [];
  List<Booking> _salonBookings = [];
  Booking? _currentBooking;
  bool _isLoading = false;
  String? _error;

  List<Booking> get myBookings => _myBookings;
  List<Booking> get salonBookings => _salonBookings;
  Booking? get currentBooking => _currentBooking;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<Booking?> createBooking(Map<String, dynamic> data) async {
    _isLoading = true;
    notifyListeners();
    try {
      _currentBooking = await _bookingService.createBooking(data);
      _error = null;
      _isLoading = false;
      notifyListeners();
      return _currentBooking;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  Future<void> fetchMyBookings({String? status}) async {
    _isLoading = true;
    notifyListeners();
    try {
      _myBookings = await _bookingService.getMyBookings(status: status);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchSalonBookings(String salonId, {String? status}) async {
    _isLoading = true;
    notifyListeners();
    try {
      _salonBookings = await _bookingService.getSalonBookings(salonId, status: status);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> cancelBooking(String id) async {
    try {
      _currentBooking = await _bookingService.cancelBooking(id);
      final index = _myBookings.indexWhere((b) => b.id == id);
      if (index != -1) {
        _myBookings[index] = _currentBooking!;
      }
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateBookingStatus(String id, String status) async {
    try {
      final updated = await _bookingService.updateBookingStatus(id, status);
      final index = _salonBookings.indexWhere((b) => b.id == id);
      if (index != -1) {
        _salonBookings[index] = updated;
      }
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
