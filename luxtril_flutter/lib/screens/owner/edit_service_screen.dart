import 'dart:developer' as developer;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';
import '../../widgets/loading.dart';
import '../../services/salon_service.dart' as svc_api;
import '../../utils/error_handler.dart';

class EditServiceScreen extends StatefulWidget {
  final String serviceId;
  const EditServiceScreen({super.key, required this.serviceId});

  @override
  State<EditServiceScreen> createState() => _EditServiceScreenState();
}

class _EditServiceScreenState extends State<EditServiceScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _durationController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _category = 'haircut';
  final _salonService = svc_api.SalonService();
  bool _isLoading = true;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadService();
  }

  Future<void> _loadService() async {
    try {
      final services = await _salonService.getSalonServices('salon-id');
      final service = services.where((s) => s.id == widget.serviceId).firstOrNull;
      if (service != null) {
        _nameController.text = service.name;
        _priceController.text = service.price.toString();
        _durationController.text = service.duration.toString();
        _descriptionController.text = service.description ?? '';
        _category = service.category ?? 'haircut';
      }
    } catch (e) {
      developer.log('Failed to load service: $e');
    }
    if (mounted) setState(() => _isLoading = false);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);
    try {
      await _salonService.updateService(widget.serviceId, {
        'name': _nameController.text.trim(),
        'price': double.tryParse(_priceController.text) ?? 0,
        'duration': int.tryParse(_durationController.text) ?? 30,
        'description': _descriptionController.text.trim(),
        'category': _category,
      });
      if (!mounted) return;
      ErrorHandler.showSuccess('Service updated');
      context.pop();
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isSaving = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Edit Service')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                InputField(label: 'Service Name', controller: _nameController, validator: (v) {
                  if (v == null || v.isEmpty) return 'Name is required';
                  return null;
                }),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: InputField(label: 'Price (₹)', controller: _priceController, keyboardType: TextInputType.number, validator: (v) {
                      if (v == null || v.isEmpty) return 'Required';
                      return null;
                    })),
                    const SizedBox(width: 12),
                    Expanded(child: InputField(label: 'Duration (min)', controller: _durationController, keyboardType: TextInputType.number, validator: (v) {
                      if (v == null || v.isEmpty) return 'Required';
                      return null;
                    })),
                  ],
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _category,
                  dropdownColor: AppColors.surface,
                  decoration: const InputDecoration(labelText: 'Category'),
                  items: ['haircut', 'styling', 'coloring', 'skincare', 'nail', 'spa', 'grooming', 'other']
                      .map((c) => DropdownMenuItem(value: c, child: Text(c.toUpperCase(), style: const TextStyle(color: AppColors.textPrimary))))
                      .toList(),
                  onChanged: (v) => setState(() => _category = v ?? 'haircut'),
                ),
                const SizedBox(height: 16),
                InputField(label: 'Description', controller: _descriptionController, isMultiline: true, maxLines: 3),
                const SizedBox(height: 32),
                LuxtrilButton(label: 'Save Changes', isLoading: _isSaving, onPressed: _submit),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
