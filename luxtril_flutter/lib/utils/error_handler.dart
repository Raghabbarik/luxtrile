import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../services/api_client.dart';

class ErrorHandler {
  static OverlayEntry? _toastEntry;

  static String getErrorMessage(dynamic error) {
    if (error is ApiException) {
      return error.message;
    }
    if (error is Map) {
      return error['message'] ?? 'Something went wrong';
    }
    if (error.toString().contains('TimeoutException')) {
      return 'Request timed out. Please check your connection.';
    }
    if (error.toString().contains('SocketException')) {
      return 'Unable to connect to server. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  }

  static void showError(dynamic error, {BuildContext? context}) {
    final message = getErrorMessage(error);
    _showToast(message, isError: true, context: context);
  }

  static void showSuccess(String message, {BuildContext? context}) {
    _showToast(message, isError: false, context: context);
  }

  static void _showToast(String message, {required bool isError, BuildContext? context}) {
    _toastEntry?.remove();
    
    if (context == null) return;

    _toastEntry = OverlayEntry(
      builder: (context) => Positioned(
        bottom: 100,
        left: 24,
        right: 24,
        child: Material(
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            decoration: BoxDecoration(
              color: isError ? Colors.red.shade800 : Colors.green.shade700,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Text(
              message,
              style: const TextStyle(color: Colors.white, fontSize: 14),
            ),
          ),
        ),
      ),
    );

    Overlay.of(context).insert(_toastEntry!);

    Future.delayed(const Duration(seconds: 3), () {
      _toastEntry?.remove();
      _toastEntry = null;
    });
  }
}
