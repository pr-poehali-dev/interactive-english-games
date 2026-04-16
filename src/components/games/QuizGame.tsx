import { useState, useEffect, useCallback } from 'react';
import { Topic, WordItem } from '@/data/topics';
import { useSound } from '@/hooks/useSound';
import MascotHelper, { MascotState } from '@/components/MascotHelper';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

const MAX_LIVES = 3;
const TIME_PER_Q = 15;

export default function QuizGame({ topic, onScore }: Props) {
  const { playCorrect, playWrong } = useSound();
  const [question, setQuestion] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timer, setTimer] = useState(TIME_PER_Q);
  const [gameOver, setGameOver] = useState(false);
  const [mascot, setMascot] = useState<MascotState>('hello');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const nextQuestion = useCallback(() => {
    const shuffled = [...topic.words].sort(() => Math.random() - 0.5);
    const q = shuffled[0];
    const opts = [q, ...shuffled.slice(1, 3)].sort(() => Math.random() - 0.5);
    setQuestion(q);
    setOptions(opts);
    setSelected(null);
    setFeedback(null);
    setTimer(TIME_PER_Q);
    setMascot('thinking');
  }, [topic]);

  useEffect(() => {
    nextQuestion();
    setCorrect(0); setTotal(0); setLives(MAX_LIVES); setGameOver(false); setMascot('hello');
  }, [topic]);

  useEffect(() => {
    if (gameOver || selected) return;
    if (timer <= 0) {
      playWrong();
      setMascot('wrong');
      setLives(l => {
        const next = l - 1;
        if (next <= 0) setGameOver(true);
        return next;
      });
      setTimeout(() => nextQuestion(), 1200);
      return;
    }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, selected, gameOver, nextQuestion, playWrong]);

  const handleAnswer = (wordId: string) => {
    if (selected || gameOver) return;
    setSelected(wordId);
    setTotal(t => t + 1);
    if (wordId === question?.id) {
      setFeedback('correct'); setCorrect(c => c + 1); onScore(15);
      playCorrect(); setMascot('correct');
      setTimeout(() => nextQuestion(), 1400);
    } else {
      setFeedback('wrong'); playWrong(); setMascot('wrong');
      setLives(l => {
        const next = l - 1;
        if (next <= 0) { setTimeout(() => setGameOver(true), 1400); return next; }
        setTimeout(() => nextQuestion(), 1400);
        return next;
      });
    }
  };

  const restart = () => {
    setCorrect(0); setTotal(0); setLives(MAX_LIVES); setGameOver(false); nextQuestion();
  };

  if (gameOver) return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="text-7xl animate-bounce-in">{correct >= total * 0.7 ? '🏆' : correct >= total * 0.4 ? '⭐' : '😅'}</div>
      <h3 className="font-fredoka text-3xl" style={{ color: topic.color }}>Игра окончена!</h3>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="fun-card border-4 p-4 text-center border-green-400">
          <div className="font-fredoka text-4xl text-green-500">{correct}</div>
          <div className="text-xs text-gray-500 font-bold">правильно</div>
        </div>
        <div className="fun-card border-4 p-4 text-center" style={{ borderColor: topic.color }}>
          <div className="font-fredoka text-4xl" style={{ color: topic.color }}>{total}</div>
          <div className="text-xs text-gray-500 font-bold">всего</div>
        </div>
      </div>
      <div className="fun-card border-4 border-yellow-300 p-4 w-full max-w-xs bg-yellow-50 text-center">
        <p className="font-bold text-yellow-700">{correct >= total * 0.7 ? '🌟 Великолепно!' : correct >= total * 0.4 ? '👍 Хороший результат!' : '💪 Тренируйся ещё!'}</p>
        <p className="text-xs text-gray-400 mt-1">Правильных: {total > 0 ? Math.round(correct / total * 100) : 0}%</p>
      </div>
      <button onClick={restart} className="btn-fun text-lg px-8 py-3" style={{ background: topic.color }}>🔄 Играть снова!</button>
    </div>
  );

  if (!question) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <MascotHelper state={mascot} />
      <div className="flex gap-3 w-full justify-center flex-wrap">
        <div className="fun-card border-2 px-4 py-2 flex items-center gap-2" style={{ borderColor: topic.color }}>
          <span>✅</span><span className="font-fredoka text-lg" style={{ color: topic.color }}>{correct}/{total}</span>
        </div>
        <div className="fun-card border-2 px-4 py-2 flex items-center gap-2" style={{ borderColor: timer <= 5 ? '#F44336' : topic.color }}>
          <span>⏱️</span>
          <span className={`font-fredoka text-lg ${timer <= 5 ? 'text-red-500 animate-pulse' : ''}`} style={timer > 5 ? { color: topic.color } : {}}>
            {timer}с
          </span>
        </div>
        <div className="fun-card border-2 border-red-200 px-4 py-2 flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} className="text-lg" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
      </div>
      <div className="progress-bar w-full max-w-sm">
        <div className="progress-fill transition-all duration-1000"
          style={{ width: `${(timer / TIME_PER_Q) * 100}%`, background: timer <= 5 ? 'linear-gradient(90deg,#F44336,#FF9800)' : `linear-gradient(90deg,${topic.color},#E91E8C)` }} />
      </div>
      <div className="fun-card border-4 p-6 text-center w-full max-w-sm" style={{ borderColor: topic.color }}>
        <div className="text-7xl mb-3 float-anim">{question.emoji}</div>
        <p className="text-gray-400 text-sm font-bold">Как это называется по-английски?</p>
      </div>
      {feedback && (
        <div className={`animate-bounce-in text-center py-2 px-5 rounded-2xl font-fredoka text-base ${feedback === 'correct' ? 'bg-green-100 text-green-600 border-4 border-green-400' : 'bg-red-100 text-red-500 border-4 border-red-400'}`}>
          {feedback === 'correct' ? '🌟 Правильно! +15 баллов!' : `❌ Неверно! Это "${question.word}"`}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {options.map(opt => {
          let cls = 'border-4 bg-white text-gray-700 hover:scale-105 cursor-pointer';
          let bc = topic.color;
          if (selected) {
            if (opt.id === question.id) { cls = 'border-4 bg-green-100 text-green-700'; bc = '#4CAF50'; }
            else if (opt.id === selected) { cls = 'border-4 bg-red-100 text-red-600 shake'; bc = '#F44336'; }
            else { cls = 'border-4 bg-gray-50 text-gray-400 opacity-50'; bc = '#ddd'; }
          }
          return (
            <button key={opt.id} onClick={() => handleAnswer(opt.id)}
              className={`rounded-2xl px-5 py-3 font-bold text-lg transition-all duration-200 flex items-center gap-3 ${cls}`}
              style={{ borderColor: bc }}>
              <span className="text-2xl">{opt.emoji}</span>
              <span className="font-fredoka">{opt.word}</span>
              <span className="text-gray-400 text-sm ml-auto">{opt.translation}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
