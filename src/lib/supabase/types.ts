export type RoomRow = {
  id: string;
  created_by: string;
  room_code: string;
  name: string;
  floor: string | null;
  capacity: number;
  hourly_rate: number;
  status: "available" | "occupied" | "maintenance";
  location_note: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ReservationRow = {
  id: string;
  created_by: string;
  room_id: string;
  title: string;
  organizer_name: string;
  organizer_email: string | null;
  start_at: string;
  end_at: string;
  attendee_count: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  total_price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ParticipantRow = {
  id: string;
  created_by: string;
  reservation_id: string;
  name: string;
  email: string | null;
  company_name: string | null;
  role: "host" | "guest" | "approver";
  attendance_status: "invited" | "accepted" | "declined" | "checked_in";
  created_at: string;
};

export type EquipmentRow = {
  id: string;
  created_by: string;
  room_id: string;
  name: string;
  category: string;
  quantity: number;
  status: "available" | "in_use" | "maintenance";
  is_portable: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseMeetingBundle = {
  rooms: RoomRow[];
  reservations: ReservationRow[];
  participants: ParticipantRow[];
  equipment: EquipmentRow[];
};
