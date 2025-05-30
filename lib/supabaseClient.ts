'use client'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

/**
 * Crea un cliente que guarda la sesión en cookies HTTP-only
 * y lee la URL y la key desde NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export const supabase = createBrowserSupabaseClient()
