import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ecfbjakheuecddoanadb.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZmJqYWtoZXVlY2Rkb2FuYWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTgzMDYsImV4cCI6MjA2NDAzNDMwNn0.IAmtmLQCuxiOtZIbb3n5sAazfNxy9FQcnzkmr_naGDw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
