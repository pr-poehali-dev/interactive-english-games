import { useState, useEffect, useCallback } from 'react';
import { Topic, WordItem } from '@/data/topics';
import { useSound } from '@/hooks/useSound';
import MascotHelper, { MascotState } from '@/components/MascotHelper';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function WordBuilder({ topic, onScore }: Props) {
  const { playCorrect, playWrong, playClick } = useSound();
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [letters, setLetters] = useState<{ id: string; char: string; used: boolean }[]>([]);
  const [answer, setAnswer] = useState<{ id: string; char: string }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [solved, setSolved] = useState(0);
  const [mascot, setMascot] = useState<MascotState>('hello');

  const nextWord = useCallback(() => {
    const idx = Math.floor(Math.random() * topic.words.length);
    const word = topic.words[idx];
    setCurrentWord(word);
    const chars = word.word.replace(/\s/g, '').split('');
    const shuffled = [...chars].sort(() => Math.random() - 0.5)
      .map((char, i) => ({ id: `l-${i}-${Date.now()}`, char, used: false }));
    setLetters(shuffled);
    setAnswer([]);
    setFeedback(null);
    setMascot('thinking');
  }, [topic]);

  useEffect(() => { nextWord(); setSolved(0); setMascot('hello'); }, [topic]);

  const addLetter = (letterId: string) => {
    if (feedback) return;
    const letter = letters.find(l => l.id === letterId);
    if (!letter || letter.used) return;
    playClick();
    setLetters(prev => prev.map(l => l.id === letterId ? { ...l, used: true } : l));
    setAnswer(prev => [...prev, { id: letterId, char: letter.char }]);
  };

  const removeLetter = (letterId: string) => {
    if (feedback) return;
    playClick();
    setAnswer(prev => prev.filter(a => a.id !== letterId));
    setLetters(prev => prev.map(l => l.id === letterId ? { ...l, used: false } : l));
  };

  const checkAnswer = () => {
    if (!currentWord || answer.length === 0) return;
    const answerWord = answer.map(a => a.char).join('');
    const target = currentWord.word.replace(/\s/g, '');
    if (answerWord.toLowerCase() === target.toLowerCase()) {
      setFeedback('correct');
      setSolved(s => s + 1);
      onScore(20);
      playCorrect();
      setMascot('correct');
      setTimeout(() => nextWord(), 1500);
    } else {
      setFeedback('wrong');
      playWrong();
      setMascot('wrong');
      setTimeout(() => { setFeedback(null); setMascot('thinking'); }, 1000);
    }
  };

  const clearAnswer = () => {
    setAnswer([]);
    setLetters(prev => prev.map(l => ({ ...l, used: false })));
    setFeedback(null);
    playClick();
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <MascotHelper state={mascot} />

      <div className="flex gap-3">
        <div className="fun-card p-3 px-4 border-2 text-center" style={{ borderColor: topic.color }}>
          <div className="font-fredoka text-2xl" style={{ color: topic.color }}>{solved}</div>
          <div className="text-xs text-gray-500 font-bold">слов собрано</div>
        </div>
        <div className="fun-card p-3 px-4 border-2 text-center border-yellow-300 bg-yellow-50">
          <div className="font-fredoka text-2xl text-yellow-600">{solved * 20}</div>
          <div className="text-xs text-gray-500 font-bold">баллов</div>
        </div>
      </div>

      <div className="fun-card border-4 p-6 text-center w-full max-w-sm" style={{ borderColor: topic.color }}>
        <div className="text-6xl mb-2 float-anim">{currentWord.emoji}</div>
        <p className="text-gray-500 font-bold text-base">{currentWord.translation}</p>
        <p className="text-xs text-gray-300 mt-1">Собери английское слово из букв!</p>
        <p className="text-xs text-gray-400 mt-1">Букв в слове: <strong>{currentWord.word.replace(/\s/g, '').length}</strong></p>
      </div>

      {/* Answer zone */}
      <div className={`fun-card border-4 p-4 w-full max-w-sm min-h-14 flex flex-wrap gap-2 justify-center items-center transition-all ${
        feedback === 'correct' ? 'border-green-400 bg-green-50' : feedback === 'wrong' ? 'border-red-400 bg-red-50 shake' : ''
      }`} style={{ borderColor: feedback ? undefined : topic.color }}>
        {answer.length === 0
          ? <span className="text-gray-300 text-sm font-bold">Нажимай на буквы ниже...</span>
          : answer.map(a => (
            <button key={a.id} onClick={() => removeLetter(a.id)}
              className="w-10 h-10 rounded-xl font-fredoka text-lg text-white transition-all hover:scale-110 active:scale-95"
              style={{ background: topic.color }}>
              {a.char}
            </button>
          ))
        }
      </div>

      {feedback && (
        <div className={`animate-bounce-in text-center py-2 px-5 rounded-2xl font-fredoka text-base ${
          feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
        }`}>
          {feedback === 'correct' ? '🌟 Молодец! +20 баллов!' : `❌ Не то! Правильно: "${currentWord.word}"`}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {letters.map(l => (
          <button key={l.id} onClick={() => addLetter(l.id)} disabled={l.used}
            className={`w-11 h-11 rounded-xl font-fredoka text-lg transition-all duration-200 border-4 ${
              l.used ? 'opacity-20 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
                : 'text-white hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            style={!l.used ? { background: topic.color, borderColor: topic.color } : {}}>
            {l.char}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={clearAnswer} className="btn-fun bg-gray-400 text-sm">🔄 Очистить</button>
        <button onClick={checkAnswer} disabled={answer.length === 0}
          className="btn-fun text-sm disabled:opacity-40" style={{ background: topic.color }}>
          ✅ Проверить
        </button>
        <button onClick={nextWord} className="btn-fun text-sm bg-blue-400">⏭ Другое слово</button>
      </div>
    </div>
  );
}
