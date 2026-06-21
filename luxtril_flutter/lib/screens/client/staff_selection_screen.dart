import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/loading.dart';
import '../../models/staff.dart';
import '../../services/staff_service.dart';

class StaffSelectionScreen extends StatefulWidget {
  final String salonId;
  const StaffSelectionScreen({super.key, required this.salonId});

  @override
  State<StaffSelectionScreen> createState() => _StaffSelectionScreenState();
}

class _StaffSelectionScreenState extends State<StaffSelectionScreen> {
  final StaffService _staffService = StaffService();
  List<Staff> _staffList = [];
  String? _selectedStaffId;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStaff();
  }

  Future<void> _loadStaff() async {
    try {
      _staffList = await _staffService.getSalonStaff(widget.salonId);
    } catch (_) {}
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Select Staff (Optional)')),
      body: Column(
        children: [
          Expanded(
            child: _staffList.isEmpty
                ? const Center(child: Text('No staff available', style: TextStyle(color: AppColors.textSecondary)))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _staffList.length,
                    itemBuilder: (context, index) {
                      final staff = _staffList[index];
                      final isSelected = _selectedStaffId == staff.id;
                      return LuxtrilCard(
                        margin: const EdgeInsets.only(bottom: 12),
                        onTap: staff.isAvailable == true ? () => setState(() => _selectedStaffId = isSelected ? null : staff.id) : null,
                        child: Opacity(
                          opacity: staff.isAvailable == true ? 1 : 0.5,
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 24,
                                backgroundColor: AppColors.surfaceLight,
                                backgroundImage: staff.image != null ? NetworkImage(staff.image!) : null,
                                child: staff.image == null ? Text(staff.name[0].toUpperCase(), style: const TextStyle(color: AppColors.primary)) : null,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(staff.name, style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                                    if (staff.position != null) Text(staff.position!, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                                  ],
                                ),
                              ),
                              if (isSelected)
                                const Icon(Icons.check_circle, color: AppColors.primary)
                              else if (staff.isAvailable == true)
                                const Icon(Icons.circle_outlined, color: AppColors.textMuted)
                              else
                                const Text('Unavailable', style: TextStyle(fontSize: 11, color: AppColors.error)),
                            ],
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
                label: 'Continue',
                onPressed: () => context.push('/client/home/timeslot/${widget.salonId}'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
