import { useState, useEffect, useCallback } from 'react';
import { Topic, WordItem } from '@/data/topics';

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function DragDropGame({ topic, onScore }: Props) {
  const [words, setWords] = useState<WordItem[]>([]);
  const [targets, setTargets] = useState<WordItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);

  const init = useCallback(() => {
    const selected = [...topic.words].sort(() => Math.random() - 0.5).slice(0, 5);
    setTargets(selected);
    setWords([...selected].sort(() => Math.random() - 0.5));
    setMatched({});
    setScore(0);
    setComplete(false);
  }, [topic]);

  useEffect(() => { init(); }, [init]);

  const handleDragStart = (wordId: string) => setDragging(wordId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (targetId: string) => {
    if (!dragging) return;
    if (dragging === targetId) {
      const newMatched = { ...matched, [targetId]: true };
      setMatched(newMatched);
      onScore(10);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore === targets.length) setComplete(true);
    } else {
      const el = document.getElementById(`target-${targetId}`);
      el?.classList.add('shake');
      setTimeout(() => el?.classList.remove('shake'), 500);
    }
    setDragging(null);
  };

  const handleTouchMatch = (wordId: string, targetId: string) => {
    if (matched[targetId] || matched[wordId]) return;
    if (wordId === targetId) {
      const newMatched = { ...matched, [targetId]: true };
      setMatched(newMatched);
      onScore(10);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore === targets.length) setComplete(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <p className="font-bold text-gray-500 text-sm">Перетащи слово к нужной картинке!</p>
        <p className="text-xs text-gray-400">Или нажми на слово, потом на картинку</p>
      </div>

      {complete && (
        <div className="animate-bounce-in text-center p-4 rounded-3xl bg-gradient-to-r from-yellow-300 to-orange-300 border-4 border-yellow-400 w-full">
          <div className="text-4xl mb-1">🎊🌟🎊</div>
          <div className="font-fredoka text-xl text-white">Всё правильно!</div>
          <button onClick={init} className="mt-2 btn-fun text-sm bg-white" style={{ color: topic.color }}>Ещё раз!</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {targets.map(target => (
          <div
            key={target.id}
            id={`target-${target.id}`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(target.id)}
            onClick={() => dragging && handleTouchMatch(dragging, target.id)}
            className={`fun-card border-4 p-3 flex items-center gap-3 transition-all ${
              matched[target.id] ? 'opacity-60' : 'hover:scale-105'
            }`}
            style={{ borderColor: matched[target.id] ? '#4CAF50' : topic.color }}
          >
            <span className="text-4xl">{target.emoji}</span>
            <div className={`flex-1 rounded-xl h-10 border-4 border-dashed flex items-center justify-center font-fredoka text-lg ${
              matched[target.id] ? 'border-green-400 bg-green-100 text-green-600' : 'border-gray-300 bg-gray-50 text-gray-400'
            }`}>
              {matched[target.id] ? `✅ ${target.word}` : '???'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {words.filter(w => !matched[w.id]).map(word => (
          <div
            key={word.id}
            draggable
            onDragStart={() => handleDragStart(word.id)}
            onClick={() => setDragging(dragging === word.id ? null : word.id)}
            className={`btn-fun px-4 py-2 text-sm cursor-grab active:cursor-grabbing select-none ${
              dragging === word.id ? 'scale-110 ring-4 ring-yellow-400' : ''
            }`}
            style={{ background: topic.color }}
          >
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
