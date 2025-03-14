import { useEffect } from "react";

const VideoPlayer = ({ video }) => {
  useEffect(() => {
    const disableRightClick = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  useEffect(() => {
    if (!video?.snippet?.resourceId?.videoId) return;

    // Load YouTube Iframe API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new YT.Player("youtube-player", {
        videoId: video.snippet.resourceId.videoId,
        playerVars: {
          rel: 0, // No related videos
          modestbranding: 1, // No YouTube branding
          disablekb: 1, // Disable keyboard shortcuts
          controls: 0, // Hide controls
          showinfo: 0, // Hide title and info
          iv_load_policy: 3, // Disable annotations
          autoplay: 1, // Auto-play video
          playsinline: 1, // Prevents opening in YouTube app (mobile)
        },

        events: {
          onReady: (event) => event.target.playVideo(),
        },
      });
    };
  }, [video]);

  return (
    Object.keys(video).length ? (
      <>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font font-semibold">{video?.snippet?.title}</h2>
          <p className="text-gray-600 break-words">
            {video?.snippet?.description || "No Description"}
          </p>
        </div>
        <div className="relative w-full aspect-video mt-7 p-3 shadow-lg rounded-md bg-white">
          <div className="absolute top-0 left-0 w-full h-[20%]"></div>
          <div className="w-full h-full rounded-md" id="youtube-player"></div>
          <div className="absolute bottom-0 right-[7%] w-[6%] h-[9%]"></div>
        </div>
      </>
    ) : null
  );
};

export default VideoPlayer;