// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace 'YOUR_ACTUAL_PROJECT_URL' with the Project URL from Supabase API settings.
// It will look like: 'https://your-project-ref.supabase.co'
const supabaseUrl = 'https://bwsvhswkhgpjgzckbagb.supabase.co' // <-- THIS IS THE CORRECT FORMAT

// The key you have looks correct for an anon public key, but confirm it against your dashboard.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3c3Zoc3draGdwamd6Y2tiYWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NzM5MjEsImV4cCI6MjA2NTA0OTkyMX0.yN494xQKsdXtRJlsqGRA1D5fvskHczXatAS1y4rd6_U'

export const supabase = createClient(supabaseUrl, supabaseKey)