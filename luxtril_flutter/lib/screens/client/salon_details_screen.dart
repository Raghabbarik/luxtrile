import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/loading.dart';
import '../../providers/salon_provider.dart';

class SalonDetailsScreen extends StatefulWidget {
  final String salonId;
  const SalonDetailsScreen({super.key, required this.salonId});

  @override
  State<SalonDetailsScreen> createState() => _SalonDetailsScreenState();
}

class _SalonDetailsScreenState extends State<SalonDetailsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<SalonProvider>().selectSalon(widget.salonId);
  }

  @override
  Widget build(BuildContext context) {
    final salonProvider = context.watch<SalonProvider>();
    final salon = salonProvider.selectedSalon;
    final services = salonProvider.salonServices;

    if (salonProvider.isLoading || salon == null) {
      return const Scaffold(body: Loading());
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 250,
              pinned: true,
              backgroundColor: AppColors.background,
              flexibleSpace: FlexibleSpaceBar(
                background: ClipRRect(
                  child: salon.images.isNotEmpty
                      ? Image.network(salon.images[0], fit: BoxFit.cover, width: double.infinity, errorBuilder: (_, __, ___) => _placeholder())
                      : _placeholder(),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(salon.name, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                        ),
                        if (salon.averageRating != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                            child: Row(
                              children: [
                                const Icon(Icons.star, size: 16, color: AppColors.primary),
                                const SizedBox(width: 4),
                                Text('${salon.averageRating!.toStringAsFixed(1)} (${salon.totalReviews ?? 0})', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, size: 16, color: AppColors.textMuted),
                        const SizedBox(width: 4),
                        Expanded(child: Text(salon.address, style: const TextStyle(color: AppColors.textSecondary))),
                      ],
                    ),
                    if (salon.distance != null) ...[
                      const SizedBox(height: 4),
                      Text('${salon.distance!.toStringAsFixed(1)} km away', style: const TextStyle(color: AppColors.info, fontSize: 13)),
                    ],
                    if (salon.description != null && salon.description!.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      Text(salon.description!, style: const TextStyle(color: AppColors.textSecondary, height: 1.5)),
                    ],
                    const SizedBox(height: 24),
                    const Text('Services', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                    const SizedBox(height: 12),
                    ...services.map((service) => LuxtrilCard(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(service.name, style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                                    if (service.description != null) ...[
                                      const SizedBox(height: 4),
                                      Text(service.description!, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                                    ],
                                    const SizedBox(height: 4),
                                    Text('${service.duration} min', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                                  ],
                                ),
                              ),
                              Text('₹${service.price.toStringAsFixed(0)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary)),
                            ],
                          ),
                        )),
                    const SizedBox(height: 24),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 32),
                      child: LuxtrilButton(
                        label: 'Book Appointment',
                        icon: Icons.calendar_today,
                        onPressed: () => context.push('/client/home/services/${salon.id}'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _placeholder() {
    return Container(color: AppColors.surfaceLight, child: const Center(child: Icon(Icons.image_outlined, size: 64, color: AppColors.textMuted)));
  }
}
