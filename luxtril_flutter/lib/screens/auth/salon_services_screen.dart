import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../utils/error_handler.dart';
import '../../services/salon_service.dart';

class SalonServicesScreen extends StatefulWidget {
  const SalonServicesScreen({super.key});

  @override
  State<SalonServicesScreen> createState() => _SalonServicesScreenState();
}

class _SalonServicesScreenState extends State<SalonServicesScreen> {
  final List<Map<String, dynamic>> _services = [];
  final _salonService = SalonService();
  bool _isLoading = false;

  void _addService() {
    setState(() {
      _services.add({
        'name': '',
        'price': '',
        'duration': '',
        'description': '',
        'category': 'haircut',
      });
    });
  }

  void _removeService(int index) {
    setState(() => _services.removeAt(index));
  }

  Future<void> _submit() async {
    for (final service in _services) {
      if (service['name'].toString().isEmpty || service['price'].toString().isEmpty) {
        ErrorHandler.showError('Please fill all service details');
        return;
      }
    }

    setState(() => _isLoading = true);
    try {
      for (final service in _services) {
        await _salonService.createService({
          'name': service['name'],
          'price': double.tryParse(service['price'].toString()) ?? 0,
          'duration': int.tryParse(service['duration'].toString()) ?? 30,
          'description': service['description'],
          'category': service['category'],
        });
      }
      if (!mounted) return;
      ErrorHandler.showSuccess('Salon registered successfully!');
      context.go('/owner/dashboard');
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Add Services')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStepIndicator(4),
              const SizedBox(height: 24),
              const Text('Your Services', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              const Text('Step 4 of 4: Add the services you offer', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
              const SizedBox(height: 24),
              ..._services.asMap().entries.map((entry) {
                final index = entry.key;
                final service = entry.value;
                return Card(
                  color: AppColors.card,
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Text('Service ${index + 1}', style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                            const Spacer(),
                            IconButton(
                              icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 20),
                              onPressed: () => _removeService(index),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          decoration: const InputDecoration(labelText: 'Service Name', hintText: 'e.g. Haircut'),
                          style: const TextStyle(color: AppColors.textPrimary),
                          onChanged: (v) => service['name'] = v,
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                decoration: const InputDecoration(labelText: 'Price (₹)', hintText: '499'),
                                keyboardType: TextInputType.number,
                                style: const TextStyle(color: AppColors.textPrimary),
                                onChanged: (v) => service['price'] = v,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextField(
                                decoration: const InputDecoration(labelText: 'Duration (min)', hintText: '30'),
                                keyboardType: TextInputType.number,
                                style: const TextStyle(color: AppColors.textPrimary),
                                onChanged: (v) => service['duration'] = v,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        DropdownButtonFormField<String>(
                          value: service['category'],
                          dropdownColor: AppColors.surface,
                          decoration: const InputDecoration(labelText: 'Category'),
                          items: ['haircut', 'styling', 'coloring', 'skincare', 'nail', 'spa', 'grooming', 'other']
                              .map((c) => DropdownMenuItem(value: c, child: Text(c.toUpperCase(), style: const TextStyle(color: AppColors.textPrimary))))
                              .toList(),
                          onChanged: (v) => service['category'] = v,
                        ),
                      ],
                    ),
                  ),
                );
              }),
              LuxtrilButton(label: 'Add Another Service', isOutline: true, icon: Icons.add, onPressed: _addService),
              const SizedBox(height: 24),
              LuxtrilButton(label: 'Complete Registration', isLoading: _isLoading, onPressed: _submit),
            ],
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
