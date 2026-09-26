'use client';

import React from 'react';
import { VideoShortsWall } from '@/components/media/VideoShortsWall';
import { VimeoYouTubeShorts } from '@/components/media/VimeoYouTubeShorts';
import { Film, Sparkles, Tv } from 'lucide-react';

export default function MuralPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Horizontal YouTube / Vimeo Style Carousel */}
      <VimeoYouTubeShorts />

      {/* Vertical 9:16 Shorts Grid Wall */}
      <VideoShortsWall />
    </div>
  );
}
