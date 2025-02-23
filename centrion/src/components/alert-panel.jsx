"use client"

export function AlertPanel({ alert, cameraName, onResolve }) {
  return (
    <div className={`p-3 rounded-lg border ${
      alert.status === 'active' ? 'border-red-200 bg-red-50' : 'border-slate-200'
    }`}>
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm">
          {alert.detectionType}
        </h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          alert.status === 'active' 
            ? 'bg-red-500 text-white' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          {alert.status === 'active' ? 'Active' : 'Resolved'}
        </span>
      </div>
      
      <div className="text-xs text-slate-500 mt-1 mb-2">
        {new Date(alert.timestamp).toLocaleString()}
      </div>
      
      {alert.imageUrl && (
        <div className="mb-2 rounded overflow-hidden">
          <img 
            src={alert.imageUrl} 
            alt={alert.detectionType}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      <p className="text-xs text-slate-600 mb-3">
        {alert.context}
      </p>
      
      {alert.status === 'active' && (
        <button 
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
          onClick={() => onResolve(alert.id)}
        >
          Mark as Resolved
        </button>
      )}
    </div>
  )
}