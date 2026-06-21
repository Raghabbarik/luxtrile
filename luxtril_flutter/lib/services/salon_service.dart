import 'api_client.dart';
import '../models/salon.dart';
import '../models/service.dart' as svc;
import '../models/working_hours.dart';
import '../models/slot.dart';

class SalonService {
  final ApiClient _api = ApiClient();

  Future<List<Salon>> getNearbySalons(double lat, double lng, {double? radius}) async {
    final response = await _api.get('/nearby', queryParams: {
      'latitude': lat.toString(),
      'longitude': lng.toString(),
      if (radius != null) 'radius': radius.toString(),
    });
    final List<dynamic> data = response['salons'] ?? response['data'] ?? [];
    return data.map((s) => Salon.fromJson(s)).toList();
  }

  Future<List<Salon>> searchSalons(String query) async {
    final response = await _api.get('/salons', queryParams: {'search': query});
    final List<dynamic> data = response['salons'] ?? response['data'] ?? [];
    return data.map((s) => Salon.fromJson(s)).toList();
  }

  Future<Salon> getSalonById(String id) async {
    final response = await _api.get('/salons/$id');
    return Salon.fromJson(response['salon'] ?? response);
  }

  Future<Salon> createSalon(Map<String, dynamic> data) async {
    final response = await _api.post('/salons', body: data);
    return Salon.fromJson(response['salon'] ?? response);
  }

  Future<Salon> updateSalon(String id, Map<String, dynamic> data) async {
    final response = await _api.put('/salons/$id', body: data);
    return Salon.fromJson(response['salon'] ?? response);
  }

  Future<List<svc.SalonService>> getSalonServices(String salonId) async {
    final response = await _api.get('/services/salon/$salonId');
    final List<dynamic> data = response['services'] ?? response['data'] ?? [];
    return data.map((s) => svc.SalonService.fromJson(s)).toList();
  }

  Future<svc.SalonService> createService(Map<String, dynamic> data) async {
    final response = await _api.post('/services', body: data);
    return svc.SalonService.fromJson(response['service'] ?? response);
  }

  Future<svc.SalonService> updateService(String id, Map<String, dynamic> data) async {
    final response = await _api.put('/services/$id', body: data);
    return svc.SalonService.fromJson(response['service'] ?? response);
  }

  Future<void> deleteService(String id) async {
    await _api.delete('/services/$id');
  }

  Future<List<WorkingHours>> getWorkingHours(String salonId) async {
    final response = await _api.get('/salons/$salonId/working-hours');
    final List<dynamic> data = response['working_hours'] ?? response['data'] ?? [];
    return data.map((w) => WorkingHours.fromJson(w)).toList();
  }

  Future<void> updateWorkingHours(String salonId, List<Map<String, dynamic>> hours) async {
    await _api.put('/salons/$salonId/working-hours', body: {'working_hours': hours});
  }

  Future<SlotConfig> getSlotConfig(String salonId) async {
    final response = await _api.get('/salons/$salonId/slot-config');
    return SlotConfig.fromJson(response);
  }

  Future<void> updateSlotConfig(String salonId, Map<String, dynamic> data) async {
    await _api.put('/salons/$salonId/slot-config', body: data);
  }

  Future<List<TimeSlot>> getAvailableSlots(String salonId, DateTime date) async {
    final response = await _api.get('/timeslots/$salonId', queryParams: {
      'date': '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}',
    });
    final List<dynamic> data = response['slots'] ?? response['data'] ?? [];
    return data.map((s) => TimeSlot.fromJson(s)).toList();
  }
}
