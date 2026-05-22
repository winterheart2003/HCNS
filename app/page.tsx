import { videos } from "@/data/videos";
import VideoFeed from "@/components/VideoFeed";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="page-layout">
      <Navigation />
      <div className="feed-area">
        <VideoFeed videos={videos} />
      </div>
    </div>
  );
}
