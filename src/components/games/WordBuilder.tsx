import { useState, useEffect, useCallback } from 'react';
import { Topic, WordItem } from '@/data/topics';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function WordBuilder({ topic, onScore }: Props) {
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [letters, setLetters] = useState<{ id: string; char: string; used: boolean }[]>([]);
  const [answer, setAnswer] = useState<{ id: string; char: string }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [solved, setSolved] = useState(0);

  const nextWord = useCallback(() => {
    const idx = Math.floor(Math.random() * topic.words.length);
    const word = topic.words[idx];
    setCurrentWord(word);
    const chars = word.word.replace(/\s/g, '').split('');
    const shuffled = [...chars]
      .sort(() => Math.random() - 0.5)
      .map((char, i) => ({ id: `l-${i}`, char, used: false }));
    setLetters(shuffled);
    setAnswer([]);
    setFeedback(null);
  }, [topic]);

  useEffect(() => { nextWord(); setSolved(0); }, [topic]);

  const addLetter = (letterId: string) => {
    if (feedback) return;
    const letter = letters.find(l => l.id === letterId);
    if (!letter || letter.used) return;
    setLetters(prev => prev.map(l => l.id === letterId ? { ...l, used: true } : l));
    setAnswer(prev => [...prev, { id: letterId, char: letter.char }]);
  };

  const removeLetter = (letterId: string) => {
    if (feedback) return;
    setAnswer(prev => prev.filter(a => a.id !== letterId));
    setLetters(prev => prev.map(l => l.id === letterId ? { ...l, used: false } : l));
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    const answerWord = answer.map(a => a.char).join('');
    const targetWord = currentWord.word.replace(/\s/g, '');
    if (answerWord.toLowerCase() === targetWord.toLowerCase()) {
      setFeedback('correct');
      setSolved(s => s + 1);
      onScore(20);
      setTimeout(() => nextWord(), 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const clearAnswer = () => {
    setAnswer([]);
    setLetters(prev => prev.map(l => ({ ...l, used: false })));
    setFeedback(null);
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="fun-card border-4 p-6 text-center w-full max-w-sm"
        style={{ borderColor: topic.color }}>
        <div className="text-6xl mb-3 float-anim">{currentWord.emoji}</div>
        <p className="text-gray-400 text-sm font-bold">{currentWord.translation}</p>
        <p className="text-xs text-gray-300 mt-1">Собери слово из букв!</p>
      </div>

      <div className="fun-card border-4 p-4 w-full max-w-sm min-h-16 flex flex-wrap gap-2 justify-center items-center"
        style={{ borderColor: feedback === 'correct' ? '#4CAF50' : feedback === 'wrong' ? '#F44336' : topic.color }}>
        {answer.length === 0 && (
          <span className="text-gray-300 text-sm font-bold">Нажимай на буквы ниже...</span>
        )}
        {answer.map(a => (
          <button
            key={a.id}
            onClick={() => removeLetter(a.id)}
            className="w-10 h-10 rounded-xl font-fredoka text-lg text-white transition-all hover:scale-110 active:scale-95"
            style={{ background: topic.color }}
          >
            {a.char}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`animate-bounce-in text-center py-2 px-5 rounded-2xl font-fredoka text-base ${
          feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500 shake'
        }`}>
          {feedback === 'correct' ? '🌟 Молодец! Правильно!' : '❌ Не то... Попробуй ещё!'}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {letters.map(l => (
          <button
            key={l.id}
            onClick={() => addLetter(l.id)}
            disabled={l.used}
            className={`w-11 h-11 rounded-xl font-fredoka text-lg transition-all duration-200 border-4 ${
              l.used
                ? 'opacity-30 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
                : 'text-white hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            style={!l.used ? { background: topic.color, borderColor: topic.color } : {}}
          >
            {l.char}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearAnswer}
          className="btn-fun bg-gray-400 text-sm"
        >
          🔄 Очистить
        </button>
        <button
          onClick={checkAnswer}
          disabled={answer.length === 0}
          className="btn-fun text-sm"
          style={{ background: topic.color }}
        >
          ✅ Проверить
        </button>
      </div>

      <div className="text-center">
        <span className="font-bold text-gray-400 text-sm">Слов собрано: </span>
        <span className="font-fredoka text-lg" style={{ color: topic.color }}>{solved}</span>
      </div>
    </div>
  );
}
