// FUAD/webspeech_pronunciation_example.js
class PronunciationSpeech {
  constructor(options = {}) {
    this.synthesis = window.speechSynthesis;
    this.voices = [];
    this.preferredVoice = null;
    this.isInitialized = false;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.onError = options.onError || (() => {});
    this.voiceCheckAttempts = 0;
    this.maxVoiceCheckAttempts = 100; // 10 seconds max

    // Initialize voices when available - different browsers handle this differently
    this.initializeVoices();

    // Set up voice change listener for browsers that support it
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => {
        console.log('Voices changed event fired');
        this.initializeVoices();
      };
    }

    // Fallback polling for browsers that don't fire onvoiceschanged reliably
    this.startVoicePolling();
  }

  initializeVoices() {
    this.voices = this.synthesis.getVoices();

    // Prioritize American English voices with better quality
    const americanVoices = this.voices.filter(voice =>
      voice.lang.startsWith('en-US') ||
      voice.name.toLowerCase().includes('american') ||
      voice.name.toLowerCase().includes('us') ||
      voice.name.toLowerCase().includes('english (us)')
    );

    if (americanVoices.length > 0) {
      // Prioritize high-quality voices (Google, Microsoft, Apple voices are usually better)
      const highQualityVoices = americanVoices.filter(voice =>
        voice.name.toLowerCase().includes('google') ||
        voice.name.toLowerCase().includes('microsoft') ||
        voice.name.toLowerCase().includes('apple') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('susan')
      );

      if (highQualityVoices.length > 0) {
        // Prefer female voices for clarity, then any high-quality voice
        this.preferredVoice = highQualityVoices.find(voice =>
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('susan')
        ) || highQualityVoices[0];
      } else {
        // Fallback to any American voice
        this.preferredVoice = americanVoices.find(voice =>
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman')
        ) || americanVoices[0];
      }
    } else {
      // Fallback to best available English voice
      const englishVoices = this.voices.filter(voice => voice.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        // Look for high-quality English voices
        const highQualityEnglish = englishVoices.filter(voice =>
          voice.name.toLowerCase().includes('google') ||
          voice.name.toLowerCase().includes('microsoft') ||
          voice.name.toLowerCase().includes('apple')
        );
        this.preferredVoice = highQualityEnglish.length > 0 ? highQualityEnglish[0] : englishVoices[0];
      } else {
        // Last resort - use any available voice
        this.preferredVoice = this.voices.length > 0 ? this.voices[0] : null;
      }
    }

    this.isInitialized = true;
    console.log('Selected voice:', this.preferredVoice?.name || 'No voice selected');
  }

  speak(text, options = {}) {
    if (!this.isInitialized) {
      console.warn('Speech synthesis not yet initialized');
      return;
    }

    // If currently speaking, cancel and wait for it to stop before speaking new text
    if (this.synthesis.speaking || this.synthesis.pending) {
      this.synthesis.cancel();
      this.isSpeaking = false;

      // Wait for cancellation to complete, then speak
      const speakAfterCancel = () => {
        if (this.synthesis.speaking || this.synthesis.pending) {
          // Still speaking, wait a bit more
          setTimeout(speakAfterCancel, 50);
        } else {
          // Now safe to speak
          this.performSpeak(text, options);
        }
      };

      setTimeout(speakAfterCancel, 10);
    } else {
      // Not currently speaking, speak immediately
      this.performSpeak(text, options);
    }
  }

  performSpeak(text, options = {}) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.preferredVoice;
    utterance.rate = options.rate || 0.8;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 0.8;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      if (this.onError) {
        this.onError(`Speech synthesis error: ${event.error}`);
      }
    };

    // Add a safety timeout to reset speaking flag in case events don't fire
    setTimeout(() => {
      if (this.isSpeaking) {
        console.log('Safety timeout: resetting speaking flag');
        this.isSpeaking = false;
      }
    }, 5000); // 5 second timeout

    this.synthesis.speak(utterance);
  }

  stop() {
    this.synthesis.cancel();
  }

  startVoicePolling() {
    const pollVoices = () => {
      this.voiceCheckAttempts++;
      const currentVoices = this.synthesis.getVoices();

      // Check if voices have changed or if we have voices now
      if (currentVoices.length !== this.voices.length || currentVoices.length > 0) {
        console.log(`Voice polling: Found ${currentVoices.length} voices (attempt ${this.voiceCheckAttempts})`);
        this.initializeVoices();
      }

      // Continue polling if we haven't reached max attempts and still no voices
      if (this.voiceCheckAttempts < this.maxVoiceCheckAttempts && currentVoices.length === 0) {
        setTimeout(pollVoices, 100);
      }
    };

    // Start polling after a short delay
    setTimeout(pollVoices, 200);
  }

  getAvailableVoices() {
    return this.voices;
  }
}

// Export for use in other modules
export default PronunciationSpeech;
