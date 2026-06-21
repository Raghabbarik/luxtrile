import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/splash_screen.dart';
import '../screens/auth/welcome_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/owner_login_screen.dart';
import '../screens/auth/signup_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/auth/reset_password_screen.dart';
import '../screens/auth/salon_registration_screen.dart';
import '../screens/auth/salon_details_screen.dart' as auth_screens;
import '../screens/auth/salon_360_view_screen.dart';
import '../screens/auth/salon_services_screen.dart';
import '../screens/client/home_screen.dart';
import '../screens/client/bookings_screen.dart';
import '../screens/client/profile_screen.dart';
import '../screens/client/salon_details_screen.dart' as client_screens;
import '../screens/client/service_selection_screen.dart';
import '../screens/client/staff_selection_screen.dart';
import '../screens/client/time_slot_screen.dart';
import '../screens/client/payment_screen.dart';
import '../screens/client/booking_confirmation_screen.dart';
import '../screens/client/booking_details_screen.dart';
import '../screens/client/help_support_screen.dart';
import '../screens/owner/dashboard_screen.dart';
import '../screens/owner/manage_services_screen.dart';
import '../screens/owner/add_service_screen.dart';
import '../screens/owner/edit_service_screen.dart';
import '../screens/owner/owner_bookings_screen.dart';
import '../screens/owner/owner_profile_screen.dart';
import '../screens/owner/salon_setup_screen.dart';
import '../screens/owner/slots_management_screen.dart';
import '../screens/owner/staff_management_screen.dart';
import '../screens/owner/owner_analytics_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _clientTabKey = GlobalKey<NavigatorState>();

final GoRouter appRouter = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/splash',
    redirect: (context, state) {
      final auth = context.read<AuthProvider>();
      final isLoggedIn = auth.isLoggedIn;
      final isInitialized = auth.isInitialized;
      final location = state.uri.toString();

      if (!isInitialized) return null;

      final isAuthRoute = location.startsWith('/splash') ||
          location.startsWith('/welcome') ||
          location.startsWith('/login') ||
          location.startsWith('/owner-login') ||
          location.startsWith('/signup') ||
          location.startsWith('/forgot-password') ||
          location.startsWith('/reset-password') ||
          location.startsWith('/salon-registration');

      if (!isLoggedIn && !isAuthRoute) return '/welcome';
      if (isLoggedIn && isAuthRoute) {
        if (auth.isSalonOwner) return '/owner/dashboard';
        return '/client/home';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/welcome', builder: (_, __) => const WelcomeScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/owner-login', builder: (_, __) => const OwnerLoginScreen()),
      GoRoute(path: '/signup', builder: (_, __) => const SignupScreen()),
      GoRoute(path: '/forgot-password', builder: (_, __) => const ForgotPasswordScreen()),
      GoRoute(
        path: '/reset-password',
        builder: (_, state) => ResetPasswordScreen(token: state.uri.queryParameters['token'] ?? ''),
      ),
      GoRoute(path: '/salon-registration', builder: (_, __) => const SalonRegistrationScreen()),
      GoRoute(path: '/salon-details', builder: (_, __) => const auth_screens.SalonDetailsScreen()),
      GoRoute(path: '/salon-360', builder: (_, __) => const Salon360ViewScreen()),
      GoRoute(path: '/salon-services', builder: (_, __) => const SalonServicesScreen()),

      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => ClientShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            navigatorKey: _clientTabKey,
            routes: [
              GoRoute(
                path: '/client/home',
                builder: (_, __) => const HomeScreen(),
                routes: [
                  GoRoute(
                    path: 'details/:id',
                    builder: (_, state) => client_screens.SalonDetailsScreen(salonId: state.pathParameters['id']!),
                  ),
                  GoRoute(
                    path: 'services/:salonId',
                    builder: (_, state) => ServiceSelectionScreen(salonId: state.pathParameters['salonId']!),
                  ),
                  GoRoute(
                    path: 'staff/:salonId',
                    builder: (_, state) => StaffSelectionScreen(salonId: state.pathParameters['salonId']!),
                  ),
                  GoRoute(
                    path: 'timeslot/:salonId',
                    builder: (_, state) => TimeSlotScreen(salonId: state.pathParameters['salonId']!),
                  ),
                  GoRoute(
                    path: 'payment/:salonId',
                    builder: (_, state) => PaymentScreen(salonId: state.pathParameters['salonId']!),
                  ),
                  GoRoute(
                    path: 'confirmation',
                    builder: (_, __) => const BookingConfirmationScreen(),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/client/bookings',
                builder: (_, __) => const BookingsScreen(),
                routes: [
                  GoRoute(
                    path: ':id',
                    builder: (_, state) => BookingDetailsScreen(bookingId: state.pathParameters['id']!),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/client/profile',
                builder: (_, __) => const ProfileScreen(),
                routes: [
                  GoRoute(path: 'help', builder: (_, __) => const HelpSupportScreen()),
                ],
              ),
            ],
          ),
        ],
      ),

      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => OwnerShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(path: '/owner/dashboard', builder: (_, __) => const DashboardScreen()),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/owner/services',
                builder: (_, __) => const ManageServicesScreen(),
                routes: [
                  GoRoute(path: 'add', builder: (_, __) => const AddServiceScreen()),
                  GoRoute(
                    path: 'edit/:id',
                    builder: (_, state) => EditServiceScreen(serviceId: state.pathParameters['id']!),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/owner/bookings',
                builder: (_, __) => const OwnerBookingsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/owner/profile',
                builder: (_, __) => const OwnerProfileScreen(),
                routes: [
                  GoRoute(path: 'salon-setup', builder: (_, __) => const SalonSetupScreen()),
                  GoRoute(path: 'slots', builder: (_, __) => const SlotsManagementScreen()),
                  GoRoute(path: 'staff', builder: (_, __) => const StaffManagementScreen()),
                  GoRoute(path: 'analytics', builder: (_, __) => const OwnerAnalyticsScreen()),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

class ClientShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;
  const ClientShell({super.key, required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: BottomNavigationBar(
          currentIndex: navigationShell.currentIndex,
          onTap: (index) => navigationShell.goBranch(index),
          backgroundColor: AppColors.surface,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.textMuted,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), activeIcon: Icon(Icons.calendar_today), label: 'Bookings'),
            BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
          ],
        ),
      ),
    );
  }
}

class OwnerShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;
  const OwnerShell({super.key, required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: BottomNavigationBar(
          currentIndex: navigationShell.currentIndex,
          onTap: (index) => navigationShell.goBranch(index),
          backgroundColor: AppColors.surface,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.textMuted,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(Icons.content_cut_outlined), activeIcon: Icon(Icons.content_cut), label: 'Services'),
            BottomNavigationBarItem(icon: Icon(Icons.calendar_month_outlined), activeIcon: Icon(Icons.calendar_month), label: 'Bookings'),
            BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
          ],
        ),
      ),
    );
  }
}
