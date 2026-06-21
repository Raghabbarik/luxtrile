class TimeSlot {
  final String time;
  final bool isAvailable;
  final int? availableSeats;

  TimeSlot({
    required this.time,
    this.isAvailable = true,
    this.availableSeats,
  });

  factory TimeSlot.fromJson(Map<String, dynamic> json) {
    return TimeSlot(
      time: json['time'] ?? '',
      isAvailable: json['is_available'] ?? true,
      availableSeats: json['available_seats'],
    );
  }
}

class SlotConfig {
  final int slotDuration;
  final int seatsPerSlot;

  SlotConfig({
    this.slotDuration = 30,
    this.seatsPerSlot = 1,
  });

  factory SlotConfig.fromJson(Map<String, dynamic> json) {
    return SlotConfig(
      slotDuration: json['slot_duration'] ?? 30,
      seatsPerSlot: json['seats_per_slot'] ?? 1,
    );
  }
}
