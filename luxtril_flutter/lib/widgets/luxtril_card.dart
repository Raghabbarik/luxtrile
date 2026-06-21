import 'package:flutter/material.dart';
import '../config/theme.dart';

class LuxtrilCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final double? height;
  final double? width;
  final VoidCallback? onTap;
  final bool isGlass;
  final bool isGradient;

  const LuxtrilCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.height,
    this.width,
    this.onTap,
    this.isGlass = false,
    this.isGradient = false,
  });

  @override
  Widget build(BuildContext context) {
    Widget card = Container(
      height: height,
      width: width,
      padding: padding ?? const EdgeInsets.all(16),
      margin: margin ?? EdgeInsets.zero,
      decoration: BoxDecoration(
        color: isGlass ? AppColors.glassBg : AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isGlass ? Colors.white.withValues(alpha: 0.1) : AppColors.border,
        ),
        gradient: isGradient
            ? const LinearGradient(
                colors: [AppColors.card, AppColors.surfaceLight],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              )
            : null,
      ),
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: card);
    }
    return card;
  }
}
