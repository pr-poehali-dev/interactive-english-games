import { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import MascotHelper, { MascotState } from '@/components/MascotHelper';

interface ToBeQuestion {
  sentence: string;
  correct: string;
  options: string[];
  emoji: string;
}

interface Props {
  onScore: (pts: number) => void;
  color?: string;
}

const questions: ToBeQuestion[] = [
  { sentence: "___ a cat.", correct: "It", options: ["I", "He", "It", "We"], emoji: "🐱" },
  { sentence: "___ happy.", correct: "She", options: ["I", "She", "They", "It"], emoji: "😊" },
  { sentence: "___ a student.", correct: "I", options: ["I", "He", "She", "We"], emoji: "📚" },
  { sentence: "___ my friends.", correct: "They", options: ["He", "She", "It", "They"], emoji: "👥" },
  { sentence: "___ a doctor.", correct: "He", options: ["I", "He", "It", "They"], emoji: "👨‍⚕️" },
  { sentence: "___ at school.", correct: "We", options: ["I", "We", "She", "It"], emoji: "🏫" },
  { sentence: "___ a dog.", correct: "It", options: ["He", "She", "It", "They"], emoji: "🐶" },
  { sentence: "___ a teacher.", correct: "You", options: ["I", "You", "He", "We"], emoji: "👩‍🏫" },
  { sentence: "___ big.", correct: "It", options: ["I", "She", "It", "We"], emoji: "🐘" },
  { sentence: "___ tired.", correct: "I", options: ["I", "He", "They", "It"], emoji: "😴" },
  { sentence: "___ beautiful.", correct: "She", options: ["He", "She", "It", "We"], emoji: "🌸" },
  { sentence: "___ fast.", correct: "He", options: ["I", "He", "She", "They"], emoji: "🏃" },
];

const pronounsForms: Record<string, string> = {
  'I': 'am', 'He': 'is', 'She': 'is', 'It': 'is',
  'You': 'are', 'We': 'are', 'They': 'are'
};

const MAX_LIVES = 3;

export default function ToBeGame({ onScore, color = '#9B59B6' }: Props) {
  const { playCorrect, playWrong, playWin } = useSound();
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [shuffled, setShuffled] = useState<ToBeQuestion[]>([]);
  const [mascot, setMascot] = useState<MascotState>('hello');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setShuffled([...questions].sort(() => Math.random() - 0.5));
    setQIndex(0); setScore(0); setLives(MAX_LIVES); setSelected(null); setFeedback(null);
    setMascot('hello'); setGameOver(false);
  }, []);

  const q = shuffled[qIndex];

  const handleAnswer = (pronoun: string) => {
    if (selected || gameOver) return;
    setSelected(pronoun);
    if (pronoun === q.correct) {
      setFeedback('correct'); setScore(s => s + 1); onScore(15);
      playCorrect(); setMascot('correct');
      if (qIndex + 1 >= shuffled.length) { setTimeout(() => { playWin(); setMascot('win'); setGameOver(true); }, 1400); return; }
      setTimeout(() => { setQIndex(i => i + 1); setSelected(null); setFeedback(null); setMascot('thinking'); }, 1500);
    } else {
      setFeedback('wrong'); playWrong(); setMascot('wrong');
      setLives(l => {
        const next = l - 1;
        if (next <= 0) { setTimeout(() => setGameOver(true), 1500); return next; }
        setTimeout(() => { setQIndex(i => (i + 1) % shuffled.length); setSelected(null); setFeedback(null); setMascot('thinking'); }, 1500);
        return next;
      });
    }
  };

  const restart = () => {
    setShuffled([...questions].sort(() => Math.random() - 0.5));
    setQIndex(0); setScore(0); setLives(MAX_LIVES); setSelected(null);
    setFeedback(null); setMascot('hello'); setGameOver(false);
  };

  if (gameOver) return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="text-7xl animate-bounce-in">{score >= 8 ? '🏆' : score >= 5 ? '⭐' : '😅'}</div>
      <h3 className="font-fredoka text-3xl" style={{ color }}>Тренировка окончена!</h3>
      <div className="fun-card border-4 p-5 text-center w-full max-w-xs" style={{ borderColor: color }}>
        <div className="font-fredoka text-5xl mb-2" style={{ color }}>{score}</div>
        <div className="text-gray-500 font-bold">правильных из {shuffled.length}</div>
        <div className="text-sm text-gray-400 mt-2">{score >= 8 ? '🌟 Ты отлично знаешь TO BE!' : score >= 5 ? '👍 Хорошо! Ещё немного практики!' : '💪 Тренируйся — и всё получится!'}</div>
      </div>
      <button onClick={restart} className="btn-fun text-lg px-8 py-3" style={{ background: color }}>🔄 Ещё раз!</button>
    </div>
  );

  if (!q) return null;

  const toBeForm = pronounsForms[q.correct] || 'is';
  const sentencePart = q.sentence.replace('___', '').trim();

  return (
    <div className="flex flex-col items-center gap-4">
      <MascotHelper state={mascot} />

      <div className="flex gap-3 flex-wrap justify-center">
        <div className="fun-card border-2 px-4 py-2 flex items-center gap-2" style={{ borderColor: color }}>
          <span>⭐</span><span className="font-fredoka text-lg" style={{ color }}>{score} баллов</span>
        </div>
        <div className="fun-card border-2 px-3 py-2 flex items-center gap-1" style={{ borderColor: color }}>
          <span className="text-xs text-gray-400 font-bold mr-1">{qIndex + 1}/{shuffled.length}</span>
        </div>
        <div className="fun-card border-2 border-red-200 px-4 py-2 flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} className="text-lg" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
      </div>

      <div className="fun-card border-4 p-6 text-center w-full max-w-sm" style={{ borderColor: color }}>
        <div className="text-7xl mb-4 float-anim">{q.emoji}</div>
        <div className="text-xl font-bold text-gray-700 flex items-center justify-center flex-wrap gap-2">
          <span className={`inline-block px-3 py-1 rounded-xl border-4 border-dashed min-w-16 text-center font-fredoka text-lg transition-all ${
            selected
              ? feedback === 'correct' ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-red-100 border-red-400 text-red-600'
              : 'border-gray-300 text-gray-400'
          }`}>
            {selected || '???'}
          </span>
          <span className="text-gray-500 font-bold">{toBeForm}</span>
          <span className="text-gray-700">{sentencePart}</span>
        </div>
        <p className="text-xs text-gray-400 mt-3">Выбери правильное местоимение</p>
      </div>

      {feedback && (
        <div className={`animate-bounce-in text-center py-2 px-5 rounded-2xl font-fredoka text-sm ${
          feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500 shake'
        }`}>
          {feedback === 'correct'
            ? `🌟 Верно! ${q.correct} ${toBeForm} ${sentencePart}`
            : `❌ Нет! Должно быть: "${q.correct} ${toBeForm}..."`}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.options.map(opt => {
          let cls = 'border-4 bg-white hover:scale-105 cursor-pointer';
          let bc = color;
          if (selected) {
            if (opt === q.correct) { cls = 'border-4 bg-green-100'; bc = '#4CAF50'; }
            else if (opt === selected) { cls = 'border-4 bg-red-100 shake'; bc = '#F44336'; }
            else { cls = 'border-4 bg-gray-50 opacity-50'; bc = '#ddd'; }
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)}
              className={`${cls} rounded-2xl py-4 font-fredoka text-xl transition-all duration-200`}
              style={{ borderColor: bc, color: bc }}>
              {opt}
              <div className="text-xs mt-1 text-gray-400">{opt} {pronounsForms[opt]}</div>
            </button>
          );
        })}
      </div>

      <div className="fun-card border-2 p-4 w-full max-w-sm text-center" style={{ borderColor: color, background: `${color}10` }}>
        <p className="text-xs font-bold text-gray-500 mb-2">📖 Запомни:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(pronounsForms).map(([pron, form]) => (
            <span key={pron} className="px-2 py-1 rounded-lg font-bold text-white text-xs" style={{ background: color }}>
              {pron} {form}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
