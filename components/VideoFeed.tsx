"use client";

import { useRef, useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import { VideoItem } from "@/types";

interface VideoFeedProps {
  videos: VideoItem[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [activeId, setActiveId] = useState<string>(videos[0]?.id ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (id) setActiveId(id);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    slideRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [videos]);

  const setSlideRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) slideRefs.current.set(id, el);
    else slideRefs.current.delete(id);
  };

  return (
    <div className="feed-container" ref={containerRef}>
      {videos.map((video) => (
        <div
          key={video.id}
          className="video-slide"
          data-id={video.id}
          ref={setSlideRef(video.id)}
        >
          <VideoCard video={video} isActive={activeId === video.id} />
        </div>
      ))}
    </div>
  );
}
