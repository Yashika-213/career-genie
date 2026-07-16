import { useCallback, useEffect, useRef, useState } from 'react';

/** Strips lightweight markdown so speech synthesis reads clean text. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links -> label
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/[*_`#>]/g, '')
    .replace(/[•▪]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface UseSpeechOptions {
  onResult?: (transcript: string) => void;
  enabled?: boolean; // whether TTS is allowed
}

export function useSpeech({ onResult, enabled = true }: UseSpeechOptions = {}) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const recognitionSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const synthSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!recognitionSupported) return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition!;
    const recognition = new Ctor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResultRef.current?.(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [recognitionSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    try {
      // Stop any current speech so the mic doesn't capture the bot.
      if (synthSupported) window.speechSynthesis.cancel();
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [listening, synthSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!synthSupported || !enabled) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [synthSupported, enabled],
  );

  const cancelSpeak = useCallback(() => {
    if (synthSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [synthSupported]);

  return {
    listening,
    speaking,
    startListening,
    stopListening,
    speak,
    cancelSpeak,
    recognitionSupported,
    synthSupported,
  };
}
