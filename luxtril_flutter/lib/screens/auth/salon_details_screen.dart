import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';

class SalonDetailsScreen extends StatefulWidget {
  const SalonDetailsScreen({super.key});

  @override
  State<SalonDetailsScreen> createState() => _SalonDetailsScreenState();
}

class _SalonDetailsScreenState extends State<SalonDetailsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _descriptionController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _next() {
    if (!_formKey.currentState!.validate()) return;
    context.push('/salon-360');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Salon Details')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStepIndicator(2),
                const SizedBox(height: 24),
                const Text('Salon Information', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                const SizedBox(height: 8),
                const Text('Step 2 of 4: Tell us about your salon', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                const SizedBox(height: 32),
                InputField(label: 'Salon Name', hint: 'Enter salon name', controller: _nameController, validator: (v) {
                  if (v == null || v.isEmpty) return 'Salon name is required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(label: 'Address', hint: 'Enter full address', controller: _addressController, isMultiline: true, validator: (v) {
                  if (v == null || v.isEmpty) return 'Address is required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(label: 'Phone', hint: 'Enter salon phone', controller: _phoneController, keyboardType: TextInputType.phone, validator: (v) {
                  if (v == null || v.isEmpty) return 'Phone is required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(label: 'Description', hint: 'Brief description', controller: _descriptionController, isMultiline: true, maxLines: 3),
                const SizedBox(height: 32),
                LuxtrilButton(label: 'Continue', onPressed: _next),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStepIndicator(int currentStep) {
    return Row(
      children: List.generate(4, (index) {
        final isActive = index < currentStep;
        return Expanded(
          child: Container(
            height: 4,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            decoration: BoxDecoration(
              color: isActive ? AppColors.primary : AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        );
      }),
    );
  }
}
