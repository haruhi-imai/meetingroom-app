"use client";

import { startTransition, useEffect, useState } from "react";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  EquipmentRow,
  ParticipantRow,
  ReservationRow,
  RoomRow,
} from "@/lib/supabase/types";

type UseSupabaseMeetingDataResult = {
  rooms: RoomRow[];
  reservations: ReservationRow[];
  participants: ParticipantRow[];
  equipment: EquipmentRow[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  configured: boolean;
  refetch: () => void;
};

function isoInHours(hoursFromNow: number) {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

function createDemoBundle() {
  const rooms: RoomRow[] = [
    {
      id: "room-atlas",
      created_by: "demo-user",
      room_code: "ATLAS-8F",
      name: "Atlas Room",
      floor: "8F East",
      capacity: 12,
      hourly_rate: 4800,
      status: "available",
      location_note: "大型モニターとWeb会議設備あり",
      notes: "すぐに予約しやすい標準会議室です。",
      created_at: isoInHours(-72),
      updated_at: isoInHours(-2),
    },
    {
      id: "room-luna",
      created_by: "demo-user",
      room_code: "LUNA-7F",
      name: "Luna Room",
      floor: "7F South",
      capacity: 8,
      hourly_rate: 3600,
      status: "maintenance",
      location_note: "商談向けの落ち着いた中会議室",
      notes: "現在は調整中です。",
      created_at: isoInHours(-72),
      updated_at: isoInHours(-1),
    },
    {
      id: "room-aurora",
      created_by: "demo-user",
      room_code: "AURORA-9F",
      name: "Aurora Hall",
      floor: "9F North",
      capacity: 18,
      hourly_rate: 6800,
      status: "occupied",
      location_note: "役員会議や部門横断ミーティング向け",
      notes: "大人数利用に対応しています。",
      created_at: isoInHours(-72),
      updated_at: isoInHours(-1),
    },
  ];

  const reservations: ReservationRow[] = [
    {
      id: "res-1",
      created_by: "demo-user",
      room_id: "room-atlas",
      title: "営業定例ショートMTG",
      organizer_name: "Sales Team",
      organizer_email: "sales@example.com",
      start_at: isoInHours(1),
      end_at: isoInHours(1.05),
      attendee_count: 4,
      status: "confirmed",
      total_price: 240,
      notes: null,
      created_at: isoInHours(-5),
      updated_at: isoInHours(-5),
    },
    {
      id: "res-2",
      created_by: "demo-user",
      room_id: "room-aurora",
      title: "役員レビュー",
      organizer_name: "Executive Office",
      organizer_email: "exec@example.com",
      start_at: isoInHours(3),
      end_at: isoInHours(5),
      attendee_count: 10,
      status: "pending",
      total_price: 13600,
      notes: "承認待ち",
      created_at: isoInHours(-2),
      updated_at: isoInHours(-2),
    },
    {
      id: "res-3",
      created_by: "demo-user",
      room_id: "room-luna",
      title: "来客対応ミーティング",
      organizer_name: "General Affairs",
      organizer_email: "ga@example.com",
      start_at: isoInHours(-2),
      end_at: isoInHours(-1.95),
      attendee_count: 6,
      status: "confirmed",
      total_price: 180,
      notes: null,
      created_at: isoInHours(-6),
      updated_at: isoInHours(-6),
    },
  ];

  const participants: ParticipantRow[] = [
    {
      id: "part-1",
      created_by: "demo-user",
      reservation_id: "res-1",
      name: "Tanaka",
      email: "tanaka@example.com",
      company_name: "Example Corp",
      role: "host",
      attendance_status: "accepted",
      created_at: isoInHours(-5),
    },
    {
      id: "part-2",
      created_by: "demo-user",
      reservation_id: "res-2",
      name: "Sato",
      email: "sato@example.com",
      company_name: "Example Corp",
      role: "approver",
      attendance_status: "invited",
      created_at: isoInHours(-2),
    },
  ];

  const equipment: EquipmentRow[] = [
    {
      id: "eq-1",
      created_by: "demo-user",
      room_id: "room-atlas",
      name: "65inch Monitor",
      category: "display",
      quantity: 1,
      status: "available",
      is_portable: false,
      notes: "会議室常設",
      created_at: isoInHours(-72),
      updated_at: isoInHours(-2),
    },
    {
      id: "eq-2",
      created_by: "demo-user",
      room_id: "room-atlas",
      name: "Web Camera",
      category: "conference",
      quantity: 1,
      status: "available",
      is_portable: true,
      notes: null,
      created_at: isoInHours(-72),
      updated_at: isoInHours(-2),
    },
    {
      id: "eq-3",
      created_by: "demo-user",
      room_id: "room-aurora",
      name: "Projector",
      category: "display",
      quantity: 1,
      status: "in_use",
      is_portable: false,
      notes: "予約中に利用",
      created_at: isoInHours(-72),
      updated_at: isoInHours(-1),
    },
  ];

  return { rooms, reservations, participants, equipment };
}

export function useSupabaseMeetingData(): UseSupabaseMeetingDataResult {
  const configured = isSupabaseConfigured();
  const demoBundle = createDemoBundle();
  const [rooms, setRooms] = useState<RoomRow[]>(configured ? [] : demoBundle.rooms);
  const [reservations, setReservations] = useState<ReservationRow[]>(
    configured ? [] : demoBundle.reservations,
  );
  const [participants, setParticipants] = useState<ParticipantRow[]>(
    configured ? [] : demoBundle.participants,
  );
  const [equipment, setEquipment] = useState<EquipmentRow[]>(
    configured ? [] : demoBundle.equipment,
  );
  const [loading, setLoading] = useState(configured);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const run = async () => {
      const supabase = getSupabaseBrowserClient();
      const [roomsResult, reservationsResult, participantsResult, equipmentResult] =
        await Promise.all([
          supabase.from("rooms").select("*").order("name"),
          supabase.from("reservations").select("*").order("start_at"),
          supabase.from("participants").select("*").order("created_at"),
          supabase.from("equipment").select("*").order("name"),
        ]);

      const firstError =
        roomsResult.error ??
        reservationsResult.error ??
        participantsResult.error ??
        equipmentResult.error;

      if (firstError) {
        setError(firstError.message);
        setLoading(false);
        return;
      }

      setRooms((roomsResult.data ?? []) as RoomRow[]);
      setReservations((reservationsResult.data ?? []) as ReservationRow[]);
      setParticipants((participantsResult.data ?? []) as ParticipantRow[]);
      setEquipment((equipmentResult.data ?? []) as EquipmentRow[]);
      setLoading(false);
    };

    void run();
  }, [configured]);

  const refetch = async () => {
    if (!configured) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    startTransition(() => setRefreshing(true));
    setError(null);

    const [roomsResult, reservationsResult, participantsResult, equipmentResult] =
      await Promise.all([
        supabase.from("rooms").select("*").order("name"),
        supabase.from("reservations").select("*").order("start_at"),
        supabase.from("participants").select("*").order("created_at"),
        supabase.from("equipment").select("*").order("name"),
      ]);

    const firstError =
      roomsResult.error ??
      reservationsResult.error ??
      participantsResult.error ??
      equipmentResult.error;

    if (firstError) {
      setError(firstError.message);
      setRefreshing(false);
      return;
    }

    setRooms((roomsResult.data ?? []) as RoomRow[]);
    setReservations((reservationsResult.data ?? []) as ReservationRow[]);
    setParticipants((participantsResult.data ?? []) as ParticipantRow[]);
    setEquipment((equipmentResult.data ?? []) as EquipmentRow[]);
    setRefreshing(false);
  };

  return {
    rooms,
    reservations,
    participants,
    equipment,
    loading,
    refreshing,
    error,
    configured,
    refetch,
  };
}
