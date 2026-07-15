import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default function ScamsSection() {
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState(null)
  const [cronInfo, setCronInfo] = useState({
    lastRun: null,
    nextRun: null,
    status: 'unknown'
  })
  const [loadingInfo, setLoadingInfo] = useState(true)

  // Fetch cron status on load
  useEffect(() => {
    fetchCronStatus()
  }, [])

  const fetchCronStatus = async () => {
    try {
      setLoadingInfo(true)
      const response = await axios.get(`${API_URL}/admin/cron-status`)
      if (response.data.success) {
        setCronInfo(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching cron status:', error)
      // Fallback: calculate next Monday
      const now = new Date()
      const nextMonday = new Date(now)
      nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7))
      nextMonday.setHours(0, 5, 0, 0) // 00:05 IST = 18:35 UTC previous day
      setCronInfo({
        lastRun: null,
        nextRun: nextMonday.toISOString(),
        status: 'pending'
      })
    } finally {
      setLoadingInfo(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await axios.post(`${API_URL}/admin/trending-scams/generate`)
      setToast({ ok: true, msg: '✅ Trending scams generated successfully!' })
      fetchCronStatus() // Refresh status after generation
    } catch (error) {
      setToast({ ok: false, msg: '❌ Failed to generate trending scams.' })
    } finally {
      setGenerating(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = () => {
    switch(cronInfo.status) {
      case 'running':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Running</span>
      case 'success':
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">✅ Active</span>
      case 'failed':
        return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">❌ Failed</span>
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">⏳ Pending</span>
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-base font-semibold text-[#1A365D]">🔥 Scams</h2>
        {getStatusBadge()}
      </div>

      <div className="px-6 py-5">
        {/* Cron Status */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Last Automatic Run</p>
            <p className="text-sm font-medium text-gray-800">
              {loadingInfo ? 'Loading...' : formatDate(cronInfo.lastRun)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Next Scheduled Run</p>
            <p className="text-sm font-medium text-gray-800">
              {loadingInfo ? 'Loading...' : formatDate(cronInfo.nextRun)}
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Generate Trending Scams</p>
            <p className="text-xs text-gray-500 mt-0.5 max-w-lg">
              Recalculates the top 3 scams based on reports and community engagement from the last 7 days.
              Runs automatically every Monday at 12:05 AM IST.
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

        {/* Toast */}
        {toast && (
          <div className={`mt-4 px-4 py-2.5 rounded-lg text-sm font-medium border ${
            toast.ok
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {toast.ok ? '✅' : '❌'} {toast.msg}
          </div>
        )}

        {/* Help Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <span className="font-medium">How it works:</span> Analyzes verified reports and approved blogs from the last 7 days.
            Scores are calculated based on report count (50%), blog count (25%), and engagement (25%).
          </p>
        </div>
      </div>
    </div>
  )
}