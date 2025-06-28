import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export function useErvas() {
  const [ervas, setErvas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchErvas() {
      setLoading(true)
      const { data, error } = await supabase
        .from('ervas')
        .select('*')
        .order('nome_popular', { ascending: true })
      if (error) setError(error)
      else setErvas(data)
      setLoading(false)
    }
    fetchErvas()
  }, [])

  return { ervas, loading, error }
}
