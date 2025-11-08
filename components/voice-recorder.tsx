'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, Square, Play, Trash2, Send } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface VoiceRecorderProps {
  onClose: () => void
  onRecordingComplete?: (voiceUrl: string, duration: number) => void
}

export default function VoiceRecorder({ onClose, onRecordingComplete }: VoiceRecorderProps) {
  const { token } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setDuration(0)
    setIsPlaying(false)
  }

  const sendRecording = async () => {
    if (!audioBlob || !token) return

    setLoading(true)

    try {
      // Convert blob to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string

        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: '',
            voiceUrl: base64,
            voiceDuration: duration,
            images: [],
            videos: [],
          }),
        })

        if (response.ok) {
          const newPost = await response.json()
          onRecordingComplete?.(base64, duration)
          onClose()
        }
      }
      reader.readAsDataURL(audioBlob)
    } catch (error) {
      console.error('Failed to send recording:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-gray-700"
    >
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-bold mb-4">Record Your Voice</h3>

        {!audioBlob ? (
          <div className="space-y-4">
            {isRecording && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center justify-center gap-3 p-4 bg-red-900/20 rounded-lg border border-red-700"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
                <span className="text-red-400 font-semibold">Recording... {formatTime(duration)}</span>
              </motion.div>
            )}

            <div className="flex gap-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop Recording
                </Button>
              )}

              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-700 hover:bg-gray-900"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Duration: {formatTime(duration)}</p>
              <audio
                ref={audioRef}
                src={URL.createObjectURL(audioBlob)}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={playRecording}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isPlaying ? 'Playing...' : 'Play'}
                </Button>
                <Button
                  onClick={deleteRecording}
                  variant="outline"
                  className="border-red-700 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={sendRecording}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send Voice Message'}
              </Button>

              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-700 hover:bg-gray-900"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
