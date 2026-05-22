"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { VideoItem } from "@/types";

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return n.toString();
}

export default function VideoCard({ video, isActive }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicatorIcon, setIndicatorIcon] = useState("▶");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [heartAnim, setHeartAnim] = useState(false);
  const indicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerIndicator = (icon: string) => {
    setIndicatorIcon(icon);
    setShowIndicator(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowIndicator(true);
      });
    });
    if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
    indicatorTimerRef.current = setTimeout(() => setShowIndicator(false), 700);
  };

  const togglePlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      await v.play();
      setIsPlaying(true);
      triggerIndicator("▶");
    } else {
      v.pause();
      setIsPlaying(false);
      triggerIndicator("⏸");
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
    setHeartAnim(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setHeartAnim(true));
    });
    setTimeout(() => setHeartAnim(false), 400);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="video-card" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        muted
        playsInline
        preload="metadata"
      />

      <div className="overlay-gradient" />

      <div className={`play-pause-indicator ${showIndicator ? "show" : ""}`}>
        {indicatorIcon}
      </div>

      <div className="video-info">
        <div className="author-row">
          <div className="author-avatar">{video.authorAvatar}</div>
          <span className="author-name">@{video.authorName}</span>
          <button
            className="follow-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Theo dõi
          </button>
        </div>
        <p className="video-description">{video.description}</p>
        <div className="song-row">
          <span className="song-icon">♪</span>
          <span>{video.song}</span>
        </div>
      </div>

      <div className="action-bar">
        <button
          className={`action-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <div className={`action-icon-wrap ${heartAnim ? "heart-pop" : ""}`}>
            <span style={{ color: liked ? "#fe2c55" : "#fff", fontSize: 24 }}>
              {liked ? "♥" : "♡"}
            </span>
          </div>
          <span className="action-label">{formatCount(likesCount)}</span>
        </button>

        <button className="action-btn" onClick={handleComment}>
          <div className="action-icon-wrap">
            <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22}>
              <path d="M12 2C6.477 2 2 6.15 2 11.25c0 2.88 1.42 5.45 3.65 7.15L5 21.5l3.5-1.75A10.7 10.7 0 0 0 12 20.5c5.523 0 10-4.15 10-9.25S17.523 2 12 2Z" />
            </svg>
          </div>
          <span className="action-label">{formatCount(video.commentsCount)}</span>
        </button>

        <button className="action-btn" onClick={handleShare}>
          <div className="action-icon-wrap">
            <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22}>
              <path d="M18 8a3 3 0 1 0-2.816-2H8.816a3 3 0 1 0-1.114 2.33l3.512 5.27a3 3 0 1 0 1.57-.637L9.27 7.7A3.012 3.012 0 0 0 9.184 8h5a3.012 3.012 0 0 0-.184-.3l3.512-5.27A2.995 2.995 0 0 0 18 8Z" />
            </svg>
          </div>
          <span className="action-label">{formatCount(video.sharesCount)}</span>
        </button>

        <div className="action-btn">
          <div
            className="action-icon-wrap"
            style={{
              background: "linear-gradient(135deg, #fe2c55, #ff6b35)",
              animation: "spinSlow 4s linear infinite",
            }}
          >
            <span style={{ fontSize: 16 }}>♪</span>
          </div>
        </div>
      </div>
    </div>
  );
}
