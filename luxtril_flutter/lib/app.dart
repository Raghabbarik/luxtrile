import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'navigation/app_router.dart';

class LuxtrilApp extends StatelessWidget {
  const LuxtrilApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = appRouter;

    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, _) {
        return MaterialApp.router(
          title: 'Luxtril',
          debugShowCheckedModeBanner: false,
          theme: themeProvider.theme,
          routerConfig: router,
        );
      },
    );
  }
}
