import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';
import '../../services/salon_service.dart';
import '../../utils/error_handler.dart';

class AddServiceScreen extends StatefulWidget {
  const AddServiceScreen({super.key});

  @override
  State<AddServiceScreen> createState() => _AddServiceScreenState();
}

class _AddServiceScreenState extends State<AddServiceScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _durationController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _category = 'haircut';
  final _salonService = SalonService();
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _durationController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await _salonService.createService({
        'name': _nameController.text.trim(),
        'price': double.tryParse(_priceController.text) ?? 0,
        'duration': int.tryParse(_durationController.text) ?? 30,
        'description': _descriptionController.text.trim(),
        'category': _category,
      });
      if (!mounted) return;
      ErrorHandler.showSuccess('Service added');
      context.pop();
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Add Service')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                InputField(label: 'Service Name', hint: 'e.g. Haircut', controller: _nameController, validator: (v) {
                  if (v == null || v.isEmpty) return 'Name is required';
                  return null;
                }),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: InputField(label: 'Price (₹)', hint: '499', controller: _priceController, keyboardType: TextInputType.number, validator: (v) {
                      if (v == null || v.isEmpty) return 'Required';
                      if (double.tryParse(v) == null || double.parse(v) <= 0) return 'Invalid price';
                      return null;
                    })),
                    const SizedBox(width: 12),
                    Expanded(child: InputField(label: 'Duration (min)', hint: '30', controller: _durationController, keyboardType: TextInputType.number, validator: (v) {
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
                InputField(label: 'Description', hint: 'Brief description (optional)', controller: _descriptionController, isMultiline: true, maxLines: 3),
                const SizedBox(height: 32),
                LuxtrilButton(label: 'Add Service', isLoading: _isLoading, onPressed: _submit),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
