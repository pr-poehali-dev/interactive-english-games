import { useState, useEffect, useCallback } from 'react';
import { Topic, WordItem } from '@/data/topics';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function QuizGame({ topic, onScore }: Props) {
  const [question, setQuestion] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const nextQuestion = useCallback(() => {
    const shuffled = [...topic.words].sort(() => Math.random() - 0.5);
    const q = shuffled[0];
    const wrong = shuffled.slice(1, 3);
    const allOptions = [q, ...wrong].sort(() => Math.random() - 0.5);
    setQuestion(q);
    setOptions(allOptions);
    setSelected(null);
    setFeedback(null);
  }, [topic]);

  useEffect(() => {
    nextQuestion();
    setCorrect(0);
    setTotal(0);
  }, [topic]);

  const handleAnswer = (wordId: string) => {
    if (selected) return;
    setSelected(wordId);
    setTotal(t => t + 1);
    if (wordId === question?.id) {
      setFeedback('correct');
      setCorrect(c => c + 1);
      onScore(15);
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => nextQuestion(), 1500);
  };

  if (!question) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: topic.color }}>
          <div className="text-2xl font-fredoka text-green-500">{correct}</div>
          <div className="text-xs text-gray-500 font-bold">верно</div>
        </div>
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: topic.color }}>
          <div className="text-2xl font-fredoka text-gray-600">{total}</div>
          <div className="text-xs text-gray-500 font-bold">всего</div>
        </div>
      </div>

      <div className="fun-card border-4 p-8 text-center w-full max-w-sm"
        style={{ borderColor: topic.color }}>
        <div className="text-7xl mb-4 float-anim">{question.emoji}</div>
        <p className="text-gray-500 font-bold text-sm mb-1">Что это?</p>
        <p className="text-gray-400 text-xs">Выбери правильный ответ!</p>
      </div>

      {feedback && (
        <div className={`animate-bounce-in text-center py-3 px-6 rounded-2xl font-fredoka text-lg ${
          feedback === 'correct' ? 'bg-green-100 text-green-600 border-4 border-green-400' : 'bg-red-100 text-red-500 border-4 border-red-400'
        }`}>
          {feedback === 'correct' ? '🌟 Правильно! Отлично!' : `❌ Неверно! Это "${question.word}"`}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {options.map(opt => {
          let btnStyle = 'bg-white border-4 text-gray-700 hover:scale-105';
          if (selected) {
            if (opt.id === question.id) btnStyle = 'border-4 border-green-400 bg-green-100 text-green-700';
            else if (opt.id === selected) btnStyle = 'border-4 border-red-400 bg-red-100 text-red-600';
            else btnStyle = 'border-4 border-gray-200 bg-gray-50 text-gray-400 opacity-60';
          } else {
            btnStyle = 'border-4 bg-white text-gray-700 hover:scale-105 cursor-pointer';
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              className={`rounded-2xl px-5 py-3 font-bold text-lg transition-all duration-200 flex items-center gap-3 ${btnStyle}`}
              style={!selected ? { borderColor: topic.color } : {}}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="font-fredoka">{opt.word}</span>
              <span className="text-gray-400 text-sm ml-auto">{opt.translation}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={nextQuestion}
        className="btn-fun text-sm"
        style={{ background: topic.color }}
      >
        Следующий вопрос →
      </button>
    </div>
  );
}
