import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import PronunciationSpeech from './components/PronunciationSpeech';
// Import Focus Mode Button component
import FocusModeButton from './components/FocusModeButton';



// Import Tips component
import TipsButton from './components/TipsButton';

// Import common components
import Sidebar from '../../../components/Sidebar';
import GoBackButton from '../../../components/GoBackButton';

// Import styles
import './PronunciationSymbol.css';

// CSV data imports (we'll load these dynamically)
// const csvData: { [key: string]: any } = {}; // Removed unused variable

interface Word {
  text: string;
  ipa: string;
  start: number;
  end: number;
}

const PronunciationSymbol: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [headerText, setHeaderText] = useState('Pronunciation');
  const [symbolData, setSymbolData] = useState<any>(null);
  const [exampleWords, setExampleWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [speech, setSpeech] = useState<PronunciationSpeech | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Reset body background when component mounts
  useEffect(() => {
    // Store original background
    const originalBackground = document.body.style.background;

    // Reset to default background
    document.body.style.background = '';

    // Cleanup function to restore original background when component unmounts
    return () => {
      // Only restore if we're actually leaving this page (not just re-rendering)
      if (!window.location.pathname.includes('/pronunciation/symbol/')) {
        // Remove inline background style to allow CSS to take over
        document.body.style.removeProperty('background');
      }
    };
  }, []);

  // Load CSV data based on symbol
  useEffect(() => {
    const loadSymbolData = async () => {
      if (!symbol) return;

      // Decode the symbol in case it's URL encoded
      const decodedSymbol = decodeURIComponent(symbol);

      // Set header text based on symbol type
      const laxVowels = ['ʌ', 'ɪ', 'ʊ', 'ɛ', 'ə', 'ɚ'];
      if (laxVowels.includes(decodedSymbol)) {
        setHeaderText('VOWEL (Lax)');
      } else {
        setHeaderText('Pronunciation');
      }
      console.log('=== SYMBOL LOADING DEBUG ===');
      console.log('Original symbol from URL:', symbol);
      console.log('Decoded symbol:', decodedSymbol);
      console.log('Symbol character codes:', Array.from(decodedSymbol).map(c => c.charCodeAt(0)));

      try {
        // Determine which JSON files to load based on symbol
        let exampleCsvPath = '';

        // Vowels lax
        if (['ʌ', 'ɪ', 'ʊ', 'ɛ', 'ə', 'ɚ'].includes(decodedSymbol)) {
          exampleCsvPath = `/data_symbol/example_word/vowel_lax/vowel_lax_${decodedSymbol}.json`;
        }
        // Vowels tense
        else if (['ɑ', 'i', 'u', 'æ', 'ɔ'].includes(decodedSymbol)) {
          exampleCsvPath = `/data_symbol/example_word/vowel_tense/vowel‑tense‑${decodedSymbol}.json`;
        }
        // Diphthongs
        else if (['aɪ', 'eɪ', 'ɔɪ', 'ɪə', 'eə', 'ʊə', 'oʊ', 'aʊ'].includes(decodedSymbol)) {
          exampleCsvPath = `/data_symbol/example_word/diphthong/diphthong‑${decodedSymbol}.json`;
        }
        // Voiced consonants
        else if (['b', 'd', 'g', 'v', 'ð', 'z', 'ʒ', 'ʤ', 'l', 'm', 'n', 'ŋ', 'r', 'w', 'y'].includes(decodedSymbol)) {
          exampleCsvPath = `/data_symbol/example_word/consonant_voiced/consonant‑voiced‑${decodedSymbol}.json`;
        }
        // Voiceless consonants
        else if (['p', 't', 'k', 'f', 'θ', 's', 'ʃ', 'ʧ', 'h'].includes(decodedSymbol)) {
          exampleCsvPath = `/data_symbol/example_word/consonant_voiceless/consonant‑voiceless‑${decodedSymbol}.json`;
        }
        // If no path is defined, we'll use fallback examples
        else {
          console.warn('No path defined for symbol:', decodedSymbol);
        }

        // Always ensure we have example words - either from JSON or fallback
        if (exampleCsvPath) {
          console.log(`Loading example words for /${decodedSymbol}/ from:`, exampleCsvPath);

          // Test if the file exists first
          try {
            const testResponse = await fetch(exampleCsvPath, { method: 'HEAD' });
            console.log(`File exists check for ${exampleCsvPath}:`, testResponse.status);
          } catch (e) {
            console.log(`File exists check failed:`, e);
          }

          try {
            // Try the primary path first
            let exampleResponse = await fetch(exampleCsvPath);
            console.log(`Primary path response status:`, exampleResponse.status);

            // If primary path fails, try alternative naming patterns
            if (!exampleResponse.ok) {
              // Try with en-dash instead of hyphen for consonants
              const altPath1 = exampleCsvPath
                .replace('Voiced-Consonant-', 'Consonant‑Voiced‑')
                .replace('Voiceless-Consonant-', 'Consonant‑Voiceless‑')
                .replace('Diphthong-', 'Diphthong‑')
                .replace('Vowel-Tense-', 'Vowel‑Tense‑');

              console.log('Trying alternative path:', altPath1);
              exampleResponse = await fetch(altPath1);
              console.log(`Alternative path 1 response status:`, exampleResponse.status);

              // If still fails, try with different case for vowel lax
              if (!exampleResponse.ok && decodedSymbol === 'ɚ') {
                const altPath2 = exampleCsvPath.replace('Vowel-Lax-', 'Vowel-lax-');
                console.log('Trying vowel lax case variation:', altPath2);
                exampleResponse = await fetch(altPath2);
                console.log(`Alternative path 2 response status:`, exampleResponse.status);
              }
            }

            if (exampleResponse.ok) {
              const exampleJson = await exampleResponse.json();
              console.log(`JSON content:`, exampleJson);

              // Extract the word array from the JSON structure
              // Structure: {"Vowel-Lax-ʌ": {"ʌ": [{text, ipa}]}} or similar
              const key = Object.keys(exampleJson)[0]; // e.g., "Vowel-Lax-ʌ"
              const symbolKey = Object.keys(exampleJson[key])[0]; // e.g., "ʌ"
              const examples = exampleJson[key][symbolKey] || [];

              console.log(`Parsed examples count:`, examples.length);
              console.log(`First few examples:`, examples.slice(0, 3));

              // Use JSON data if available and not empty, otherwise use fallback
              if (examples.length > 0) {
                setExampleWords(examples);
                console.log(`✅ Successfully loaded ${examples.length} words from JSON for /${decodedSymbol}/`);
              } else {
                console.warn('JSON file empty for symbol:', decodedSymbol, '- using fallback');
                setExampleWords(getFallbackExamples(decodedSymbol));
              }
            } else {
              console.warn('JSON file not found for symbol:', decodedSymbol, '- using fallback');
              setExampleWords(getFallbackExamples(decodedSymbol));
            }
          } catch (error) {
            console.error('Error loading JSON for symbol:', decodedSymbol, error);
            setExampleWords(getFallbackExamples(decodedSymbol));
          }
        } else {
          // No path defined for this symbol, use fallback
          console.warn('No path defined for symbol:', decodedSymbol, '- using fallback');
          setExampleWords(getFallbackExamples(decodedSymbol));
        }

        // Final safety check - ensure we always have example words
        if (exampleWords.length === 0) {
          console.warn('No example words loaded, applying emergency fallback for:', symbol);
          const emergencyFallback = getFallbackExamples(symbol);
          if (emergencyFallback.length > 0) {
            setExampleWords(emergencyFallback);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading symbol data:', error);
        setLoading(false);
      }
    };

    loadSymbolData();
  }, [symbol]);

  // Safety check to ensure exampleWords is always populated
  useEffect(() => {
    if (!loading && exampleWords.length === 0 && symbol) {
      const decodedSymbol = decodeURIComponent(symbol);
      console.warn('Emergency fallback triggered for symbol:', decodedSymbol);
      const emergencyFallback = getFallbackExamples(decodedSymbol);
      if (emergencyFallback.length > 0) {
        setExampleWords(emergencyFallback);
      }
    }
  }, [loading, symbol]);

  // Force scroll height recalculation after loading and symbol change
  useEffect(() => {
    if (!loading) {
      // Force multiple scroll recalculations
      setTimeout(() => {
        window.scrollTo(0, 0);
        // Force layout recalculation
        document.body.style.height = 'auto';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.height = '';
        // Ensure scrolling is enabled - remove forced overflow settings
        // document.body.style.overflow = 'visible';
        // document.documentElement.style.overflow = 'visible';
      }, 50);

      setTimeout(() => {
        window.scrollTo(0, 0);
        // Double-check scrolling is enabled - remove forced overflow settings
        // document.body.style.overflow = 'visible';
        // document.documentElement.style.overflow = 'visible';
      }, 150);

      setTimeout(() => {
        window.scrollTo(0, 0);
        // Final check - remove forced overflow settings
        // document.body.style.overflow = 'visible';
        // document.documentElement.style.overflow = 'visible';
      }, 300);
    }
  }, [loading, symbol]);

  // Function to show toast messages
  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setShowToast(false);
      setToastMessage(null);
    }, 4000);
  };





  // Initialize Web Speech API
  useEffect(() => {
    const initSpeech = () => {
      // Check if Web Speech API is supported
      if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API not supported in this browser');
        setSpeechSupported(false);
        displayToast('⚠️ Speech synthesis tidak didukung di browser ini. Kartu kata tidak dapat diklik untuk mendengar suara.');
        return;
      }

      try {
        const speechInstance = new PronunciationSpeech({
          onError: displayToast
        });

        // Wait for voices to be loaded with timeout
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait

        const checkInitialized = () => {
          attempts++;
          if (speechInstance.isInitialized) {
            setSpeech(speechInstance);
            setSpeechSupported(true);
            console.log('Web Speech API initialized successfully');
          } else if (attempts < maxAttempts) {
            // Check again in a short delay
            setTimeout(checkInitialized, 100);
          } else {
            // Timeout - no voices loaded
            console.warn('Web Speech API initialization timeout - no voices available');
            setSpeechSupported(false);
            displayToast('⚠️ Tidak dapat memuat suara. Browser mungkin tidak memiliki voice yang tersedia.');
          }
        };

        checkInitialized();
      } catch (error) {
        console.warn('Web Speech API not supported or failed to initialize:', error);
        setSpeechSupported(false);
        displayToast('⚠️ Speech synthesis gagal dimuat. Kartu kata tidak dapat diklik untuk mendengar suara.');
      }
    };

    initSpeech();
  }, []);

  // Fallback example words for symbols without CSV data
  const getFallbackExamples = (symbol: string) => {
    const fallbackExamples: { [key: string]: { text: string; ipa: string }[] } = {
      'ʌ': [
        { text: 'Up', ipa: '/ʌp/' },
        { text: 'Cup', ipa: '/kʌp/' },
        { text: 'But', ipa: '/bʌt/' },
        { text: 'Luck', ipa: '/lʌk/' },
        { text: 'Fun', ipa: '/fʌn/' },
        { text: 'Love', ipa: '/lʌv/' },
        { text: 'Come', ipa: '/kʌm/' },
        { text: 'Bus', ipa: '/bʌs/' },
        { text: 'Sunday', ipa: '/sʌn/' },
        { text: 'Cut', ipa: '/kʌt/' },
        { text: 'Much', ipa: '/mʌtʃ/' },
        { text: 'Us', ipa: '/ʌs/' },
        { text: 'Run', ipa: '/rʌn/' },
        { text: 'Gun', ipa: '/ɡʌn/' },
        { text: 'Jump', ipa: '/dʒʌmp/' },
        { text: 'Shut', ipa: '/ʃʌt/' },
        { text: 'Dust', ipa: '/dʌst/' },
        { text: 'Trust', ipa: '/trʌst/' },
        { text: 'Stuff', ipa: '/stʌf/' },
        { text: 'Dull', ipa: '/dʌl/' },
        { text: 'Ugly', ipa: '/ˈʌɡli/' },
        { text: 'Uncle', ipa: '/ˈʌŋkəl/' },
        { text: 'Under', ipa: '/ˈʌndɚ/' },
        { text: 'Onion', ipa: '/ˈʌnjən/' },
        { text: 'Money', ipa: '/ˈmʌni/' },
        { text: 'Honey', ipa: '/ˈhʌni/' },
        { text: 'Cover', ipa: '/ˈkʌvɚ/' },
        { text: 'Worry', ipa: '/ˈwʌri/' },
        { text: 'Hurry', ipa: '/ˈhʌri/' },
        { text: 'Touch', ipa: '/tʌtʃ/' }
      ],
      'ɪ': [
        { text: 'sit', ipa: '/sɪt/' },
        { text: 'hit', ipa: '/hɪt/' },
        { text: 'bit', ipa: '/bɪt/' },
        { text: 'fit', ipa: '/fɪt/' },
        { text: 'win', ipa: '/wɪn/' },
        { text: 'pin', ipa: '/pɪn/' },
        { text: 'him', ipa: '/hɪm/' },
        { text: 'big', ipa: '/bɪɡ/' },
        { text: 'dig', ipa: '/dɪɡ/' },
        { text: 'kid', ipa: '/kɪd/' },
        { text: 'lid', ipa: '/lɪd/' },
        { text: 'ship', ipa: '/ʃɪp/' },
        { text: 'fish', ipa: '/fɪʃ/' },
        { text: 'milk', ipa: '/mɪlk/' },
        { text: 'hill', ipa: '/hɪl/' },
        { text: 'still', ipa: '/stɪl/' },
        { text: 'will', ipa: '/wɪl/' },
        { text: 'fill', ipa: '/fɪl/' },
        { text: 'chill', ipa: '/tʃɪl/' },
        { text: 'miss', ipa: '/mɪs/' },
        { text: 'kiss', ipa: '/kɪs/' },
        { text: 'list', ipa: '/lɪst/' },
        { text: 'gift', ipa: '/ɡɪft/' },
        { text: 'lift', ipa: '/lɪft/' },
        { text: 'quick', ipa: '/kwɪk/' },
        { text: 'sick', ipa: '/sɪk/' },
        { text: 'thin', ipa: '/θɪn/' },
        { text: 'rich', ipa: '/rɪtʃ/' },
        { text: 'finish', ipa: '/ˈfɪnɪʃ/' },
        { text: 'minute', ipa: '/ˈmɪnɪt/' }
      ],
      'ʊ': [
        { text: 'book', ipa: '/bʊk/' },
        { text: 'cook', ipa: '/kʊk/' },
        { text: 'look', ipa: '/lʊk/' },
        { text: 'took', ipa: '/tʊk/' },
        { text: 'shook', ipa: '/ʃʊk/' },
        { text: 'hook', ipa: '/hʊk/' },
        { text: 'foot', ipa: '/fʊt/' },
        { text: 'good', ipa: '/ɡʊd/' },
        { text: 'wood', ipa: '/wʊd/' },
        { text: 'hood', ipa: '/hʊd/' },
        { text: 'put', ipa: '/pʊt/' },
        { text: 'push', ipa: '/pʊʃ/' },
        { text: 'full', ipa: '/fʊl/' },
        { text: 'bull', ipa: '/bʊl/' },
        { text: 'pull', ipa: '/pʊl/' },
        { text: 'sugar', ipa: '/ˈʃʊɡɚ/' },
        { text: 'cushion', ipa: '/ˈkʊʃən/' },
        { text: 'rookie', ipa: '/ˈrʊki/' },
        { text: 'cookie', ipa: '/ˈkʊki/' },
        { text: 'woman', ipa: '/ˈwʊmən/' },
        { text: 'wolf', ipa: '/wʊlf/' },
        { text: 'bush', ipa: '/bʊʃ/' },
        { text: 'butcher', ipa: '/ˈbʊtʃɚ/' },
        { text: 'pudding', ipa: '/ˈpʊdɪŋ/' },
        { text: 'putty', ipa: '/ˈpʊti/' },
        { text: 'pulling', ipa: '/ˈpʊlɪŋ/' },
        { text: 'hoodie', ipa: '/ˈhʊdi/' },
        { text: 'stood', ipa: '/stʊd/' },
        { text: 'could', ipa: '/kʊd/' },
        { text: 'should', ipa: '/ʃʊd/' }
      ],
      'ɛ': [
        { text: 'bed', ipa: '/bɛd/' },
        { text: 'red', ipa: '/rɛd/' },
        { text: 'head', ipa: '/hɛd/' },
        { text: 'said', ipa: '/sɛd/' },
        { text: 'bread', ipa: '/brɛd/' },
        { text: 'dead', ipa: '/dɛd/' },
        { text: 'friend', ipa: '/frɛnd/' },
        { text: 'send', ipa: '/sɛnd/' },
        { text: 'end', ipa: '/ɛnd/' },
        { text: 'lend', ipa: '/lɛnd/' },
        { text: 'bend', ipa: '/bɛnd/' },
        { text: 'spend', ipa: '/spɛnd/' },
        { text: 'tend', ipa: '/tɛnd/' },
        { text: 'mend', ipa: '/mɛnd/' },
        { text: 'blend', ipa: '/blɛnd/' },
        { text: 'attend', ipa: '/əˈtɛnd/' },
        { text: 'extend', ipa: '/ɪkˈstɛnd/' },
        { text: 'pretend', ipa: '/prɪˈtɛnd/' },
        { text: 'defend', ipa: '/dɪˈfɛnd/' },
        { text: 'depend', ipa: '/dɪˈpɛnd/' },
        { text: 'descend', ipa: '/dɪˈsɛnd/' },
        { text: 'suspend', ipa: '/səˈspɛnd/' },
        { text: 'comprehend', ipa: '/ˌkɑmprɪˈhɛnd/' },
        { text: 'recommend', ipa: '/ˌrɛkəˈmɛnd/' },
        { text: 'legend', ipa: '/ˈlɛdʒənd/' },
        { text: 'second', ipa: '/ˈsɛkənd/' },
        { text: 'beckon', ipa: '/ˈbɛkən/' },
        { text: 'weapon', ipa: '/ˈwɛpən/' },
        { text: 'lemon', ipa: '/ˈlɛmən/' },
        { text: 'lesson', ipa: '/ˈlɛsən/' }
      ],
      'ə': [
        { text: 'about', ipa: '/əˈbaʊt/' },
        { text: 'ago', ipa: '/əˈɡoʊ/' },
        { text: 'sofa', ipa: '/ˈsoʊfə/' },
        { text: 'banana', ipa: '/bəˈnænə/' },
        { text: 'family', ipa: '/ˈfæməli/' },
        { text: 'animal', ipa: '/ˈænəməl/' },
        { text: 'problem', ipa: '/ˈprɑbləm/' },
        { text: 'system', ipa: '/ˈsɪstəm/' },
        { text: 'doctor', ipa: '/ˈdɑktɚ/' },
        { text: 'teacher', ipa: '/ˈtitʃɚ/' },
        { text: 'paper', ipa: '/ˈpeɪpɚ/' },
        { text: 'water', ipa: '/ˈwɑtɚ/' },
        { text: 'color', ipa: '/ˈkʌlɚ/' },
        { text: 'dollar', ipa: '/ˈdɑlɚ/' },
        { text: 'father', ipa: '/ˈfɑðɚ/' },
        { text: 'mother', ipa: '/ˈmʌðɚ/' },
        { text: 'brother', ipa: '/ˈbrʌðɚ/' },
        { text: 'sister', ipa: '/ˈsɪstɚ/' },
        { text: 'another', ipa: '/əˈnʌðɚ/' },
        { text: 'together', ipa: '/təˈɡɛðɚ/' },
        { text: 'today', ipa: '/təˈdeɪ/' },
        { text: 'tomorrow', ipa: '/təˈmɑroʊ/' },
        { text: 'support', ipa: '/səˈpɔrt/' },
        { text: 'supply', ipa: '/səˈplaɪ/' },
        { text: 'suppose', ipa: '/səˈpoʊz/' },
        { text: 'police', ipa: '/pəˈlis/' },
        { text: 'machine', ipa: '/məˈʃin/' },
        { text: 'opinion', ipa: '/əˈpɪnjən/' },
        { text: 'condition', ipa: '/kənˈdɪʃən/' },
        { text: 'position', ipa: '/pəˈzɪʃən/' }
      ],
      'ɚ': [
        { text: 'teacher', ipa: '/ˈtitʃɚ/' },
        { text: 'doctor', ipa: '/ˈdɑktɚ/' },
        { text: 'mother', ipa: '/ˈmʌðɚ/' },
        { text: 'father', ipa: '/ˈfɑðɚ/' },
        { text: 'brother', ipa: '/ˈbrʌðɚ/' },
        { text: 'sister', ipa: '/ˈsɪstɚ/' },
        { text: 'worker', ipa: '/ˈwɜrkɚ/' },
        { text: 'player', ipa: '/ˈpleɪɚ/' },
        { text: 'driver', ipa: '/ˈdraɪvɚ/' },
        { text: 'reader', ipa: '/ˈridɚ/' },
        { text: 'writer', ipa: '/ˈraɪtɚ/' },
        { text: 'singer', ipa: '/ˈsɪŋɚ/' },
        { text: 'painter', ipa: '/ˈpeɪntɚ/' },
        { text: 'leader', ipa: '/ˈlidɚ/' },
        { text: 'manager', ipa: '/ˈmænɪdʒɚ/' },
        { text: 'customer', ipa: '/ˈkʌstəmɚ/' },
        { text: 'computer', ipa: '/kəmˈpjutɚ/' },
        { text: 'number', ipa: '/ˈnʌmbɚ/' },
        { text: 'summer', ipa: '/ˈsʌmɚ/' },
        { text: 'winter', ipa: '/ˈwɪntɚ/' },
        { text: 'dinner', ipa: '/ˈdɪnɚ/' },
        { text: 'winner', ipa: '/ˈwɪnɚ/' },
        { text: 'center', ipa: '/ˈsɛntɚ/' },
        { text: 'better', ipa: '/ˈbɛtɚ/' },
        { text: 'letter', ipa: '/ˈlɛtɚ/' },
        { text: 'water', ipa: '/ˈwɑtɚ/' },
        { text: 'order', ipa: '/ˈɔrdɚ/' },
        { text: 'corner', ipa: '/ˈkɔrnɚ/' },
        { text: 'later', ipa: '/ˈleɪtɚ/' }
      ]
    };
    return fallbackExamples[symbol] || [];
  };

  const words: Word[] = useMemo(() => {
    // Use the first 7 example words for the interactive word grid
    return exampleWords.slice(0, 7).map((word, index) => ({
      text: word.text,
      ipa: word.ipa,
      start: 0.2 + (index * 0.5), // Generate timing intervals
      end: 0.6 + (index * 0.5)
    }));
  }, [exampleWords]);

  if (loading) {
    return (
      <>
        <Sidebar />
        <GoBackButton />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>Loading symbol data...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="pronunciation-symbol-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Sidebar />
      <GoBackButton />
      <TipsButton symbol={decodeURIComponent(symbol || '')} />
      <div className="main-content">
        {headerText === 'VOWEL (Lax)' ? (
          <h1 className="center-text">
            VOWEL<br />(Lax)
          </h1>
        ) : (
          <h1 className="center-text">{headerText}</h1>
        )}
        <p className="center-text">/{decodeURIComponent(symbol || '')}/</p>

        <div className="examples-container">
          <h1>Examples:</h1>
          <FocusModeButton key={symbol} words={words} symbol={decodeURIComponent(symbol || '')} />
          <div key={symbol} className="examples-word-grid">
            {exampleWords.length > 0 ? (
              exampleWords.map((word, index) => (
                <div
                  key={index}
                  className="examples-word-card"
                  onClick={() => speechSupported && speech && speech.speak(word.text, { rate: 0.7 })}
                  style={{ cursor: speechSupported && speech ? 'pointer' : 'default' }}
                >
                  <div className="examples-word">{word.text}</div>
                  <div className="examples-ipa">{word.ipa}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Loading example words for /{decodeURIComponent(symbol || '')}/...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PronunciationSymbol;
