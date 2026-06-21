import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../providers/salon_provider.dart';

class TimeSlotScreen extends StatefulWidget {
  final String salonId;
  const TimeSlotScreen({super.key, required this.salonId});

  @override
  State<TimeSlotScreen> createState() => _TimeSlotScreenState();
}

class _TimeSlotScreenState extends State<TimeSlotScreen> {
  DateTime _selectedDate = DateTime.now();
  String? _selectedTime;

  @override
  void initState() {
    super.initState();
    _loadSlots();
  }

  void _loadSlots() {
    context.read<SalonProvider>().fetchAvailableSlots(widget.salonId, _selectedDate);
  }

  List<DateTime> _getNext7Days() {
    final now = DateTime.now();
    return List.generate(7, (i) => DateTime(now.year, now.month, now.day + i));
  }

  @override
  Widget build(BuildContext context) {
    final salonProvider = context.watch<SalonProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Select Date & Time')),
      body: Column(
        children: [
          SizedBox(
            height: 80,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.all(16),
              itemCount: 7,
              itemBuilder: (context, index) {
                final date = _getNext7Days()[index];
                final isSelected = _selectedDate.day == date.day;
                final days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedDate = date;
                      _selectedTime = null;
                    });
                    _loadSlots();
                  },
                  child: Container(
                    width: 60,
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary : AppColors.surfaceLight,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(days[date.weekday % 7], style: TextStyle(fontSize: 12, color: isSelected ? Colors.black : AppColors.textSecondary)),
                        const SizedBox(height: 4),
                        Text('${date.day}', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: isSelected ? Colors.black : AppColors.textPrimary)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: salonProvider.availableSlots.isEmpty
                ? const Center(child: Text('No slots available for this date', style: TextStyle(color: AppColors.textSecondary)))
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      childAspectRatio: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: salonProvider.availableSlots.length,
                    itemBuilder: (context, index) {
                      final slot = salonProvider.availableSlots[index];
                      final isSelected = _selectedTime == slot.time;
                      return GestureDetector(
                        onTap: slot.isAvailable ? () => setState(() => _selectedTime = slot.time) : null,
                        child: Container(
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.primary
                                : slot.isAvailable
                                    ? AppColors.surfaceLight
                                    : AppColors.surfaceLight.withValues(alpha: 0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.primary
                                  : slot.isAvailable
                                      ? AppColors.border
                                      : AppColors.error.withValues(alpha: 0.3),
                            ),
                          ),
                          child: Center(
                            child: Text(
                              slot.time.substring(0, 5),
                              style: TextStyle(
                                color: isSelected
                                    ? Colors.black
                                    : slot.isAvailable
                                        ? AppColors.textPrimary
                                        : AppColors.textMuted,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: SafeArea(
              child: LuxtrilButton(
                label: _selectedTime != null ? 'Continue at ${_selectedTime!.substring(0, 5)}' : 'Select a Time',
                onPressed: _selectedTime != null ? () => context.push('/client/home/payment/${widget.salonId}') : null,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
