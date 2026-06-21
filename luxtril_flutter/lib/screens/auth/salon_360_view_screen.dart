import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';

class Salon360ViewScreen extends StatefulWidget {
  const Salon360ViewScreen({super.key});

  @override
  State<Salon360ViewScreen> createState() => _Salon360ViewScreenState();
}

class _Salon360ViewScreenState extends State<Salon360ViewScreen> {
  final List<String> _selectedImages = [];

  void _pickImages() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Image picker will be implemented')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Salon Photos')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStepIndicator(3),
              const SizedBox(height: 24),
              const Text('Add Photos', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              const Text('Step 3 of 4: Upload salon photos', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
              const SizedBox(height: 32),
              GestureDetector(
                onTap: _pickImages,
                child: Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_photo_alternate_outlined, size: 48, color: AppColors.textMuted),
                      const SizedBox(height: 8),
                      const Text('Tap to add photos', style: TextStyle(color: AppColors.textMuted)),
                      const Text('(Max 5 photos)', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                    ],
                  ),
                ),
              ),
              if (_selectedImages.isNotEmpty) ...[
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _selectedImages.map((img) {
                    return ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(img, width: 100, height: 100, fit: BoxFit.cover),
                    );
                  }).toList(),
                ),
              ],
              const SizedBox(height: 32),
              LuxtrilButton(label: 'Continue', onPressed: () => context.push('/salon-services')),
              const SizedBox(height: 8),
              LuxtrilButton(label: 'Skip for now', isGhost: true, onPressed: () => context.push('/salon-services')),
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
