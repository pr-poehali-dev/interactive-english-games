import { useState, useCallback, useEffect } from 'react';
import { Topic, WordItem } from '@/data/topics';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function ListenClick({ topic, onScore }: Props) {
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const nextRound = useCallback(() => {
    const shuffled = [...topic.words].sort(() => Math.random() - 0.5);
    const word = shuffled[0];
    const opts = shuffled.slice(0, Math.min(4, topic.words.length)).sort(() => Math.random() - 0.5);
    if (!opts.find(o => o.id === word.id)) {
      opts[0] = word;
      opts.sort(() => Math.random() - 0.5);
    }
    setCurrentWord(word);
    setOptions(opts);
    setSelected(null);
    setFeedback(null);
  }, [topic]);

  useEffect(() => {
    nextRound();
    setScore(0);
    setTotal(0);
  }, [topic]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleSpeak = () => {
    if (currentWord) speak(currentWord.word);
  };

  const handleSelect = (wordId: string) => {
    if (selected) return;
    setSelected(wordId);
    setTotal(t => t + 1);
    if (wordId === currentWord?.id) {
      setFeedback('correct');
      setScore(s => s + 1);
      onScore(15);
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => nextRound(), 1600);
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: topic.color }}>
          <div className="text-2xl font-fredoka text-green-500">{score}</div>
          <div className="text-xs text-gray-500 font-bold">верно</div>
        </div>
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: topic.color }}>
          <div className="text-2xl font-fredoka text-gray-600">{total}</div>
          <div className="text-xs text-gray-500 font-bold">всего</div>
        </div>
      </div>

      <div className="fun-card border-4 p-8 text-center w-full max-w-sm"
        style={{ borderColor: topic.color }}>
        <button
          onClick={handleSpeak}
          className={`mx-auto flex flex-col items-center gap-3 transition-all active:scale-95 ${speaking ? 'animate-pulse' : 'hover:scale-110'}`}
        >
          <div className="text-8xl">{speaking ? '🔊' : '🔈'}</div>
          <div className="font-fredoka text-lg" style={{ color: topic.color }}>
            {speaking ? 'Слушаю...' : 'Нажми и слушай!'}
          </div>
        </button>
        <p className="text-xs text-gray-400 mt-3">Нажми на картинку, которую услышал</p>
      </div>

      {feedback && (
        <div className={`animate-bounce-in text-center py-2 px-5 rounded-2xl font-fredoka text-base ${
          feedback === 'correct' ? 'bg-green-100 text-green-600 border-2 border-green-400' : 'bg-red-100 text-red-500 border-2 border-red-400'
        }`}>
          {feedback === 'correct' ? '🌟 Правильно!' : `❌ Это было "${currentWord.word}"`}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {options.map(opt => {
          let style = 'border-4 bg-white hover:scale-105 cursor-pointer';
          let borderColor = topic.color;
          if (selected) {
            if (opt.id === currentWord?.id) { style = 'border-4 bg-green-100'; borderColor = '#4CAF50'; }
            else if (opt.id === selected) { style = 'border-4 bg-red-100'; borderColor = '#F44336'; }
            else { style = 'border-4 bg-gray-50 opacity-50'; borderColor = '#ddd'; }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`${style} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 font-bold`}
              style={{ borderColor }}
            >
              <span className="text-5xl">{opt.emoji}</span>
              <span className="text-sm" style={{ color: topic.color }}>{opt.word}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => { if (currentWord) speak(currentWord.word); }}
        className="btn-fun text-sm"
        style={{ background: topic.color }}
      >
        🔊 Повторить слово
      </button>
    </div>
  );
}
