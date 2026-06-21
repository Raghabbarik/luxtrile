import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/loading.dart';
import '../../models/service.dart';
import '../../services/salon_service.dart' as svc_api;

class ServiceSelectionScreen extends StatefulWidget {
  final String salonId;
  const ServiceSelectionScreen({super.key, required this.salonId});

  @override
  State<ServiceSelectionScreen> createState() => _ServiceSelectionScreenState();
}

class _ServiceSelectionScreenState extends State<ServiceSelectionScreen> {
  final List<SalonService> _selectedServices = [];
  final svc_api.SalonService _salonService = svc_api.SalonService();
  List<SalonService> _services = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  Future<void> _loadServices() async {
    try {
      _services = await _salonService.getSalonServices(widget.salonId);
    } catch (_) {}
    if (mounted) setState(() => _isLoading = false);
  }

  void _toggleService(SalonService service) {
    setState(() {
      if (_selectedServices.any((s) => s.id == service.id)) {
        _selectedServices.removeWhere((s) => s.id == service.id);
      } else {
        _selectedServices.add(service);
      }
    });
  }

  double get _totalPrice => _selectedServices.fold(0, (sum, s) => sum + s.price);
  int get _totalDuration => _selectedServices.fold(0, (sum, s) => sum + s.duration);

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Select Services')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _services.length,
              itemBuilder: (context, index) {
                final service = _services[index];
                final isSelected = _selectedServices.any((s) => s.id == service.id);
                return LuxtrilCard(
                  margin: const EdgeInsets.only(bottom: 12),
                  onTap: () => _toggleService(service),
                  child: Row(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: isSelected ? AppColors.primary : AppColors.textMuted, width: 2),
                          color: isSelected ? AppColors.primary : Colors.transparent,
                        ),
                        child: isSelected ? const Icon(Icons.check, size: 16, color: Colors.black) : null,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(service.name, style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                            if (service.description != null)
                              Text(service.description!, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                            Text('${service.duration} min', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          ],
                        ),
                      ),
                      Text('₹${service.price.toStringAsFixed(0)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                );
              },
            ),
          ),
          if (_selectedServices.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: SafeArea(
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total', style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
                        Text('₹${_totalPrice.toStringAsFixed(0)} • ${_totalDuration} min', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    LuxtrilButton(
                      label: 'Continue (${_selectedServices.length} selected)',
                      onPressed: () => context.push('/client/home/staff/${widget.salonId}'),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
