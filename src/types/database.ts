// Auto-generated types will go here once the Supabase schema is finalized.
// Run: npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          tier: 'free' | 'member' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          body: string | null
          excerpt: string | null
          cover_url: string | null
          category: 'blog' | 'build' | 'tutorial' | 'material-guide'
          published: boolean
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          price_cents: number
          currency: string
          images: string[]
          vendor_id: string | null
          digital: boolean
          asset_key: string | null
          published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string
          status: 'pending' | 'paid' | 'fulfilled' | 'refunded'
          total_cents: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          starts_at: string
          location: string | null
          url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
