import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default function ScamsSection() {
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState(null)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await axios.post(`${API_URL}/admin/trending-scams/generate`)
      setToast({ ok: true, msg: 'Trending scams generated successfully!' })
    } catch {
      setToast({ ok: false, msg: 'Failed to generate trending scams.' })
    } finally {
      setGenerating(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-[#1A365D]">🔥 Scams</h2>
      </div>

      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">Generate Trending Scams</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Recalculates the top 3 scams based on reports and community engagement from the last 7 days.
            Runs automatically every Monday at midnight IST.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
            generating ? 'bg-orange-300 cursor-not-allowed' : 'bg-[#C05746] hover:bg-[#a03e2e]'
          }`}
        >
          {generating && (
            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {generating ? 'Generating...' : '⚡ Generate Now'}
        </button>
      </div>

      {toast && (
        <div className={`mx-6 mb-4 px-4 py-2.5 rounded-lg text-sm font-medium border ${
          toast.ok
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {toast.ok ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  )
}
