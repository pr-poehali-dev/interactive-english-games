import { useState, useCallback, useEffect } from 'react';
import { Topic, WordItem } from '@/data/topics';
import { useSound } from '@/hooks/useSound';
import MascotHelper, { MascotState } from '@/components/MascotHelper';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

const MAX_LIVES = 3;

export default function ListenClick({ topic, onScore }: Props) {
  const { playCorrect, playWrong, playWin } = useSound();
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [speaking, setSpeaking] = useState(false);
  const [mascot, setMascot] = useState<MascotState>('hello');
  const [gameOver, setGameOver] = useState(false);

  const nextRound = useCallback(() => {
    const shuffled = [...topic.words].sort(() => Math.random() - 0.5);
    const word = shuffled[0];
    const opts = shuffled.slice(0, Math.min(4, topic.words.length)).sort(() => Math.random() - 0.5);
    if (!opts.find(o => o.id === word.id)) { opts[0] = word; opts.sort(() => Math.random() - 0.5); }
    setCurrentWord(word); setOptions(opts);
    setSelected(null); setFeedback(null); setMascot('thinking');
  }, [topic]);

  useEffect(() => {
    nextRound(); setScore(0); setTotal(0); setLives(MAX_LIVES); setGameOver(false); setMascot('hello');
  }, [topic]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.8; u.pitch = 1.1;
      setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  }, []);

  const handleSelect = (wordId: string) => {
    if (selected || gameOver) return;
    setSelected(wordId); setTotal(t => t + 1);
    if (wordId === currentWord?.id) {
      setFeedback('correct'); setScore(s => s + 1); onScore(15);
      playCorrect(); setMascot('correct');
      setTimeout(() => nextRound(), 1500);
    } else {
      setFeedback('wrong'); playWrong(); setMascot('wrong');
      setLives(l => {
        const next = l - 1;
        if (next <= 0) { setTimeout(() => setGameOver(true), 1500); return next; }
        setTimeout(() => nextRound(), 1500);
        return next;
      });
    }
  };

  const restart = () => {
    setScore(0); setTotal(0); setLives(MAX_LIVES); setGameOver(false); nextRound();
  };

  if (gameOver) return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="text-7xl animate-bounce-in">{score >= total * 0.7 ? '🏆' : '⭐'}</div>
      <h3 className="font-fredoka text-3xl" style={{ color: topic.color }}>Игра окончена!</h3>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="fun-card border-4 p-4 text-center border-green-400">
          <div className="font-fredoka text-4xl text-green-500">{score}</div>
          <div className="text-xs text-gray-500 font-bold">правильно</div>
        </div>
        <div className="fun-card border-4 p-4 text-center" style={{ borderColor: topic.color }}>
          <div className="font-fredoka text-4xl" style={{ color: topic.color }}>{total}</div>
          <div className="text-xs text-gray-500 font-bold">всего</div>
        </div>
      </div>
      <button onClick={restart} className="btn-fun text-lg px-8 py-3" style={{ background: topic.color }}>🔄 Играть снова!</button>
    </div>
  );

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <MascotHelper state={mascot} />

      <div className="flex gap-3 flex-wrap justify-center">
        <div className="fun-card border-2 px-4 py-2 flex items-center gap-2" style={{ borderColor: topic.color }}>
          <span>✅</span><span className="font-fredoka text-lg" style={{ color: topic.color }}>{score}/{total}</span>
        </div>
        <div className="fun-card border-2 border-red-200 px-4 py-2 flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} className="text-lg" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
      </div>

      <div className="fun-card border-4 p-8 text-center w-full max-w-sm" style={{ borderColor: topic.color }}>
        <button onClick={() => speak(currentWord.word)}
          className={`mx-auto flex flex-col items-center gap-3 transition-all active:scale-95 ${speaking ? 'animate-pulse' : 'hover:scale-110'}`}>
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
          {feedback === 'correct' ? '🌟 Правильно! +15 баллов!' : `❌ Это было "${currentWord.word}"`}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {options.map(opt => {
          let cls = 'border-4 bg-white hover:scale-105 cursor-pointer';
          let bc = topic.color;
          if (selected) {
            if (opt.id === currentWord?.id) { cls = 'border-4 bg-green-100'; bc = '#4CAF50'; }
            else if (opt.id === selected) { cls = 'border-4 bg-red-100 shake'; bc = '#F44336'; }
            else { cls = 'border-4 bg-gray-50 opacity-50'; bc = '#ddd'; }
          }
          return (
            <button key={opt.id} onClick={() => handleSelect(opt.id)}
              className={`${cls} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 font-bold`}
              style={{ borderColor: bc }}>
              <span className="text-5xl">{opt.emoji}</span>
              <span className="text-sm font-fredoka" style={{ color: bc }}>{opt.word}</span>
            </button>
          );
        })}
      </div>

      <button onClick={() => speak(currentWord.word)} className="btn-fun text-sm" style={{ background: topic.color }}>
        🔊 Повторить слово
      </button>
    </div>
  );
}
