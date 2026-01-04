'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera, Loader2, User } from 'lucide-react'

interface AvatarProps {
  uid: string
  url: string | null
  size: number
  onUpload: (url: string) => void
}

export function Avatar({ uid, url, size, onUpload }: AvatarProps) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) throw error
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) throw uploadError

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative flex items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] transition-all hover:border-white/20 group/avatar shadow-2xl"
        style={{ height: size, width: size }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-full w-full object-cover transition-transform group-hover/avatar:scale-110 duration-700"
          />
        ) : (
          <User className="h-1/2 w-1/2 text-zinc-700" />
        )}
        
        <label 
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-all group-hover/avatar:opacity-100 disabled:cursor-not-allowed backdrop-blur-sm"
          htmlFor="single"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Camera className="h-6 w-6 text-white" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Update</span>
            </div>
          )}
        </label>
      </div>
      <input
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
      <div className="text-center space-y-1">
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Profile Picture</p>
        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest italic">Max 2MB • JPG / PNG / GIF</p>
      </div>
    </div>
  )
}
