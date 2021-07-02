import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const VideoTrack = ({ track , name }) => {
  const trackRef = useRef();
  useEffect(() => {
    const child = track.attach();
    trackRef.current.classList.add(track.kind);
    trackRef.current.appendChild(child);
    const videosPortal = document.getElementById("videos_portal");
    if (!videosPortal.classList.contains("videos_portal_styles")) {
      videosPortal.classList.add("videos_portal_styles");
    }
  }, []);

  return ReactDOM.createPortal(
    <>
      <p id="video_head">{name}</p>
      <div id="video_player">
        <div ref={trackRef}>
        </div>
      </div>
    </>,
    document.getElementById("videos_portal")
  );
};

export default VideoTrack;
