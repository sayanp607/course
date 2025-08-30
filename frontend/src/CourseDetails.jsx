// Helper to extract YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com")) {
    const match = url.match(/[?&]v=([^&#]+)/);
    return match ? match[1] : null;
  } else if (url.includes("youtu.be")) {
    return url.split("youtu.be/")[1]?.split("?")[0];
  }
  return null;
};
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import YouTube from "react-youtube";
import { API_BASE_URL } from "./main";

function CourseDetails() {
  // Assume userId is available (replace with your auth logic)
  const userId = localStorage.getItem("userId") || 1;
  const [allVideos, setAllVideos] = useState([]);
  const [currentItem, setCurrentItem] = useState({ type: "video", idx: 0 });
  const [completedVideos, setCompletedVideos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [justCompletedId, setJustCompletedId] = useState(null);
  const { courseId } = useParams();
  const [subsections, setSubsections] = useState([]);
  const [active, setActive] = useState(null);
  // Track open/close state for each subsection
  const [openSubsections, setOpenSubsections] = useState({});
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    // Fetch course name
    axios.get(`${API_BASE_URL}/api/courses`).then((res) => {
      const found = res.data.courses.find(
        (c) => String(c.id) === String(courseId)
      );
      setCourseName(found ? found.name : "Course");
    });
    axios.get(`${API_BASE_URL}/api/subsections/${courseId}`).then((res) => {
      setSubsections(res.data.subsections);
      if (res.data.subsections.length > 0)
        setActive(res.data.subsections[0].id);
      // Flatten all videos in all subsections
      const videos = [];
      res.data.subsections.forEach((sub) => {
        if (sub.videos && sub.videos.length > 0) {
          sub.videos.forEach((v) => videos.push({ ...v, subsection: sub }));
        }
      });
      setAllVideos(videos);
      setCurrentItem({ type: "video", idx: 0 });
    });
    // Fetch completed videos from backend
    axios
      .get(`${API_BASE_URL}/api/progress?userId=${userId}&courseId=${courseId}`)
      .then((res) => {
        setCompletedVideos(res.data.completed || []);
      });
  }, [courseId, userId]);
  const totalVideos = allVideos.length;
  const completedCount = completedVideos.length;
  const progress =
    totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

  // Calculate total steps (videos only)
  const totalSteps = allVideos.length;
  const completedSteps = completedVideos.length;

  // Helper to get current item (video or text)
  let currentVideo = null;
  let currentText = null;
  if (currentItem.type === "video") {
    currentVideo = allVideos[currentItem.idx];
  } else if (currentItem.type === "text") {
    let count = 0;
    for (const sub of subsections) {
      if (sub.texts && sub.texts.length > 0) {
        for (let i = 0; i < sub.texts.length; i++) {
          if (count === currentItem.idx) {
            currentText = sub.texts[i];
            break;
          }
          count++;
        }
      }
      if (currentText) break;
    }
  }

  // Mark video as complete when it ends
  const handleVideoComplete = async (videoId) => {
    if (!completedVideos.includes(videoId)) {
      await axios.post(`${API_BASE_URL}/api/progress/complete`, {
        userId,
        courseId,
        videoId,
      });
      setCompletedVideos((prev) => [...prev, videoId]);
      setJustCompletedId(videoId);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setJustCompletedId(null);
      }, 2000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "80vh",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#faf9f6",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "90vw",
          maxWidth: 1200,
          margin: "32px auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          border: "1px solid #e0e0e0",
          padding: "24px 32px",
          gap: 32,
        }}
      >
        {/* Left Section */}
        <div
          style={{
            width: 320,
            minWidth: 220,
            marginRight: 32,
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            paddingRight: 8,
          }}
        >
          {/* Progress Bar with Course Name and steps */}
          <div style={{ margin: "1rem 0 2rem 0", padding: "0.5rem 0" }}>
            <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
              {courseName}
            </div>
            <div
              style={{
                color: "#888",
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              {completedSteps}/{totalSteps} steps
            </div>
            <div
              style={{
                background: "#eee",
                borderRadius: 8,
                height: 18,
                width: "100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  background: "var(--primary-green)",
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 8,
                  transition: "width 0.3s",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: 0,
                  fontSize: 14,
                  color: "#666",
                }}
              >
                {progress}%
              </div>
            </div>
          </div>
          {/* Subsections List */}
          <div style={{ marginTop: 16 }}>
            {subsections.map((sub, idx) => {
              const isOpen = openSubsections[sub.id] !== false; // default open
              // Calculate completed videos in this subsection
              const completedInSub =
                sub.videos?.filter((v) => completedVideos.includes(v.id))
                  .length || 0;
              const totalInSub =
                (sub.videos?.length || 0) + (sub.texts?.length || 0);
              return (
                <React.Fragment key={sub.id}>
                  <div style={{ padding: "16px 0 8px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          marginBottom: 2,
                        }}
                      >
                        {sub.title}
                      </span>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 20,
                          marginLeft: 8,
                          color: "#888",
                          outline: "none",
                        }}
                        onClick={() =>
                          setOpenSubsections((prev) => ({
                            ...prev,
                            [sub.id]: !isOpen,
                          }))
                        }
                        aria-label={
                          isOpen ? "Close subsection" : "Open subsection"
                        }
                      >
                        {isOpen ? "⋁" : "⋀"}
                      </button>
                    </div>
                    <div
                      style={{ color: "#888", fontSize: 14, marginBottom: 8 }}
                    >
                      {completedInSub}/{totalInSub} steps
                    </div>
                    {isOpen && (
                      <>
                        {/* Videos in subsection */}
                        {sub.videos &&
                          sub.videos.map((video) => {
                            const idx = allVideos.findIndex(
                              (v) => v.id === video.id
                            );
                            return (
                              <div
                                key={video.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 18,
                                  marginLeft: 4,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  setCurrentItem({ type: "video", idx })
                                }
                              >
                                {completedVideos.includes(video.id) ? (
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 28,
                                      height: 28,
                                      borderRadius: "50%",
                                      background: "var(--primary-green)",
                                      color: "#fff",
                                      fontSize: 18,
                                      marginRight: 8,
                                      boxShadow:
                                        "0 2px 6px rgba(140,195,74,0.15)",
                                    }}
                                  >
                                    ✔
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      color: "#bbb",
                                      fontSize: 18,
                                      marginRight: 8,
                                    }}
                                  >
                                    ◻
                                  </span>
                                )}
                                <span
                                  style={{
                                    fontWeight: completedVideos.includes(
                                      video.id
                                    )
                                      ? "bold"
                                      : "normal",
                                    color: completedVideos.includes(video.id)
                                      ? "#222"
                                      : "#444",
                                  }}
                                >
                                  {video.title}
                                </span>
                                <span
                                  style={{
                                    color: "#888",
                                    fontSize: 13,
                                    marginLeft: 8,
                                  }}
                                >
                                  {video.duration}
                                </span>
                              </div>
                            );
                          })}
                        {/* Texts in subsection */}
                        {sub.texts &&
                          sub.texts.map((text, tIdx) => {
                            // Find global text index
                            let globalIdx = 0;
                            for (let i = 0; i < idx; i++) {
                              globalIdx += subsections[i].texts?.length || 0;
                            }
                            globalIdx += tIdx;
                            return (
                              <div
                                key={text.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 6,
                                  marginLeft: 4,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  setCurrentItem({
                                    type: "text",
                                    idx: globalIdx,
                                  })
                                }
                              >
                                <span
                                  style={{
                                    color: "#bbb",
                                    fontSize: 18,
                                    marginRight: 6,
                                  }}
                                >
                                  📝
                                </span>
                                <span style={{ color: "#444" }}>
                                  {text.content.slice(0, 30)}
                                  {text.content.length > 30 ? "..." : ""}
                                </span>
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>
                  {/* Separator line between subsections */}
                  {idx < subsections.length - 1 && (
                    <hr
                      style={{
                        border: "none",
                        borderTop: "3px solid #bdbdbd",
                        margin: "16px 0 16px 0",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {/* Right Section */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            position: "relative",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Scrollable content above buttons */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 12,
              paddingBottom: 120,
            }}
          >
            {/* Video or text details */}
            {currentItem.type === "video" && currentVideo && (
              <div>
                {/* Text above video */}
                {currentVideo?.text_above && (
                  <div
                    style={{
                      marginBottom: "0.5rem",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    {currentVideo.text_above}
                  </div>
                )}
                {/* Video player with increased height */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: 700,
                    margin: "0 auto",
                    marginBottom: 24,
                  }}
                >
                  {currentVideo.url &&
                  (currentVideo.url.includes("youtube.com") ||
                    currentVideo.url.includes("youtu.be")) ? (
                    <VideoPlayer
                      url={currentVideo.url}
                      completed={completedVideos.includes(currentVideo.id)}
                      onComplete={() => handleVideoComplete(currentVideo.id)}
                    />
                  ) : (
                    <video
                      width="100%"
                      height="500"
                      controls
                      style={{ borderRadius: 12, background: "#000" }}
                      onEnded={() => handleVideoComplete(currentVideo.id)}
                    >
                      <source src={currentVideo.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                {/* Text below video */}
                {currentVideo?.text_below && (
                  <div style={{ marginTop: "0.5rem", color: "#333" }}>
                    {currentVideo.text_below}
                  </div>
                )}
                {/* PDF link if available */}
                {currentVideo?.pdf_url && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                      background: "#faf9f6",
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 18px",
                      maxWidth: 420,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* PDF Icon */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        background: "#4caf50",
                        borderRadius: 6,
                        marginRight: 16,
                      }}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="4"
                          fill="#fff"
                          stroke="#388e3c"
                          strokeWidth="2"
                        />
                        <path
                          d="M7 8h10v2H7V8zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"
                          fill="#388e3c"
                        />
                      </svg>
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          color: "#222",
                        }}
                      >
                        {currentVideo.pdf_url.split("-").slice(1).join("-")}
                      </div>
                      <div style={{ color: "#888", fontSize: 14 }}>
                        Download PDF
                      </div>
                    </div>
                    <a
                      href={`${API_BASE_URL}${currentVideo.pdf_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 16,
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 12px",
                        fontWeight: "bold",
                        fontSize: 16,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(25, 118, 210, 0.10)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      download
                    >
                      <span style={{ marginRight: 6 }}>&#8681;</span> Download
                    </a>
                  </div>
                )}
              </div>
            )}
            {currentItem.type === "text" && currentText && (
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  Text Content
                </div>
                <div
                  style={{
                    color: "#333",
                    fontSize: 16,
                    whiteSpace: "pre-line",
                  }}
                >
                  {currentText.content}
                </div>
              </div>
            )}
          </div>
          {/* Fixed button row at bottom */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              background: "#fff",
              boxShadow: "0 -2px 8px rgba(0,0,0,0.07)",
              padding: "16px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 10,
            }}
          >
            <div>
              {currentItem.type === "video" &&
              currentVideo &&
              !completedVideos.includes(currentVideo?.id) ? (
                <CompleteButton
                  currentVideo={currentVideo}
                  onComplete={async () => {
                    await axios.post(`${API_BASE_URL}/api/progress/complete`, {
                      userId,
                      courseId,
                      videoId: currentVideo.id,
                    });
                    setCompletedVideos((prev) => [...prev, currentVideo.id]);
                    setJustCompletedId(currentVideo.id);
                    setShowAlert(true);
                    setTimeout(() => {
                      setShowAlert(false);
                      setJustCompletedId(null);
                    }, 2000);
                  }}
                />
              ) : currentItem.type === "video" && currentVideo ? (
                <>
                  <button
                    className="button"
                    onClick={async () => {
                      await axios.post(`${API_BASE_URL}/api/progress/undo`, {
                        userId,
                        courseId,
                        videoId: currentVideo.id,
                      });
                      setCompletedVideos((prev) =>
                        prev.filter((vid) => vid !== currentVideo.id)
                      );
                      setJustCompletedId(null);
                    }}
                  >
                    Undo Step
                  </button>
                  {justCompletedId === currentVideo?.id && showAlert && (
                    <span
                      style={{
                        color: "var(--primary-green)",
                        marginLeft: 12,
                      }}
                    >
                      Step completed. Keep it up!
                    </span>
                  )}
                </>
              ) : null}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button
                className="button"
                onClick={() =>
                  setCurrentItem((prev) => ({
                    ...prev,
                    idx: Math.max(0, prev.idx - 1),
                  }))
                }
                disabled={currentItem.idx === 0}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: currentItem.idx === 0 ? "#e0e0e0" : "#1976d2",
                  color: currentItem.idx === 0 ? "#888" : "#fff",
                  fontWeight: "bold",
                  boxShadow:
                    currentItem.idx === 0
                      ? "none"
                      : "0 2px 8px rgba(25, 118, 210, 0.15)",
                  cursor: currentItem.idx === 0 ? "not-allowed" : "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                &lt; Previous
              </button>
              <button
                className="button"
                onClick={() =>
                  setCurrentItem((prev) => ({
                    ...prev,
                    idx: Math.min(totalVideos - 1, prev.idx + 1),
                  }))
                }
                disabled={currentItem.idx === totalVideos - 1}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    currentItem.idx === totalVideos - 1 ? "#e0e0e0" : "#1976d2",
                  color: currentItem.idx === totalVideos - 1 ? "#888" : "#fff",
                  fontWeight: "bold",
                  boxShadow:
                    currentItem.idx === totalVideos - 1
                      ? "none"
                      : "0 2px 8px rgba(25, 118, 210, 0.15)",
                  cursor:
                    currentItem.idx === totalVideos - 1
                      ? "not-allowed"
                      : "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CompleteButton component
const CompleteButton = ({ currentVideo, onComplete }) => {
  const [watched, setWatched] = React.useState(false);

  React.useEffect(() => {
    setWatched(false);
    const handler = (e) => {
      if (
        e.detail &&
        (e.detail.videoId === currentVideo.id ||
          e.detail.videoId === currentVideo.url)
      ) {
        setWatched(true);
      }
    };
    window.addEventListener("videoWatched", handler);
    return () => window.removeEventListener("videoWatched", handler);
  }, [currentVideo.id, currentVideo.url]);

  const handleClick = () => {
    if (!watched) {
      alert("Please, see the full video");
      return;
    }
    onComplete();
  };

  return (
    <button className="button" onClick={handleClick}>
      Complete
    </button>
  );
};

// Custom video player component
const VideoPlayer = ({ url, completed, onComplete, onUndo }) => {
  // Helper to extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com")) {
      return url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be")) {
      return url.split("youtu.be/")[1]?.split("?")[0];
    }
    return null;
  };

  if (!url) return null;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = getYouTubeId(url);
    return (
      <YouTube
        videoId={videoId}
        opts={{ width: "100%", height: "320" }}
        onEnd={() => {
          window.dispatchEvent(
            new CustomEvent("videoWatched", { detail: { videoId: url } })
          );
          if (onComplete) onComplete();
        }}
      />
    );
  }
  return (
    <video
      width="100%"
      height="320"
      controls
      onEnded={() => {
        window.dispatchEvent(
          new CustomEvent("videoWatched", { detail: { videoId: url } })
        );
        if (onComplete) onComplete();
      }}
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default CourseDetails;
