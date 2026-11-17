'use client';

import { createClient } from '@supabase/supabase-js';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type AvailabilitySlot = {
  id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  created_at: string;
}

export type Booking = {
  id: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  service_type: string;
  hours: number;
  preferred_date: string;
  preferred_time: string;
  slot_id: string;
  notes: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
        Relationships: [];
      };
      availability_slots: {
        Row: AvailabilitySlot;
        Insert: {
          id?: string;
          slot_date: string;
          slot_time: string;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slot_date?: string;
          slot_time?: string;
          is_available?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: {
          id?: string;
          created_at?: string;
          customer_name: string;
          email: string;
          phone: string;
          address: string;
          service_type: string;
          hours: number;
          preferred_date: string;
          preferred_time: string;
          slot_id: string;
          notes?: string;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
        };
        Update: {
          id?: string;
          created_at?: string;
          customer_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          service_type?: string;
          hours?: number;
          preferred_date?: string;
          preferred_time?: string;
          slot_id?: string;
          notes?: string;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      admin_reschedule_booking: {
        Args: { p_booking_id: string; p_slot_id: string };
        Returns: undefined;
      };
      create_booking: {
        Args: {
          p_slot_id: string;
          p_customer_name: string;
          p_email: string;
          p_phone: string;
          p_address: string;
          p_service_type: string;
          p_hours: number;
          p_notes: string;
        };
        Returns: Booking;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  if (!client) {
    client = createClient<Database>(url, anonKey);
  }

  return client;
}
