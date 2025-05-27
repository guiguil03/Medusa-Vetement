"use client"

import { useState } from "react"

export default function ForceRefresh() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleRefresh = async () => {
    setLoading(true)
    setMessage("")
    
    try {
      // Appel de l'API de revalidation avec méthode POST
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'manual-refresh',
          data: { id: 'all' }
        })
      })
      const data = await res.json()
      
      if (res.ok) {
        setMessage("✅ Cache effacé avec succès. Rechargez la page.")
        // Forcer le rechargement après 1 seconde
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setMessage(`❌ Erreur: ${data.message}`)
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={handleRefresh}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-800 transition"
      >
        {loading ? "Actualisation..." : "Forcer l'actualisation"}
      </button>
      {message && (
        <div className="mt-2 p-2 bg-white rounded-md shadow-lg text-sm">
          {message}
        </div>
      )}
    </div>
  )
}
