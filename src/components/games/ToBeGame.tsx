import { useState, useEffect } from 'react';

interface ToBeQuestion {
  sentence: string;
  blank: string;
  correct: string;
  options: string[];
  emoji: string;
}

interface Props {
  onScore: (pts: number) => void;
}

const questions: ToBeQuestion[] = [
  { sentence: "___ a cat.", blank: "It", correct: "It", options: ["I", "He", "It", "We"], emoji: "🐱" },
  { sentence: "___ happy.", blank: "She", correct: "She", options: ["I", "She", "They", "It"], emoji: "😊" },
  { sentence: "___ a student.", blank: "I", correct: "I", options: ["I", "He", "She", "We"], emoji: "📚" },
  { sentence: "___ my friends.", blank: "They", correct: "They", options: ["He", "She", "It", "They"], emoji: "👥" },
  { sentence: "___ a doctor.", blank: "He", correct: "He", options: ["I", "He", "It", "They"], emoji: "👨‍⚕️" },
  { sentence: "___ at school.", blank: "We", correct: "We", options: ["I", "We", "She", "It"], emoji: "🏫" },
  { sentence: "___ a dog.", blank: "It", correct: "It", options: ["He", "She", "It", "They"], emoji: "🐶" },
  { sentence: "___ a teacher.", blank: "You", correct: "You", options: ["I", "You", "He", "We"], emoji: "👩‍🏫" },
  { sentence: "___ big.", blank: "It", correct: "It", options: ["I", "She", "It", "We"], emoji: "🐘" },
  { sentence: "___ tired.", blank: "I", correct: "I", options: ["I", "He", "They", "It"], emoji: "😴" },
];

const pronounsForms: Record<string, string> = {
  'I': 'am', 'He': 'is', 'She': 'is', 'It': 'is',
  'You': 'are', 'We': 'are', 'They': 'are'
};

interface Props2 extends Props {
  color?: string;
}

export default function ToBeGame({ onScore, color = '#9B59B6' }: Props2) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [shuffled, setShuffled] = useState<ToBeQuestion[]>([]);

  useEffect(() => {
    setShuffled([...questions].sort(() => Math.random() - 0.5));
    setQIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
  }, []);

  const q = shuffled[qIndex];

  const handleAnswer = (pronoun: string) => {
    if (selected) return;
    setSelected(pronoun);
    if (pronoun === q.correct) {
      setFeedback('correct');
      setScore(s => s + 1);
      onScore(15);
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setQIndex(i => (i + 1) % shuffled.length);
      setSelected(null);
      setFeedback(null);
    }, 1600);
  };

  if (!q) return null;

  const parts = q.sentence.split('___');
  const toBeForm = pronounsForms[q.correct] || 'is';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: color }}>
          <div className="text-2xl font-fredoka" style={{ color }}>{score}</div>
          <div className="text-xs text-gray-500 font-bold">баллов</div>
        </div>
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: color }}>
          <div className="text-2xl font-fredoka text-gray-600">{qIndex + 1}/{shuffled.length}</div>
          <div className="text-xs text-gray-500 font-bold">вопрос</div>
        </div>
      </div>

      <div className="fun-card border-4 p-6 text-center w-full max-w-sm" style={{ borderColor: color }}>
        <div className="text-7xl mb-4 float-anim">{q.emoji}</div>
        <div className="text-xl font-bold text-gray-700 flex items-center justify-center flex-wrap gap-1">
          <span className={`inline-block px-3 py-1 rounded-xl border-4 border-dashed min-w-16 text-center font-fredoka ${
            selected ? (feedback === 'correct' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-600') : 'border-gray-300 text-gray-400'
          }`}>
            {selected || '???'}
          </span>
          <span className="text-gray-500 font-bold mx-1">{toBeForm}</span>
          <span>{parts[1]}</span>
        </div>
        <p className="text-xs text-gray-400 mt-3">Выбери правильное местоимение</p>
      </div>

      {feedback && (
        <div className={`animate-bounce-in text-center py-2 px-5 rounded-2xl font-fredoka text-base ${
          feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500 shake'
        }`}>
          {feedback === 'correct'
            ? `🌟 Правильно! ${q.correct} ${toBeForm}${q.sentence.replace('___', '').trim()}`
            : `❌ Нет! Должно быть: "${q.correct} ${toBeForm}..."`}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.options.map(opt => {
          let btnClass = 'border-4 bg-white hover:scale-105 cursor-pointer';
          let borderColor = color;
          if (selected) {
            if (opt === q.correct) { btnClass = 'border-4 bg-green-100'; borderColor = '#4CAF50'; }
            else if (opt === selected) { btnClass = 'border-4 bg-red-100'; borderColor = '#F44336'; }
            else { btnClass = 'border-4 bg-gray-50 opacity-50'; borderColor = '#ddd'; }
          }

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className={`${btnClass} rounded-2xl py-4 font-fredoka text-xl transition-all duration-200`}
              style={{ borderColor, color: borderColor }}
            >
              {opt}
              <div className="text-xs mt-1 font-nunito text-gray-400">{opt} {pronounsForms[opt]}</div>
            </button>
          );
        })}
      </div>

      <div className="fun-card border-2 p-4 w-full max-w-sm text-center" style={{ borderColor: color, background: `${color}10` }}>
        <p className="text-xs font-bold text-gray-500 mb-2">📖 Запомни:</p>
        <div className="flex flex-wrap gap-2 justify-center text-sm">
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
