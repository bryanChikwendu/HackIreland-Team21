"use client"

import { useEffect, useState } from "react"
import { 
  Bell, 
  Camera, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Maximize,
  Settings,
  Menu,
  LogOut,
  Map,
  BarChart3,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input";
import { useRef } from "react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CameraFeed } from "@/components/camera-feed"
import { AlertPanel } from "@/components/alert-panel"
import { mockCameras, mockAlerts, mockLocations } from "@/lib/mock-data"

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [cameras, setCameras] = useState(mockCameras)
  const [alerts, setAlerts] = useState(mockAlerts)
  const [activeAlerts, setActiveAlerts] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()

  const fullscreenRef = useRef(null)

  const handleFullscreen = () => {
    if (fullscreenRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        fullscreenRef.current.requestFullscreen()
      }
    }
  }
  
  // Client-side only code
  useEffect(() => {
    setIsClient(true)
    
    // Check auth status
    const auth = JSON.parse(localStorage.getItem("centrion-auth") || "{}")
    if (!auth.isLoggedIn) {
      window.location.href = "/"
    }
    
    // Get active alerts count
    const active = alerts.filter(alert => alert.status === 'active')
    setActiveAlerts(active)
    
    // Select the first camera by default
    if (cameras.length > 0 && !selectedCamera) {
      setSelectedCamera(cameras[0].id)
    }
    
    // Simulate receiving a new alert
    const timer = setTimeout(() => {
      const newAlert = {
        id: `alert-${alerts.length + 1}`,
        cameraId: 'warehouse',
        timestamp: new Date().getTime(),
        detectionType: 'Weapon Detected',
        confidence: 0.89,
        status: 'active',
        context: "Object identified as a potential knife visible in person's hand. Individual appears to be looking around suspiciously.",
        imageUrl: "/alert-3.jpg"
      }
      
      setAlerts(prev => [newAlert, ...prev])
      setActiveAlerts(prev => [newAlert, ...prev])
      
      toast({
        title: "Security Alert",
        description: "Potential weapon detected in Warehouse camera",
        variant: "destructive",
      })
    }, 15000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem("centrion-auth")
    window.location.href = "/"
  }
  
  const handleResolveAlert = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' } 
          : alert
      )
    )
    
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId))
    
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved.",
    })
  }
  
  if (!isClient) return null

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <div className={`bg-slate-900 text-white w-64 flex-shrink-0 fixed inset-y-0 left-0 z-50 lg:static lg:block transition-transform duration-200 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-400" />
            <span className="text-lg font-semibold">Centrion</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setIsMenuOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Nav Menu */}
        <nav className="p-4 space-y-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase">Monitoring</h3>
            <ul className="space-y-1">
              <li>
                <Button variant="ghost" className="w-full justify-start text-white" asChild>
                  <a href="/dashboard" className="flex items-center">
                    <Camera className="w-4 h-4 mr-3" />
                    <span>Cameras</span>
                  </a>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-slate-400" asChild>
                  <a href="#" className="flex items-center">
                    <Map className="w-4 h-4 mr-3" />
                    <span>Locations</span>
                  </a>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-slate-400" asChild>
                  <a href="#" className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-3" />
                    <span>Alerts</span>
                    {activeAlerts.length > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {activeAlerts.length}
                      </Badge>
                    )}
                  </a>
                </Button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase">Analytics</h3>
            <ul className="space-y-1">
              <li>
                <Button variant="ghost" className="w-full justify-start text-slate-400" asChild>
                  <a href="#" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-3" />
                    <span>Reports</span>
                  </a>
                </Button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase">System</h3>
            <ul className="space-y-1">
              <li>
                <Button variant="ghost" className="w-full justify-start text-slate-400" asChild>
                  <a href="#" className="flex items-center">
                    <Users className="w-4 h-4 mr-3" />
                    <span>Users</span>
                  </a>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start text-slate-400" asChild>
                  <a href="#" className="flex items-center">
                    <Settings className="w-4 h-4 mr-3" />
                    <span>Settings</span>
                  </a>
                </Button>
              </li>
            </ul>
          </div>
        </nav>
        
        {/* User */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-white">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
                    SA
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Security Admin</p>
                    <p className="text-xs text-slate-400">admin@centrion.io</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 lg:px-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <h1 className="text-xl font-semibold hidden lg:block">Security Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {activeAlerts.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {activeAlerts.length > 0 ? (
                  activeAlerts.slice(0, 5).map(alert => (
                    <DropdownMenuItem key={alert.id} className="cursor-pointer py-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">{alert.detectionType}</div>
                          <div className="text-sm text-muted-foreground">
                            {cameras.find(c => c.id === alert.cameraId)?.name} • {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No active alerts
                  </div>
                )}
                {activeAlerts.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center font-medium">
                      View all alerts
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>System Settings</DropdownMenuItem>
                <DropdownMenuItem>Alert Configuration</DropdownMenuItem>
                <DropdownMenuItem>Camera Management</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Tabs defaultValue="cameras" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="cameras" className="text-sm">
                  Cameras
                </TabsTrigger>
                <TabsTrigger value="locations" className="text-sm">
                  Locations
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-sm">
                  Alerts {activeAlerts.length > 0 && `(${activeAlerts.length})`}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="Search..."
                  className="w-64 h-9"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Cameras</DropdownMenuItem>
                    <DropdownMenuItem>Active Alerts Only</DropdownMenuItem>
                    <DropdownMenuItem>By Location</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <TabsContent value="cameras" className="flex-1 space-y-6">
              {/* Camera Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cameras.map(camera => (
                <div
                  key={camera.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition duration-200 ease-in-out ${
                    selectedCamera === camera.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-slate-300'
                  }`}
                  onClick={() => setSelectedCamera(camera.id)}
                >
                  <div className="relative aspect-video bg-slate-200">
                    {/* Pass streamUrl if available */}
                    <CameraFeed cameraId={camera.id} streamUrl={camera.streamUrl} />

                    {/* Camera status indicator */}
                    <div className="absolute top-2 right-2 flex items-center space-x-1.5 bg-slate-900/70 text-white text-xs px-2 py-1 rounded-full">
                      <span className={`h-2 w-2 rounded-full ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>{camera.status === 'active' ? 'Live' : 'Offline'}</span>
                    </div>

                    {/* Alert indicator */}
                    {alerts.some(a => a.cameraId === camera.id && a.status === 'active') && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Alert</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{camera.name}</h3>
                    <p className="text-sm text-slate-500">{camera.location}</p>
                  </div>
                </div>
              ))}
              </div>
              
              {/* Selected Camera View */}
              {selectedCamera && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ marginBottom: '2rem' }}>
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        {cameras.find(c => c.id === selectedCamera)?.name}
                      </h3>
                      <Button variant="outline" size="sm" onClick={handleFullscreen}>
                        <Maximize className="h-4 w-4 mr-2" />
                        Fullscreen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x">
                    <div className="lg:col-span-2" ref={fullscreenRef}>
                      <div className="aspect-video bg-slate-200 relative">
                        <CameraFeed cameraId={selectedCamera} fullView={true} streamUrl={cameras.find(c => c.id === selectedCamera)?.streamUrl} />
                      </div>
                    </div>
                    
                    <div className="p-4 max-h-[500px] overflow-auto">
                      <h4 className="font-medium mb-4">Recent Activity</h4>
                      <div className="space-y-4">
                        {alerts
                          .filter(alert => alert.cameraId === selectedCamera)
                          .slice(0, 10)
                          .map((alert) => (
                            <AlertPanel
                              key={alert.id}
                              alert={alert}
                              cameraName={cameras.find(c => c.id === alert.cameraId)?.name}
                              onResolve={() => handleResolveAlert(alert.id)}
                            />
                          ))}
                        
                        {alerts.filter(alert => alert.cameraId === selectedCamera).length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                            <p>No recent alerts for this camera</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="locations" className="flex-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Location Map</h3>
                </div>
                <div className="p-8 flex items-center justify-center h-[600px] bg-slate-100">
                  <div className="text-center">
                    <Map className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-500">Interactive map would be displayed here</p>
                    <p className="text-sm text-slate-400 mt-2">Showing {mockLocations.length} locations and {cameras.length} cameras</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="flex-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">All Alerts</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-3 text-left font-medium">Time</th>
                        <th className="p-3 text-left font-medium">Camera</th>
                        <th className="p-3 text-left font-medium">Type</th>
                        <th className="p-3 text-left font-medium">Confidence</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((alert) => (
                        <tr key={alert.id} className="border-b hover:bg-slate-50">
                          <td className="p-3 text-sm text-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3 text-sm font-medium text-foreground">
                            {cameras.find(c => c.id === alert.cameraId)?.name}
                          </td>
                          <td className="p-3 text-sm">
                            {alert.detectionType}
                          </td>
                          <td className="p-3 text-sm">
                            {Math.round(alert.confidence * 100)}%
                          </td>
                          <td className="p-3 text-sm">
                            <Badge variant={alert.status === 'active' ? 'destructive' : 'outline'}>
                              {alert.status === 'active' ? 'Active' : 'Resolved'}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" onClick={() => setSelectedCamera(alert.cameraId)}>
                                View
                              </Button>
                              {alert.status === 'active' && (
                                <Button 
                                  size="sm"
                                  variant="outline" 
                                  onClick={() => handleResolveAlert(alert.id)}
                                >
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}