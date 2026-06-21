import 'dart:io';
import 'package:image_picker/image_picker.dart';

class ImageHelper {
  static final ImagePicker _picker = ImagePicker();

  static Future<File?> pickFromCamera() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 80,
      maxWidth: 1024,
      maxHeight: 1024,
    );
    if (image != null) return File(image.path);
    return null;
  }

  static Future<File?> pickFromGallery() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
      maxWidth: 1024,
      maxHeight: 1024,
    );
    if (image != null) return File(image.path);
    return null;
  }

  static Future<List<File>> pickMultipleFromGallery() async {
    final List<XFile> images = await _picker.pickMultiImage(
      imageQuality: 80,
      maxWidth: 1024,
      maxHeight: 1024,
    );
    return images.map((x) => File(x.path)).toList();
  }

  static Future<File?> pickFromSource({required bool useCamera}) async {
    return useCamera ? pickFromCamera() : pickFromGallery();
  }
}
