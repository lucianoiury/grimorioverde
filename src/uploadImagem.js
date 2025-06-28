import { supabase } from './supabaseClient'

export async function uploadImagem(file) {
  if (!file) return null
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`
  const { error } = await supabase.storage.from('ervas').upload(fileName, file)
  if (error) return null
  const { data: publicUrl } = supabase.storage.from('ervas').getPublicUrl(fileName)
  return publicUrl?.publicUrl || null
}
