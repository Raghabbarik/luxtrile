import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/header.dart';
import '../../widgets/search_bar_widget.dart';
import '../../widgets/filter_chip.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/loading.dart';
import '../../widgets/empty_state.dart';
import '../../providers/salon_provider.dart';
import '../../providers/auth_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchController = TextEditingController();
  String _selectedCategory = 'All';

  final List<String> _categories = ['All', 'Haircut', 'Styling', 'Coloring', 'Skincare', 'Nail', 'Spa', 'Grooming'];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _loadSalons();
      }
    });
  }

  Future<void> _loadSalons() async {
    // Default to a central location; in production use geolocator
    final salonProvider = context.read<SalonProvider>();
    await salonProvider.fetchNearbySalons(19.0760, 72.8777);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final salonProvider = context.watch<SalonProvider>();
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadSalons,
          color: AppColors.primary,
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Header(
                  title: 'Find Your Salon',
                  subtitle: 'Book premium grooming services',
                  trailing: CircleAvatar(
                    radius: 20,
                    backgroundColor: AppColors.surfaceLight,
                    child: Text(
                      ((authProvider.user?.name.isNotEmpty == true) ? authProvider.user!.name.substring(0, 1) : 'U').toUpperCase(),
                      style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(child: SearchBarWidget(controller: _searchController, hint: 'Search salons...', onChanged: (v) {
                if (v.length > 2) salonProvider.searchSalons(v);
              })),
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 44,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: AppFilterChip(
                          label: _categories[index],
                          isSelected: _selectedCategory == _categories[index],
                          onTap: () => setState(() => _selectedCategory = _categories[index]),
                        ),
                      );
                    },
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 8)),
              if (salonProvider.isLoading)
                const SliverFillRemaining(child: Loading(message: 'Finding salons near you...'))
              else if (salonProvider.nearbySalons.isEmpty)
                SliverFillRemaining(
                  child: EmptyState(icon: Icons.store_outlined, title: 'No salons found', subtitle: 'Try a different location or search term'),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final salon = salonProvider.nearbySalons[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: LuxtrilCard(
                            onTap: () => context.push('/client/home/details/${salon.id}'),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Container(
                                    height: 180,
                                    color: AppColors.surfaceLight,
                                    child: salon.images.isNotEmpty
                                        ? Image.network(salon.images[0], fit: BoxFit.cover, width: double.infinity, errorBuilder: (_, __, ___) => _imagePlaceholder())
                                        : _imagePlaceholder(),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(salon.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                                    ),
                                    if (salon.averageRating != null)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppColors.primary.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            const Icon(Icons.star, size: 14, color: AppColors.primary),
                                            const SizedBox(width: 4),
                                            Text(salon.averageRating!.toStringAsFixed(1), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600)),
                                          ],
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.location_on_outlined, size: 14, color: AppColors.textMuted),
                                    const SizedBox(width: 4),
                                    Expanded(child: Text(salon.address, style: const TextStyle(fontSize: 12, color: AppColors.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis)),
                                  ],
                                ),
                                if (salon.distance != null) ...[
                                  const SizedBox(height: 4),
                                  Text('${salon.distance!.toStringAsFixed(1)} km away', style: const TextStyle(fontSize: 12, color: AppColors.info)),
                                ],
                              ],
                            ),
                          ),
                        );
                      },
                      childCount: salonProvider.nearbySalons.length,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _imagePlaceholder() {
    return Container(
      color: AppColors.surfaceLight,
      child: const Center(child: Icon(Icons.image_outlined, size: 48, color: AppColors.textMuted)),
    );
  }
}
