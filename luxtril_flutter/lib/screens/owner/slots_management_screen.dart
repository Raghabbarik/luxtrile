import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';
import '../../widgets/loading.dart';
import '../../services/salon_service.dart';
import '../../models/working_hours.dart';
import '../../utils/error_handler.dart';

class SlotsManagementScreen extends StatefulWidget {
  const SlotsManagementScreen({super.key});

  @override
  State<SlotsManagementScreen> createState() => _SlotsManagementScreenState();
}

class _SlotsManagementScreenState extends State<SlotsManagementScreen> {
  final _salonService = SalonService();
  List<WorkingHours> _hours = [];
  final _slotDurationController = TextEditingController(text: '30');
  final _seatsController = TextEditingController(text: '1');
  bool _isLoading = true;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      _hours = await _salonService.getWorkingHours('salon-id');
      final config = await _salonService.getSlotConfig('salon-id');
      _slotDurationController.text = config.slotDuration.toString();
      _seatsController.text = config.seatsPerSlot.toString();
    } catch (_) {
      _hours = List.generate(7, (i) => WorkingHours(id: 0, salonId: '', dayOfWeek: i, openTime: '09:00', closeTime: '20:00'));
    }
    if (mounted) setState(() => _isLoading = false);
  }

  Future<void> _save() async {
    setState(() => _isSaving = true);
    try {
      await _salonService.updateWorkingHours('salon-id', _hours.map((h) => h.toJson()).toList());
      await _salonService.updateSlotConfig('salon-id', {
        'slot_duration': int.tryParse(_slotDurationController.text) ?? 30,
        'seats_per_slot': int.tryParse(_seatsController.text) ?? 1,
      });
      ErrorHandler.showSuccess('Slots updated');
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isSaving = false);
  }

  @override
  void dispose() {
    _slotDurationController.dispose();
    _seatsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Slots Management')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Slot Settings', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: InputField(label: 'Slot Duration (min)', controller: _slotDurationController, keyboardType: TextInputType.number)),
                  const SizedBox(width: 12),
                  Expanded(child: InputField(label: 'Seats per Slot', controller: _seatsController, keyboardType: TextInputType.number)),
                ],
              ),
              const SizedBox(height: 32),
              const Text('Working Hours', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              const SizedBox(height: 16),
              ...List.generate(7, (index) {
                final day = _hours.length > index ? _hours[index] : WorkingHours(id: 0, salonId: '', dayOfWeek: index, openTime: '09:00', closeTime: '20:00');
                return Card(
                  color: AppColors.card,
                  margin: const EdgeInsets.only(bottom: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        SizedBox(width: 90, child: Text(day.fullDayName, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w500))),
                        Expanded(
                          child: Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: TextEditingController(text: day.openTime ?? '09:00'),
                                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
                                  decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 8, vertical: 8), border: OutlineInputBorder()),
                                  onChanged: (v) {
                                    if (_hours.length > index) {
                                      _hours[index].openTime;
                                    }
                                  },
                                ),
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 8),
                                child: Text('-', style: TextStyle(color: AppColors.textMuted)),
                              ),
                              Expanded(
                                child: TextField(
                                  controller: TextEditingController(text: day.closeTime ?? '20:00'),
                                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
                                  decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 8, vertical: 8), border: OutlineInputBorder()),
                                  onChanged: (v) {
                                    if (_hours.length > index) {
                                      _hours[index].closeTime;
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
              const SizedBox(height: 32),
              LuxtrilButton(label: 'Save Changes', isLoading: _isSaving, onPressed: _save),
            ],
          ),
        ),
      ),
    );
  }
}
