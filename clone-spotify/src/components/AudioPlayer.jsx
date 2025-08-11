import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { AudioContext } from "../context/AudioContext";
import { XMarkIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

export default function AudioPlayer() {
  const {
    currentTrack,
    isVisible,
    setIsVisible,
    setCurrentTrack,
  } = useContext(AudioContext);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ 트랙 바뀔 때 오디오 초기화 및 이벤트 등록
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let previewUrl = currentTrack.preview_url;
    if (!previewUrl) return;

    if (previewUrl.startsWith("http://")) {
      previewUrl = previewUrl.replace("http://", "https://");
    }

    // 확장자 검사
    if (!previewUrl.endsWith(".m4a") && !previewUrl.endsWith(".mp3")) return;

    // 초기화
    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    audio.src = previewUrl;
    audio.load();
    audio.currentTime = 0;

    const updateProgress = () => {
      const current = audio.currentTime;
      const duration = audio.duration || 1;
      setProgress((current / duration) * 100);
      console.log("⏱ progress:", current, "/", duration, "=", (current / duration) * 100);
    };

    const onCanPlay = () => {
      console.log("🎵 canplay 이벤트 - 오디오 재생 준비 완료");
      audio.play()
        .then(() => {
          console.log("▶️ 재생 시작됨");
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("❌ 재생 실패:", err);
          setIsPlaying(false);
        });
    };

    // 이벤트 등록
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("canplay", onCanPlay);

    // 정리
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [currentTrack]);

  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setCurrentTrack(null);
      setIsClosing(false);
      setIsPlaying(true);
      setProgress(0);
    }, 300);
  }, [setIsVisible, setCurrentTrack]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.error("재생 실패:", err);
      });
    }
  };

  if (!isVisible || !currentTrack) return null;

  return (
    <>
      {/* ✅ 진행률 바 */}
      <div className="fixed bottom-[76px] left-0 w-full h-[3px] bg-[#222] z-50">
        <div
          className="h-full bg-blue-400 transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* ✅ 플레이어 UI */}
      <div className="fixed bottom-0 left-0 w-full bg-[#111] text-white px-6 py-3 flex items-center justify-between shadow z-40">
        <div className="flex items-center gap-4">
          <img
            src={currentTrack.albumImage || "/default.jpg"}
            alt="Album"
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{currentTrack.name}</p>
            <p className="text-xs text-gray-400">{currentTrack.artist || "Unknown Artist"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 text-white cursor-pointer" />
            ) : (
              <PlayIcon className="w-6 h-6 text-white cursor-pointer" />
            )}
          </button>
          <audio ref={audioRef} style={{ display: "none" }} />
        </div>

        <button onClick={handleClose}>
          <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer" />
        </button>
      </div>
    </>
  );
}