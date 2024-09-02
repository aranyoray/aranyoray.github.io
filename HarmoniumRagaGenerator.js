import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const moodRagas = {
  'Romantic': ['Yaman', 'Bhimpalasi'],
  'Peaceful': ['Bhupali', 'Desh'],
  'Devotional': ['Bhairav', 'Bhairavi'],
  'Joyful': ['Bilawal', 'Khamaj']
};

const moodColors = {
  'Romantic': 'bg-pink-500 hover:bg-pink-600',
  'Peaceful': 'bg-green-500 hover:bg-green-600',
  'Devotional': 'bg-purple-500 hover:bg-purple-600',
  'Joyful': 'bg-yellow-500 hover:bg-yellow-600'
};

const ragas = {
  'Yaman': {
    notes: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
    phrases: [
      ['C', 'D', 'E', 'F#'],
      ['A', 'B', 'C', 'B', 'A'],
      ['G', 'F#', 'E', 'D', 'C']
    ]
  },
  'Bhimpalasi': {
    notes: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
    phrases: [
      ['C', 'Eb', 'F', 'G'],
      ['A', 'Bb', 'G', 'F'],
      ['Eb', 'D', 'C']
    ]
  },
  'Bhupali': {
    notes: ['C', 'D', 'E', 'G', 'A'],
    phrases: [
      ['C', 'D', 'E', 'G'],
      ['A', 'G', 'E', 'D'],
      ['E', 'G', 'A', 'C']
    ]
  },
  'Desh': {
    notes: ['C', 'D', 'E', 'F', 'G', 'A'],
    phrases: [
      ['C', 'D', 'F', 'G'],
      ['A', 'C', 'A', 'G'],
      ['E', 'F', 'E', 'D', 'C']
    ]
  },
  'Bhairav': {
    notes: ['C', 'Db', 'E', 'F', 'G', 'Ab', 'B'],
    phrases: [
      ['C', 'Db', 'E', 'F'],
      ['G', 'Ab', 'B', 'C'],
      ['B', 'Ab', 'G', 'F', 'E', 'Db', 'C']
    ]
  },
  'Bhairavi': {
    notes: ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb'],
    phrases: [
      ['C', 'Eb', 'F', 'G'],
      ['Ab', 'Bb', 'G', 'F'],
      ['Eb', 'Db', 'C']
    ]
  },
  'Bilawal': {
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    phrases: [
      ['C', 'D', 'E', 'G'],
      ['F', 'E', 'D', 'C'],
      ['G', 'A', 'B', 'C']
    ]
  },
  'Khamaj': {
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'Bb', 'B'],
    phrases: [
      ['C', 'E', 'F', 'G'],
      ['A', 'Bb', 'G', 'F'],
      ['E', 'D', 'C']
    ]
  }
};

const RagaButton = ({ name, mood, isPlaying, onClick }) => (
  <button
    className={`w-full h-24 m-1 rounded-lg flex flex-col items-center justify-center text-white transition-colors ${
      moodColors[mood]
    } ${isPlaying ? 'ring-4 ring-white' : ''}`}
    onClick={onClick}
  >
    <span className="text-xl font-bold">{name}</span>
    <span className="text-sm">{mood}</span>
  </button>
);

const HarmoniumRagaGenerator = () => {
  const [playingRagas, setPlayingRagas] = useState({});
  const [tempo, setTempo] = useState(60);
  const [isDronePlaying, setIsDronePlaying] = useState(false);
  const audioContextRef = useRef(null);
  const droneOscillatorsRef = useRef([]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createHarmoniumSound = (frequency, time, duration) => {
    const ctx = audioContextRef.current;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainOsc = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(frequency, time);
    osc2.frequency.setValueAtTime(frequency * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, time);
    filter.Q.setValueAtTime(1, time);

    const reverb = ctx.createConvolver();
    const reverbTime = 2;
    const sampleRate = ctx.sampleRate;
    const bufferLength = sampleRate * reverbTime;
    const buffer = ctx.createBuffer(2, bufferLength, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * reverbTime));
      }
    }
    reverb.buffer = buffer;

    osc1.connect(gainOsc);
    osc2.connect(gainOsc);
    gainOsc.connect(filter);
    filter.connect(reverb);
    reverb.connect(ctx.destination);

    gainOsc.gain.setValueAtTime(0, time);
    gainOsc.gain.linearRampToValueAtTime(0.3, time + 0.1);
    gainOsc.gain.setValueAtTime(0.3, time + duration - 0.1);
    gainOsc.gain.linearRampToValueAtTime(0, time + duration);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  };

  const playNote = (note, time, duration) => {
    const freq = 261.63 * Math.pow(2, ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(note.replace('b', '#')) / 12);
    createHarmoniumSound(freq, time, duration);
  };

  const playPhrase = useCallback((ragaName) => {
    if (!audioContextRef.current) return;

    const raga = ragas[ragaName];
    const phrase = raga.phrases[Math.floor(Math.random() * raga.phrases.length)];
    const noteDuration = 60 / tempo;
    let startTime = audioContextRef.current.currentTime;

    phrase.forEach((note, index) => {
      playNote(note, startTime + index * noteDuration, noteDuration);
    });

    setTimeout(() => {
      if (playingRagas[ragaName]) {
        playPhrase(ragaName);
      }
    }, phrase.length * noteDuration * 1000);
  }, [tempo, playingRagas]);

  const toggleRaga = useCallback((ragaName) => {
    setPlayingRagas(prev => {
      const newState = { ...prev, [ragaName]: !prev[ragaName] };
      if (newState[ragaName]) {
        playPhrase(ragaName);
      }
      return newState;
    });
  }, [playPhrase]);

  const toggleDrone = () => {
    if (isDronePlaying) {
      droneOscillatorsRef.current.forEach(osc => osc.stop());
      droneOscillatorsRef.current = [];
    } else {
      const ctx = audioContextRef.current;
      const fundamentalFreq = 261.63; // C4
      const fifthFreq = fundamentalFreq * 3/2;

      [fundamentalFreq, fifthFreq].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        droneOscillatorsRef.current.push(osc);
      });
    }
    setIsDronePlaying(!isDronePlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Harmonium-like Raga Phrase Generator</h1>
      <div className="grid grid-cols-4 gap-2 w-full max-w-3xl mb-4">
        {Object.entries(moodRagas).flatMap(([mood, ragaList]) =>
          ragaList.map((ragaName) => (
            <RagaButton
              key={ragaName}
              name={ragaName}
              mood={mood}
              isPlaying={playingRagas[ragaName]}
              onClick={() => toggleRaga(ragaName)}
            />
          ))
        )}
      </div>
      <div className="flex flex-wrap justify-center mb-4">
        {Object.entries(moodColors).map(([mood, color]) => (
          <div key={mood} className="flex items-center mr-4 mb-2">
            <div className={`w-4 h-4 rounded ${color.split(' ')[0]} mr-2`}></div>
            <span className="text-white text-sm">{mood}</span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-3xl flex items-center space-x-4 mb-4">
        <span className="text-white">Tempo:</span>
        <Slider
          value={[tempo]}
          onValueChange={(value) => setTempo(value[0])}
          min={40}
          max={200}
          step={1}
          className="flex-grow"
        />
        <span className="text-white">{tempo} BPM</span>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="drone-switch"
          checked={isDronePlaying}
          onCheckedChange={toggleDrone}
        />
        <label htmlFor="drone-switch" className="text-white">
          Drone
        </label>
      </div>
    </div>
  );
};

export default HarmoniumRagaGenerator;