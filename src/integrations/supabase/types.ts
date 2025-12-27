export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          provider_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          provider_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          deleted_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          deleted_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          breed: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          photo_url: string | null
          size: string | null
          updated_at: string | null
          weight: number | null
          deleted_at: string | null
        }
        Insert: {
          breed?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          photo_url?: string | null
          size?: string | null
          updated_at?: string | null
          weight?: number | null
          deleted_at?: string | null
        }
        Update: {
          breed?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          pet_type?: Database["public"]["Enums"]["pet_type"]
          photo_url?: string | null
          size?: string | null
          updated_at?: string | null
          weight?: number | null
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string | null
          full_name: string
          id: string
          payment_completed: boolean | null
          payment_completed_at: string | null
          phone: string | null
          state: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | "admin"
          is_admin: boolean
          is_blocked: boolean
          deleted_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          full_name: string
          id: string
          payment_completed?: boolean | null
          payment_completed_at?: string | null
          phone?: string | null
          state?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_type"] | "admin"
          is_admin?: boolean
          is_blocked?: boolean
          deleted_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          payment_completed?: boolean | null
          payment_completed_at?: string | null
          phone?: string | null
          state?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | "admin"
          is_admin?: boolean
          is_blocked?: boolean
          deleted_at?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          business_name: string | null
          cnpj: string
          created_at: string | null
          description: string | null
          experience: string | null
          facebook: string | null
          id: string
          instagram: string | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
          verified: boolean | null
          youtube: string | null
          deleted_at: string | null
        }
        Insert: {
          business_name?: string | null
          cnpj: string
          created_at?: string | null
          description?: string | null
          experience?: string | null
          facebook?: string | null
          id: string
          instagram?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          verified?: boolean | null
          youtube?: string | null
          deleted_at?: string | null
        }
        Update: {
          business_name?: string | null
          cnpj?: string
          created_at?: string | null
          description?: string | null
          experience?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          verified?: boolean | null
          youtube?: string | null
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string | null
          id: string
          pet_id: string | null
          provider_id: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          pet_id?: string | null
          provider_id: string
          rating: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          pet_id?: string | null
          provider_id?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          message: string | null
          pet_id: string | null
          provider_id: string
          scheduled_date: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          message?: string | null
          pet_id?: string | null
          provider_id: string
          scheduled_date?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          message?: string | null
          pet_id?: string | null
          provider_id?: string
          scheduled_date?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          available: boolean | null
          base_price: number | null
          category: Database["public"]["Enums"]["service_category"]
          created_at: string | null
          description: string | null
          id: string
          photos: string[] | null
          provider_id: string
          title: string
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          available?: boolean | null
          base_price?: number | null
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          photos?: string[] | null
          provider_id: string
          title: string
          updated_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          available?: boolean | null
          base_price?: number | null
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          photos?: string[] | null
          provider_id?: string
          title?: string
          updated_at?: string | null
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_status: "pending" | "completed" | "failed"
      pet_type: "dog" | "cat" | "bird" | "fish" | "other"
      request_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "completed"
        | "cancelled"
      service_category:
        | "passeio"
        | "banho_tosa"
        | "veterinario"
        | "hospedagem"
        | "taxi_pet"
        | "adestramento"
      user_type: "client" | "provider"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
