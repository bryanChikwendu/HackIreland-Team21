

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Play, Pause, Search, ChevronRight, Clock } from 'lucide-react';

const TimelineScrubber = ({ duration = 15, currentTime = 0, highlights = [], onTimeChange }) => {
  const timelineRef = useRef(null);

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
      <div className="text-sm font-medium dark:text-white">Timeline</div>
      <div 
        ref={timelineRef}
        className="relative h-24 bg-slate-900 rounded-md cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
      >
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
  const [videoUrl, setVideoUrl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const videoRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a File object that we can work with
      const videoFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      
      setSelectedVideo(videoFile);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Add system message about the uploaded video
      const systemMessage = {
        id: Date.now(),
        text: `Video "${file.name}" uploaded successfully. You can now ask questions about the video.`,
        type: 'assistant'
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeChange = (newTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedVideo) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      type: 'user'
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // Create a local file path from the selected video
      const videoPath = selectedVideo.name; // You'll need to adjust this based on how you want to handle file paths
      const testPath = "/Users/eniola/Downloads/" + videoPath;
      console.log(testPath)
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          path: testPath,
          prompt: inputMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Received non-JSON response from server");
      }

      const data = await response.json();
      
      // Add the timestamp to highlights
      setHighlights(prev => [...prev, {
        start: parseFloat(data.begin),
        end: parseFloat(data.end)
      }]);

      // Add response to messages
      const responseMessage = {
        id: Date.now() + 1,
        text: `Found relevant content between ${data.begin} and ${data.end}`,
        type: 'assistant',
        timestamp: `${data.begin}s - ${data.end}s`
      };

      setMessages(prev => [...prev, responseMessage]);
      
      // Scrub to the beginning of the highlighted section
      handleTimeChange(parseFloat(data.begin));
    } catch (error) {
      console.error('Error querying video:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error analyzing video: ${error.message}. Please make sure the server is running and the video is accessible.`,
        type: 'assistant',
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }

    setInputMessage('');
  };

  return (
    <div className="h-full grid grid-cols-12 gap-6">
      {/* Left Column - Video Player and Controls */}
      <div className="col-span-7 space-y-6">
        <Card className="h-full flex flex-col dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Video Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {!videoUrl ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center flex-1 flex flex-col items-center justify-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2 dark:text-white">Upload Video for Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4 dark:text-gray-400">
                  Drag and drop your video file here or click to browse
                </p>
                <Input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                  onChange={handleFileUpload}
                />
                <Button asChild>
                  <label htmlFor="video-upload">Choose File</label>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="aspect-video bg-black rounded-lg overflow-hidden flex-1">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onLoadedMetadata={handleVideoLoadedMetadata}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>

                <TimelineScrubber
                  duration={duration}
                  currentTime={currentTime}
                  highlights={highlights}
                  onTimeChange={handleTimeChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="col-span-5">
        <Card className="h-full flex flex-col dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Intelligence Chat</CardTitle>
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
                          : 'bg-muted dark:bg-gray-700 dark:text-white'
                      }`}
                    >
                      <p>{message.text}</p>
                      {message.timestamp && (
                        <Badge variant="outline" className="text-xs mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {message.timestamp}
                        </Badge>
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
                className="flex-1 dark:text-white"
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