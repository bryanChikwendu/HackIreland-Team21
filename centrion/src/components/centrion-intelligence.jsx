

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Play, Pause, StopCircle, ChevronRight, Clock, Search } from 'lucide-react';

const TimelineScrubber = ({ duration = 15, currentTime = 0, highlights = [], onTimeChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef(null);

  // Generate time markers for every second
  const timeMarkers = Array.from({ length: Math.ceil(duration) }, (_, i) => i);

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = Math.max(0, Math.min(duration, percentage * duration));
    onTimeChange(newTime);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Timeline</div>
      <div 
        ref={timelineRef}
        className="relative h-24 bg-slate-900 rounded-md cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
      >
        {/* Time markers */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-2 pt-1">
          {timeMarkers.map((second) => (
            <div key={second} className="text-xs text-slate-500">{second}s</div>
          ))}
        </div>

        {/* Progress bar */}
        <div 
          className="absolute top-6 left-0 h-12 bg-blue-500/20"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />

        {/* Highlight ranges */}
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className="absolute top-6 h-12 bg-red-500/20"
            style={{
              left: `${(highlight.start / duration) * 100}%`,
              width: `${((highlight.end - highlight.start) / duration) * 100}%`
            }}
          />
        ))}

        {/* Current time indicator */}
        <div
          className="absolute top-0 w-0.5 h-full bg-blue-500"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

const CentrionIntelligence = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [highlights, setHighlights] = useState([]);

  // Mock video feeds for demonstration
  const mockVideoFeeds = [
    { id: 1, name: 'Entrance Camera - Morning', duration: 15 },
    { id: 2, name: 'Lobby Feed - Afternoon', duration: 15 },
    { id: 3, name: 'Parking Lot - Evening', duration: 15 }
  ];

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      type: 'user'
    };

    // Mock response with highlight range
    const mockResponse = {
      id: Date.now() + 1,
      text: 'Person detected in requested timeframe',
      type: 'assistant',
      timestamp: '00:05 - 00:08',
      frameUrl: '/api/placeholder/640/360'
    };

    // Add a mock highlight range
    setHighlights(prev => [...prev, { start: 5, end: 8 }]);

    setMessages(prev => [...prev, newMessage, mockResponse]);
    setInputMessage('');
  };

  const toggleAnalysis = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  return (
    <div className="h-full grid grid-cols-12 gap-6">
      {/* Left Column - Video Player and Controls */}
      <div className="col-span-7 space-y-6">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Video Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <Tabs defaultValue="feeds" className="flex-1 flex flex-col">
              <TabsList>
                <TabsTrigger value="feeds">Video Feeds</TabsTrigger>
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
              </TabsList>

              <TabsContent value="feeds" className="flex-1 flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="grid gap-4">
                    {mockVideoFeeds.map((feed) => (
                      <div
                        key={feed.id}
                        className="p-4 border rounded-lg hover:bg-accent cursor-pointer flex items-center justify-between"
                        onClick={() => setSelectedVideo(feed)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-32 h-20 bg-muted rounded flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{feed.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{feed.duration}s</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="upload" className="flex-1 flex flex-col">
                <div className="border-2 border-dashed rounded-lg p-8 text-center flex-1 flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Upload Video for Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your video file here or click to browse
                  </p>
                  <Input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                  />
                  <Button asChild>
                    <label htmlFor="video-upload">Choose File</label>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Video Player */}
            {selectedVideo && (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <Play className="h-12 w-12 text-white/80" />
                </div>
              

                {/* Timeline Scrubber */}
                <TimelineScrubber
                  duration={selectedVideo.duration}
                  currentTime={currentTime}
                  highlights={highlights}
                  onTimeChange={setCurrentTime}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="col-span-5">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Intelligence Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg p-4 max-w-[80%] ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p>{message.text}</p>
                      {message.type === 'assistant' && message.frameUrl && (
                        <div className="mt-2 space-y-2">
                          <div className="rounded overflow-hidden">
                            <img
                              src={message.frameUrl}
                              alt="Detection frame"
                              className="w-full h-auto"
                            />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {message.timestamp}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form
              onSubmit={handleMessageSubmit}
              className="mt-4 flex items-center space-x-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about the video..."
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentrionIntelligence;