﻿import LogoutPage from "./LogoutPage"
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { 
  FiShield, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiClock, 
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiThumbsUp,
  FiThumbsDown,
  FiPieChart,
  FiBell,
  FiFileText,
  FiImage,
  FiFlag
} from 'react-icons/fi'
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import ScamsSection from './ScamsSection'

const API_URL = 'http://localhost:3000/api'

// â”€â”€â”€ Admin Notes Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AdminNotesModal({ action, reportId, onConfirm, onClose }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const isVerify = action === 'verify'

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm(reportId, notes)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className={`text-base font-semibold mb-1 ${isVerify ? 'text-green-700' : 'text-red-700'}`}>
          {isVerify ? 'âœ… Verify Report' : 'âŒ Reject Report'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {isVerify
            ? 'The blog will be flagged and hidden from public view.'
            : 'The report will be dismissed. The blog remains visible.'}
        </p>
        <label className="text-xs font-semibold text-gray-500 uppercase">Admin Notes (optional)</label>
        <textarea
          className="w-full mt-1 mb-4 p-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C05746]"
          rows={3}
          placeholder="Add notes for the reporter..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-white text-sm transition ${
              isVerify
                ? (loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600')
                : (loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600')
            }`}
          >
            {loading ? 'Saving...' : (isVerify ? 'Confirm Verify' : 'Confirm Reject')}
          </button>
        </div>
      </div>
    </div>
  )
}

// â”€â”€â”€ Blog View Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€ Blog View Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BlogViewModal({ report, onClose, onAction }) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [notesModal, setNotesModal] = useState(null)

  useEffect(() => {
    const blogId = report.blogId?.$oid || report.blogId?.toString() || report.blogId
    axios.get(`${API_URL}/admin/blogs/${blogId}`)
      .then(res => setBlog(res.data.data))
      .catch(() => setFetchError('Could not load blog content.'))
      .finally(() => setLoading(false))
  }, [report.blogId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-base font-semibold text-[#1A365D] flex items-center gap-2">
            <FiFlag className="text-[#C05746]" /> Review Blog Report
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">âœ•</button>
        </div>

        <div className="p-6 space-y-6">

          {/* Report reason */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Report Reason</p>
            <p className="text-sm font-medium text-gray-900">{report.category}</p>
            {report.comments && (
              <p className="text-sm text-gray-600 italic">"{report.comments}"</p>
            )}
            <p className="text-xs text-gray-500">
              Reported by <span className="font-medium">{report.reporterEmail}</span>{' Â· '}
              {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          {/* Blog content */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Blog Content</p>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C05746]"></div>
              </div>
            )}
            {fetchError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">{fetchError}</div>
            )}
            {blog && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{blog.fraudType}</span>
                    {blog.isFlagged && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">ðŸš© Flagged</span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-gray-900">{blog.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    By <span className="font-medium">{blog.authorName || 'Anonymous'}</span>{' Â· '}
                    {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' Â· '}ðŸ‘ {blog.upvotes || 0} Â· ðŸ’¬ {blog.commentCount || 0}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                </div>
                {blog.screenshots?.length > 0 && (
                  <div className="px-5 pb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Screenshots</p>
                    <div className="grid grid-cols-3 gap-2">
                      {blog.screenshots.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="block border border-gray-200 rounded-lg overflow-hidden hover:opacity-80 transition">
                          <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-24 object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {report.status === 'pending' && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setNotesModal({ action: 'verify', reportId: report._id })}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
              >
                <FiThumbsUp size={14} /> Verify Report
              </button>
              <button
                onClick={() => setNotesModal({ action: 'reject', reportId: report._id })}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
              >
                <FiThumbsDown size={14} /> Reject Report
              </button>
            </div>
          )}
          {report.status !== 'pending' && (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
              report.status === 'verified' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {report.status === 'verified' ? 'âœ… This report was verified.' : 'âŒ This report was rejected.'}
              {report.adminNotes && <span className="ml-2 font-normal">Notes: {report.adminNotes}</span>}
            </div>
          )}
        </div>
      </div>

      {notesModal && (
        <AdminNotesModal
          action={notesModal.action}
          reportId={notesModal.reportId}
          onConfirm={async (id, notes) => {
            await onAction(id, notes, notesModal.action)
            setNotesModal(null)
            onClose()
          }}
          onClose={() => setNotesModal(null)}
        />
      )}
    </div>
  )
}

// â”€â”€â”€ Blog Reports Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BlogReportsSection() {
  const [blogReports, setBlogReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [viewReport, setViewReport] = useState(null)

  const fetchBlogReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/admin/blog-reports`)
      setBlogReports(res.data.data || [])
    } catch (err) {
      console.error('Blog reports fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBlogReports() }, [fetchBlogReports])

  const handleAction = async (reportId, adminNotes, action) => {
    await axios.put(`${API_URL}/admin/blog-reports/${reportId}/${action}`, { adminNotes })
    setBlogReports(prev => prev.map(r =>
      r._id === reportId ? { ...r, status: action === 'verify' ? 'verified' : 'rejected', adminNotes } : r
    ))
  }

  const filtered = blogReports.filter(r => r.status === activeTab)
  const pendingCount = blogReports.filter(r => r.status === 'pending').length

  const tabBtn = (tab, label, count) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative px-5 py-3 text-sm font-medium transition ${
        activeTab === tab ? 'border-b-2 border-[#C05746] text-[#C05746]' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
      {count > 0 && (
        <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
          {count}
        </span>
      )}
    </button>
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1A365D] flex items-center gap-2">
          <FiFlag className="text-[#C05746]" /> Blog Reports
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
              {pendingCount} pending
            </span>
          )}
        </h2>
        <button onClick={fetchBlogReports} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition">
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="border-b border-gray-200 flex">
        {tabBtn('pending', 'Pending', pendingCount)}
        {tabBtn('verified', 'Verified', 0)}
        {tabBtn('rejected', 'Rejected', 0)}
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">No {activeTab} blog reports</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blog Title</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(report => (
                <tr key={report._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-900 max-w-[160px] block truncate">{report.blogTitle}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full font-medium whitespace-nowrap">{report.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{report.reporterEmail}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500 max-w-[140px] block truncate">{report.comments || 'â€”'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setViewReport(report)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
                      >
                        <FiEye size={11} /> View Blog
                      </button>
                      {activeTab !== 'pending' && (
                        <span className={`text-xs font-medium ${
                          report.status === 'verified' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {report.status === 'verified' ? 'âœ… Verified' : 'âŒ Rejected'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewReport && (
        <BlogViewModal
          report={viewReport}
          onClose={() => setViewReport(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}
function App() {
  const [reports, setReports] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [stats, setStats] = useState({
    pendingReports: 0,
    verifiedMules: 0,
    totalReports: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFraudType, setSelectedFraudType] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const reportsRes = await axios.get(`${API_URL}/reports`)
      const statsRes = await axios.get(`${API_URL}/stats`)
      
      setReports(reportsRes.data.data || [])
      setStats(statsRes.data.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (reportId) => {
    try {
      setActionLoadingId(reportId)
      // Optimistic update
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: 'verified' } : r))
      if (selectedReport && selectedReport._id === reportId) setSelectedReport({ ...selectedReport, status: 'verified' })
      await axios.put(`${API_URL}/reports/${reportId}/verify`)
      setActionLoadingId(null)
      setShowModal(false)
    } catch (error) {
      console.error('Verify error:', error)
      setActionLoadingId(null)
      fetchData()
    }
  }

  const handleReject = async (reportId) => {
    try {
      setActionLoadingId(reportId)
      // Optimistic update
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: 'rejected' } : r))
      if (selectedReport && selectedReport._id === reportId) setSelectedReport({ ...selectedReport, status: 'rejected' })
      await axios.put(`${API_URL}/reports/${reportId}/reject`)
      setActionLoadingId(null)
      setShowModal(false)
    } catch (error) {
      console.error('Reject error:', error)
      setActionLoadingId(null)
      fetchData()
    }
  }

  const sortedReports = [...reports].sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))

  const filteredReports = sortedReports.filter(report => {
    if (activeTab === 'pending' && report.status !== 'pending') return false
    if (activeTab === 'verified' && report.status !== 'verified') return false
    if (activeTab === 'rejected' && report.status !== 'rejected') return false
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchesSearch = (report.accountNumber && report.accountNumber.toString().toLowerCase().includes(term)) || 
             (report.phoneNumber && report.phoneNumber.toString().toLowerCase().includes(term)) ||
             (report.reporterPhone && report.reporterPhone.toString().toLowerCase().includes(term)) ||
             (report.fraudType && report.fraudType.toLowerCase().includes(term))
      if (!matchesSearch) return false
    }
    
    if (selectedFraudType && report.status === 'verified') {
      let reportType = report.fraudType || 'No reason provided'
      if (!report.fraudType || report.fraudType === '' || report.fraudType === 'Not specified') {
        reportType = 'No reason provided'
      }
      return reportType === selectedFraudType
    }
    
    return true
  })

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedFraudType, activeTab])

  const fraudTypes = {}
  reports.forEach(report => {
    if (report.status === 'verified') {
      let type = report.fraudType || 'No reason provided'
      if (!report.fraudType || report.fraudType === '' || report.fraudType === 'Not specified' ||
          report.fraudType === 'no reason' || report.fraudType === 'No reason') {
        type = 'No reason provided'
      }
      fraudTypes[type] = (fraudTypes[type] || 0) + 1
    }
  })
  
  const pieData = Object.entries(fraudTypes).map(([name, value]) => ({ 
    name: name.length > 20 ? name.substring(0, 17) + '...' : name, 
    fullName: name,
    value,
    percent: Math.round((value / reports.filter(r => r.status === 'verified').length) * 100)
  }))
  
  const COLORS = ['#C05746', '#FFB74D', '#4CAF50', '#2196F3', '#9C27B0', '#00BCD4', '#FF9800']

  const pendingCount = reports.filter(r => r.status === 'pending').length
  const verifiedCount = reports.filter(r => r.status === 'verified').length
  const verifiedMules = [...new Set(reports.filter(r => r.status === 'verified').map(r => {
    if (r.accountNumber) return r.accountNumber.toString()
    if (r.phoneNumber) return r.phoneNumber.toString()
    return null
  }).filter(Boolean))].length
  const successRate = stats.totalReports ? Math.round((verifiedCount / stats.totalReports) * 100) : 0
  const pendingReportsList = reports.filter(r => r.status === 'pending').sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))

  if (isLoggedOut) {
    return <LogoutPage onLogin={() => setIsLoggedOut(false)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C05746] mx-auto mb-4"></div>
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C05746] to-[#1A365D] rounded-xl flex items-center justify-center shadow-md">
                <FiShield className="text-white text-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#1A365D] to-[#C05746] bg-clip-text text-transparent">FraudShield</span>
              <span className="text-xs text-gray-500 block -mt-1">Admin Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <FiRefreshCw size={16} />
              <span className="text-sm">Refresh</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition px-3 py-1"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#1A365D] to-[#C05746] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${showAdminMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAdminMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                  <button
                    onClick={() => {
                      setShowAdminMenu(false)
                      setIsLoggedOut(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Success rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{successRate}%</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-green-500 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Total reports</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalReports || 0}</p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiFileText className="text-blue-500 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Verified mules</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{verifiedMules}</p>
                <p className="text-xs text-green-600 mt-1">âœ“ Confirmed fraud</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <FiAlertTriangle className="text-red-500 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-yellow-500 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Active alerts</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{pendingCount}</p>
                <p className="text-xs text-gray-400 mt-1">New this week</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiBell className="text-purple-500 text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reports Section */}
        {pendingReportsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1A365D] mb-4 flex items-center gap-2">
              <FiClock className="text-yellow-500" />
              Pending Verification ({pendingReportsList.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingReportsList.slice(0, 6).map((report) => (
                <div key={report._id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {report.accountNumber ? `#${report.accountNumber}` : (report.phoneNumber ? report.phoneNumber : 'Unknown')}
                    </span>
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">PENDING</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Type:</span> {report.fraudType || 'Not specified'}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(report.reportedAt).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(report._id)}
                      disabled={actionLoadingId === report._id}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${actionLoadingId === report._id ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                      <FiThumbsUp size={12} />
                      {actionLoadingId === report._id ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleReject(report._id)}
                      disabled={actionLoadingId === report._id}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${actionLoadingId === report._id ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    >
                      <FiThumbsDown size={12} />
                      {actionLoadingId === report._id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pendingReportsList.length > 6 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                +{pendingReportsList.length - 6} more pending reports. Go to "All Reports" tab to see all.
              </p>
            )}
          </div>
        )}

        {/* Fraud Types + Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FiPieChart className="text-gray-400" />
              <h3 className="text-base font-semibold text-[#1A365D]">Fraud types</h3>
            </div>
            {pieData.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-gray-400">
                No verified frauds yet
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      onClick={(data) => {
                        setSelectedFraudType(data.payload.fullName)
                        setActiveTab('verified')
                      }}
                      cursor="pointer"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} reports (${props.payload.percent}%)`, props.payload.fullName]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {pieData.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedFraudType(item.fullName)
                        setActiveTab('verified')
                      }}
                      className={`text-xs px-2 py-1 rounded-full transition ${
                        selectedFraudType === item.fullName && activeTab === 'verified'
                          ? 'bg-[#1A365D] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {item.name}: {item.percent}%
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#1A365D]">Recent Activity</h3>
              <span className="text-xs text-gray-500">Last 5 reports</span>
            </div>
            <div className="space-y-3">
              {sortedReports.slice(0, 5).length === 0 ? (
                <div className="text-center text-gray-400 py-8">No reports yet</div>
              ) : (
                sortedReports.slice(0, 5).map((report) => (
                  <div 
                    key={report._id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => {
                      setSelectedReport(report)
                      setShowModal(true)
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {report.accountNumber ? `#${report.accountNumber}` : (report.phoneNumber ? report.phoneNumber : 'Unknown')}
                        </span>
                        {report.status === 'verified' && (
                          <span className="text-green-500 text-xs">âœ… Verified</span>
                        )}
                        {report.status === 'pending' && (
                          <span className="text-yellow-500 text-xs">â³ Pending</span>
                        )}
                        {report.status === 'rejected' && (
                          <span className="text-red-500 text-xs">âŒ Rejected</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {report.fraudType && report.fraudType !== 'Not specified' ? report.fraudType : 'No reason provided'}
                        </span>
                        <span className="text-xs text-gray-300">Â·</span>
                        <span className="text-xs text-gray-500">
                          {new Date(report.reportedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <FiEye className="text-gray-400 text-sm" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              <button
                onClick={() => {
                  setActiveTab('pending')
                  setSelectedFraudType(null)
                }}
                className={`px-6 py-3 text-sm font-medium transition ${
                  activeTab === 'pending'
                    ? 'border-b-2 border-[#C05746] text-[#C05746]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => {
                  setActiveTab('verified')
                  setSelectedFraudType(null)
                }}
                className={`px-6 py-3 text-sm font-medium transition ${
                  activeTab === 'verified'
                    ? 'border-b-2 border-[#C05746] text-[#C05746]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Verified ({verifiedCount})
              </button>
              <button
                onClick={() => {
                  setActiveTab('rejected')
                  setSelectedFraudType(null)
                }}
                className={`px-6 py-3 text-sm font-medium transition ${
                  activeTab === 'rejected'
                    ? 'border-b-2 border-[#C05746] text-[#C05746]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => {
                  setActiveTab('all')
                  setSelectedFraudType(null)
                }}
                className={`px-6 py-3 text-sm font-medium transition ${
                  activeTab === 'all'
                    ? 'border-b-2 border-[#C05746] text-[#C05746]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Reports
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by account number or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C05746] focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      No reports found in this category
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">
                      {report.accountNumber ? `#${report.accountNumber}` : (report.phoneNumber ? report.phoneNumber : 'Unknown')}
                    </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{report.phoneNumber || report.reporterPhone || 'Anonymous'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {report.fraudType && report.fraudType !== 'Not specified' && report.fraudType !== '' ? report.fraudType : 'No reason provided'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {new Date(report.reportedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {report.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <FiClock size={10} />
                            Pending
                          </span>
                        )}
                        {report.status === 'verified' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <FiCheckCircle size={10} />
                            Verified
                          </span>
                        )}
                        {report.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <FiAlertTriangle size={10} />
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {/* View button for ALL reports */}
                          <button
                            onClick={() => {
                              setSelectedReport(report)
                              setShowModal(true)
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition"
                          >
                            <FiEye size={10} />
                            View
                          </button>
                          
                          {/* Verify/Reject buttons only for pending */}
                          {report.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleVerify(report._id)
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                              >
                                <FiThumbsUp size={10} />
                                Verify
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReject(report._id)
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                              >
                                <FiThumbsDown size={10} />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
              <div>
                Showing {filteredReports.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg transition text-sm ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      currentPage === idx + 1
                        ? 'bg-[#C05746] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 rounded-lg transition text-sm ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Next
                </button>
              </div>
              {selectedFraudType && (
                <div className="text-[#C05746]">
                  Filtered by: {selectedFraudType}
                  <button onClick={() => {
                    setSelectedFraudType(null)
                    setActiveTab('all')
                  }} className="ml-2 underline">Clear</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Scams Section */}
        <div className="mt-8">
          <ScamsSection />
        </div>
        {/* Blog Reports Section */}
        <div className="mt-8">
          <BlogReportsSection />
        </div>
      </div>

      {/* Modal - with Description, Source and Evidence Images */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#1A365D]">Report Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">âœ•</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Account Number</label>
                <p className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">{selectedReport.accountNumber}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Phone Number</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">{selectedReport.phoneNumber || selectedReport.reporterPhone || 'Anonymous'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Fraud Type</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">{selectedReport.fraudType || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                <div className="bg-gray-50 p-2 rounded mt-1">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedReport.description || 'No description provided'}
                  </p>
                </div>
              </div>
              
              {/* Evidence Images Section */}
              {selectedReport.evidenceImages && selectedReport.evidenceImages.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                    <FiImage size={12} /> Evidence Screenshots
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {selectedReport.evidenceImages.map((imgUrl, idx) => (
                      <a 
                        key={idx} 
                        href={imgUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block border border-gray-200 rounded-lg overflow-hidden hover:opacity-80 transition hover:shadow-md"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Evidence ${idx + 1}`} 
                          className="w-full h-24 object-cover"
                        />
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Click on images to view full size</p>
                </div>
              )}
              
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Date & Time</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">{new Date(selectedReport.reportedAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Status</label>
                <p className="text-sm capitalize text-gray-900 bg-gray-50 p-2 rounded mt-1">{selectedReport.status}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Source</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                  {selectedReport.source === 'web_app' ? 'ðŸŒ Web App' : (selectedReport.source === 'whatsapp' ? 'ðŸ“± WhatsApp' : 'Unknown')}
                </p>
              </div>
              {/* Technical AI Analysis for admin */}
              {selectedReport.aiAnalysis && (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-[#1A365D] mb-2">AI Analysis (Technical)</h4>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div><strong>Combined:</strong> {(selectedReport.aiAnalysis.combinedScore * 100).toFixed(0)}%</div>
                    <div><strong>Keywords score:</strong> {(selectedReport.aiAnalysis.keywordScore * 100).toFixed(0)}%</div>
                    <div><strong>Matched keywords:</strong> {(selectedReport.aiAnalysis.keywordMatches || []).join(', ') || 'None'}</div>
                    <div><strong>BERT predicted:</strong> {selectedReport.aiAnalysis.bertPredicted || 'N/A'} <small>(score {(selectedReport.aiAnalysis.bertScore * 100).toFixed(0)}%)</small></div>
                    <div><strong>Image relevance:</strong> {(selectedReport.aiAnalysis.imageRelevance * 100).toFixed(0)}%</div>
                    <div><strong>OCR relevance:</strong> {(selectedReport.aiAnalysis.ocrRelevance * 100).toFixed(0)}%</div>
                    <div><strong>Decision:</strong> {selectedReport.aiAnalysis.decision}</div>
                    <div className="mt-2"><strong>Reasons:</strong>
                      <ul className="list-disc ml-5 text-[12px] mt-1">
                        {(selectedReport.aiAnalysis.reasons || []).map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
                {selectedReport.status === 'pending' && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleVerify(selectedReport._id)} disabled={actionLoadingId === selectedReport._id} className={`flex-1 py-2 rounded-lg text-white transition ${actionLoadingId === selectedReport._id ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}>
                  {actionLoadingId === selectedReport._id ? 'âœ“ Verifying...' : 'âœ“ Verify'}
                </button>
                <button onClick={() => handleReject(selectedReport._id)} disabled={actionLoadingId === selectedReport._id} className={`flex-1 py-2 rounded-lg text-white transition ${actionLoadingId === selectedReport._id ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}>
                  {actionLoadingId === selectedReport._id ? 'âœ— Rejecting...' : 'âœ— Reject'}
                </button>
              </div>
            )}
            {selectedReport.status !== 'pending' && (
              <button onClick={() => setShowModal(false)} className="w-full mt-6 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">Close</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

