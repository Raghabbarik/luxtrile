import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';
import '../../widgets/loading.dart';
import '../../services/salon_service.dart';
import '../../utils/error_handler.dart';

class SalonSetupScreen extends StatefulWidget {
  const SalonSetupScreen({super.key});

  @override
  State<SalonSetupScreen> createState() => _SalonSetupScreenState();
}

class _SalonSetupScreenState extends State<SalonSetupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _descriptionController = TextEditingController();
  final SalonService _salonService = SalonService();
  bool _isLoading = true;
  bool _isSaving = false;
  String? _salonId;

  @override
  void initState() {
    super.initState();
    _loadSalon();
  }

  Future<void> _loadSalon() async {
    // In production, get salon from auth/user
    setState(() => _isLoading = false);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);
    try {
      if (_salonId == null) {
        await _salonService.createSalon({
          'name': _nameController.text.trim(),
          'address': _addressController.text.trim(),
          'phone': _phoneController.text.trim(),
          'description': _descriptionController.text.trim(),
        });
      } else {
        await _salonService.updateSalon(_salonId!, {
          'name': _nameController.text.trim(),
          'address': _addressController.text.trim(),
          'phone': _phoneController.text.trim(),
          'description': _descriptionController.text.trim(),
        });
      }
      ErrorHandler.showSuccess('Salon saved');
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isSaving = false);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: Text(_salonId == null ? 'Create Salon' : 'Edit Salon')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                InputField(label: 'Salon Name', hint: 'Enter salon name', controller: _nameController, validator: (v) {
                  if (v == null || v.isEmpty) return 'Required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(label: 'Address', hint: 'Enter full address', controller: _addressController, isMultiline: true, validator: (v) {
                  if (v == null || v.isEmpty) return 'Required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(label: 'Phone', hint: 'Enter phone number', controller: _phoneController, keyboardType: TextInputType.phone),
                const SizedBox(height: 16),
                InputField(label: 'Description', hint: 'Brief description', controller: _descriptionController, isMultiline: true, maxLines: 3),
                const SizedBox(height: 32),
                LuxtrilButton(label: 'Save Salon', isLoading: _isSaving, onPressed: _submit),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
