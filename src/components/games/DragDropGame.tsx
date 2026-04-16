import { useState, useEffect, useCallback } from 'react';
import { Topic, WordItem } from '@/data/topics';
import { useSound } from '@/hooks/useSound';
import MascotHelper, { MascotState } from '@/components/MascotHelper';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function DragDropGame({ topic, onScore }: Props) {
  const { playCorrect, playWrong, playWin } = useSound();
  const [words, setWords] = useState<WordItem[]>([]);
  const [targets, setTargets] = useState<WordItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [wrongTarget, setWrongTarget] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const [mascot, setMascot] = useState<MascotState>('hello');

  const init = useCallback(() => {
    const selected = [...topic.words].sort(() => Math.random() - 0.5).slice(0, 5);
    setTargets(selected);
    setWords([...selected].sort(() => Math.random() - 0.5));
    setMatched({}); setScore(0); setComplete(false); setDragging(null); setMascot('hello');
  }, [topic]);

  useEffect(() => { init(); }, [init]);

  const handleDrop = (targetId: string) => {
    if (!dragging) return;
    if (dragging === targetId) {
      const newMatched = { ...matched, [targetId]: true };
      setMatched(newMatched);
      onScore(10); playCorrect(); setMascot('correct');
      const newScore = score + 1;
      setScore(newScore);
      if (newScore === targets.length) { setComplete(true); playWin(); setMascot('win'); }
    } else {
      playWrong(); setMascot('wrong');
      setWrongTarget(targetId);
      setTimeout(() => { setWrongTarget(null); setMascot('thinking'); }, 600);
    }
    setDragging(null);
  };

  const handleWordClick = (wordId: string) => {
    if (matched[wordId]) return;
    setDragging(prev => prev === wordId ? null : wordId);
    setMascot('thinking');
  };

  const handleTargetClick = (targetId: string) => {
    if (!dragging || matched[targetId]) return;
    handleDrop(targetId);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <MascotHelper state={mascot} />

      <div className="flex gap-3">
        <div className="fun-card p-3 px-4 border-2 text-center" style={{ borderColor: topic.color }}>
          <div className="font-fredoka text-2xl" style={{ color: topic.color }}>{score}/{targets.length}</div>
          <div className="text-xs text-gray-500 font-bold">совпадений</div>
        </div>
      </div>

      <div className="progress-bar w-full max-w-sm">
        <div className="progress-fill" style={{ width: `${(score / (targets.length || 1)) * 100}%` }} />
      </div>

      <p className="text-sm text-gray-500 font-bold text-center">
        {dragging ? '👆 Теперь нажми на нужную картинку!' : 'Нажми на слово, потом на картинку!'}
      </p>

      {complete && (
        <div className="animate-bounce-in text-center p-4 rounded-3xl bg-gradient-to-r from-yellow-300 to-orange-300 border-4 border-yellow-400 w-full">
          <div className="text-4xl mb-1">🎊🌟🎊</div>
          <div className="font-fredoka text-xl text-white">Всё правильно! Молодец!</div>
          <button onClick={init} className="mt-2 btn-fun text-sm bg-white" style={{ color: topic.color }}>Ещё раз!</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
        {targets.map(target => (
          <div key={target.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(target.id)}
            onClick={() => handleTargetClick(target.id)}
            className={`fun-card border-4 p-3 flex items-center gap-3 transition-all cursor-pointer ${
              matched[target.id] ? 'opacity-60' : wrongTarget === target.id ? 'shake' : 'hover:scale-102'
            }`}
            style={{ borderColor: matched[target.id] ? '#4CAF50' : wrongTarget === target.id ? '#F44336' : topic.color }}>
            <span className="text-4xl">{target.emoji}</span>
            <div className={`flex-1 rounded-xl h-10 border-4 border-dashed flex items-center justify-center font-fredoka text-base ${
              matched[target.id] ? 'border-green-400 bg-green-100 text-green-600'
                : dragging === target.id ? `border-yellow-400 bg-yellow-50`
                : 'border-gray-300 bg-gray-50 text-gray-400'
            }`}>
              {matched[target.id] ? `✅ ${target.word}` : '???'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {words.filter(w => !matched[w.id]).map(word => (
          <div key={word.id} draggable
            onDragStart={() => setDragging(word.id)}
            onDragEnd={() => setDragging(null)}
            onClick={() => handleWordClick(word.id)}
            className={`btn-fun px-4 py-2 text-sm cursor-pointer select-none transition-all ${
              dragging === word.id ? 'scale-110 ring-4 ring-yellow-400 ring-offset-2' : ''
            }`}
            style={{ background: topic.color }}>
            {word.word}
          </div>
        ))}
        {words.filter(w => !matched[w.id]).length === 0 && !complete && (
          <p className="text-green-500 font-bold">🎉 Все слова расставлены!</p>
        )}
      </div>
    </div>
  );
}
