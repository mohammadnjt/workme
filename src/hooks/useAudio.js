import { useRef, useCallback } from "react";

export default function useAudio() {
  const audioElements = useRef(new Map());

  // پیش‌لود کردن صداها
  const preloadAudio = useCallback((soundName) => {
    if (!audioElements.current.has(soundName)) {
      const audio = new Audio(`/audio/${soundName}.mp3`);
      audio.preload = "auto";
      audioElements.current.set(soundName, audio);
    }
    return audioElements.current.get(soundName);
  }, []);

  // پخش صدا
  const playSound = useCallback((type) => {
    // پیش‌لود اگر وجود ندارد
    let audio = audioElements.current.get(type);
    if (!audio) {
      audio = preloadAudio(type);
    }

    if (audio) {
      // ریست به ابتدا اگر در حال پخش است
      audio.currentTime = 0;
      
      // پخش صدا
      audio.play().catch(error => {
        console.warn("Audio play failed:", error);
      });
    }
  }, [preloadAudio]);

  // پیش‌لود همه صداها هنگام mount (اختیاری)
  const preloadAll = useCallback(() => {
    const sounds = [
      "deal-open",
      "deal-win", 
      "deal-loose",
      "gem-lotto",
      "price-alert-triggered",
      "sending-message",
      "sent-message",
      "iphone-keyboard"
    ];
    
    sounds.forEach(sound => preloadAudio(sound));
  }, [preloadAudio]);

  return { 
    playSound, 
    preloadAll,
    preloadAudio 
  };
}