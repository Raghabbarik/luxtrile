import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/loading.dart';
import '../../models/service.dart';
import '../../services/salon_service.dart' as svc_api;
import '../../utils/error_handler.dart';

class ManageServicesScreen extends StatefulWidget {
  const ManageServicesScreen({super.key});

  @override
  State<ManageServicesScreen> createState() => _ManageServicesScreenState();
}

class _ManageServicesScreenState extends State<ManageServicesScreen> {
  final svc_api.SalonService _salonService = svc_api.SalonService();
  List<SalonService> _services = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  Future<void> _loadServices() async {
    // In production, get salonId from auth provider
    try {
      _services = await _salonService.getSalonServices('salon-id');
    } catch (_) {}
    if (mounted) setState(() => _isLoading = false);
  }

  Future<void> _deleteService(String id) async {
    try {
      await _salonService.deleteService(id);
      _services.removeWhere((s) => s.id == id);
      if (mounted) setState(() {});
      ErrorHandler.showSuccess('Service deleted');
    } catch (e) {
      ErrorHandler.showError(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Services'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: AppColors.primary),
            onPressed: () async {
              await context.push('/owner/services/add');
              _loadServices();
            },
          ),
        ],
      ),
      body: _services.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.content_cut_outlined, size: 64, color: AppColors.textMuted),
                  const SizedBox(height: 16),
                  const Text('No services added yet', style: TextStyle(color: AppColors.textSecondary)),
                  const SizedBox(height: 16),
                  LuxtrilButton(label: 'Add Service', onPressed: () async {
                    await context.push('/owner/services/add');
                    _loadServices();
                  }),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _services.length,
              itemBuilder: (context, index) {
                final service = _services[index];
                return LuxtrilCard(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(child: Text(service.name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontSize: 16))),
                          PopupMenuButton<String>(
                            iconColor: AppColors.textMuted,
                            onSelected: (value) {
                              if (value == 'edit') {
                                context.push('/owner/services/edit/${service.id}');
                              } else if (value == 'delete') {
                                _deleteService(service.id);
                              }
                            },
                            itemBuilder: (_) => [
                              const PopupMenuItem(value: 'edit', child: Text('Edit')),
                              const PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: AppColors.error))),
                            ],
                          ),
                        ],
                      ),
                      if (service.description != null) ...[
                        const SizedBox(height: 4),
                        Text(service.description!, style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
                      ],
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Text('₹${service.price.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 16)),
                          const SizedBox(width: 16),
                          Text('${service.duration} min', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                          const Spacer(),
                          if (service.category != null)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(color: AppColors.surfaceLight, borderRadius: BorderRadius.circular(8)),
                              child: Text(service.category!, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
