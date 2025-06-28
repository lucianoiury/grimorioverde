// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wewkvswrqqynhsvzyxnl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indld2t2c3dycXF5bmhzdnp5eG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzg5ODksImV4cCI6MjA2NTk1NDk4OX0.imJ6XN_lvctMA1dKSj64f6xsEHvKvIXDjVnHTBKI-i4'

export const supabase = createClient(supabaseUrl, supabaseKey)
