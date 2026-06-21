import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/loading.dart';
import '../../models/staff.dart';
import '../../services/staff_service.dart';
import '../../utils/error_handler.dart';

class StaffManagementScreen extends StatefulWidget {
  const StaffManagementScreen({super.key});

  @override
  State<StaffManagementScreen> createState() => _StaffManagementScreenState();
}

class _StaffManagementScreenState extends State<StaffManagementScreen> {
  final StaffService _staffService = StaffService();
  List<Staff> _staffList = [];
  bool _isLoading = true;
  bool _showForm = false;
  final _nameController = TextEditingController();
  final _positionController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadStaff();
  }

  Future<void> _loadStaff() async {
    try {
      _staffList = await _staffService.getSalonStaff('salon-id');
    } catch (_) {}
    if (mounted) setState(() => _isLoading = false);
  }

  Future<void> _addStaff() async {
    if (_nameController.text.isEmpty) return;

    setState(() => _isSaving = true);
    try {
      await _staffService.createStaff({
        'name': _nameController.text.trim(),
        'position': _positionController.text.trim(),
        'phone': _phoneController.text.trim(),
        'salon_id': 'salon-id',
      });
      _nameController.clear();
      _positionController.clear();
      _phoneController.clear();
      setState(() => _showForm = false);
      ErrorHandler.showSuccess('Staff added');
      _loadStaff();
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isSaving = false);
  }

  Future<void> _deleteStaff(String id) async {
    try {
      await _staffService.deleteStaff(id);
      ErrorHandler.showSuccess('Staff removed');
      _loadStaff();
    } catch (e) {
      ErrorHandler.showError(e);
    }
  }

  Future<void> _toggleAvailability(String id) async {
    try {
      await _staffService.toggleAvailability(id);
      _loadStaff();
    } catch (e) {
      ErrorHandler.showError(e);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _positionController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Staff Management'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: AppColors.primary),
            onPressed: () => setState(() => _showForm = true),
          ),
        ],
      ),
      body: Column(
        children: [
          if (_showForm)
            Card(
              color: AppColors.card,
              margin: const EdgeInsets.all(16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Name'), style: const TextStyle(color: AppColors.textPrimary)),
                    const SizedBox(height: 12),
                    TextField(controller: _positionController, decoration: const InputDecoration(labelText: 'Position'), style: const TextStyle(color: AppColors.textPrimary)),
                    const SizedBox(height: 12),
                    TextField(controller: _phoneController, decoration: const InputDecoration(labelText: 'Phone'), keyboardType: TextInputType.phone, style: const TextStyle(color: AppColors.textPrimary)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(child: LuxtrilButton(label: 'Add', isLoading: _isSaving, onPressed: _addStaff)),
                        const SizedBox(width: 8),
                        Expanded(child: LuxtrilButton(label: 'Cancel', isOutline: true, onPressed: () => setState(() => _showForm = false))),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          Expanded(
            child: _staffList.isEmpty
                ? const Center(child: Text('No staff members', style: TextStyle(color: AppColors.textSecondary)))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _staffList.length,
                    itemBuilder: (context, index) {
                      final staff = _staffList[index];
                      return Card(
                        color: AppColors.card,
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: AppColors.surfaceLight,
                            child: Text(staff.name[0].toUpperCase(), style: const TextStyle(color: AppColors.primary)),
                          ),
                          title: Text(staff.name, style: const TextStyle(color: AppColors.textPrimary)),
                          subtitle: Text(staff.position ?? 'Staff', style: const TextStyle(color: AppColors.textMuted)),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: Icon(staff.isAvailable == true ? Icons.check_circle : Icons.cancel, color: staff.isAvailable == true ? AppColors.success : AppColors.error, size: 20),
                                onPressed: () => _toggleAvailability(staff.id),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 20),
                                onPressed: () => _deleteStaff(staff.id),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
