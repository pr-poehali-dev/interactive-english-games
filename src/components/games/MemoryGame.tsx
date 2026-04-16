import { useState, useEffect, useCallback } from 'react';
import { Topic } from '@/data/topics';
import { useSound } from '@/hooks/useSound';
import MascotHelper, { MascotState } from '@/components/MascotHelper';

interface MemoryCard {
  id: string; type: 'word' | 'emoji'; wordId: string; content: string; matched: boolean; flipped: boolean;
}

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function MemoryGame({ topic, onScore }: Props) {
  const { playCorrect, playWrong, playWin, playFlip } = useSound();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [mascot, setMascot] = useState<MascotState>('hello');

  const initCards = useCallback(() => {
    const words = topic.words.slice(0, 6);
    const newCards: MemoryCard[] = [];
    words.forEach(w => {
      newCards.push({ id: `w-${w.id}`, type: 'word', wordId: w.id, content: w.word, matched: false, flipped: false });
      newCards.push({ id: `e-${w.id}`, type: 'emoji', wordId: w.id, content: w.emoji, matched: false, flipped: false });
    });
    setCards(newCards.sort(() => Math.random() - 0.5));
    setSelected([]); setMatchedCount(0); setAttempts(0); setCelebrate(false); setMascot('hello');
  }, [topic]);

  useEffect(() => { initCards(); }, [initCards]);

  const handleCardClick = (cardId: string) => {
    if (selected.length === 2) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.matched || card.flipped) return;
    playFlip();
    const newSelected = [...selected, cardId];
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setAttempts(a => a + 1);
      const [firstId, secondId] = newSelected;
      const first = cards.find(c => c.id === firstId)!;
      const second = cards.find(c => c.id === secondId)!;

      if (first.wordId === second.wordId) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, matched: true } : c));
          const newCount = matchedCount + 1;
          setMatchedCount(newCount);
          onScore(10); playCorrect(); setMascot('correct');
          setSelected([]);
          if (newCount === Math.min(6, topic.words.length)) {
            setCelebrate(true); playWin(); setMascot('win');
          }
        }, 400);
      } else {
        setShake(secondId); playWrong(); setMascot('wrong');
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c));
          setSelected([]); setShake(null); setMascot('thinking');
        }, 900);
      }
    } else {
      setMascot('thinking');
    }
  };

  const totalPairs = Math.min(6, topic.words.length);

  return (
    <div className="flex flex-col items-center gap-4">
      <MascotHelper state={mascot} />

      <div className="flex gap-3">
        <div className="fun-card p-3 px-4 border-2 text-center" style={{ borderColor: topic.color }}>
          <div className="font-fredoka text-2xl" style={{ color: topic.color }}>{attempts}</div>
          <div className="text-xs text-gray-500 font-bold">попыток</div>
        </div>
        <div className="fun-card p-3 px-4 border-2 text-center" style={{ borderColor: '#4CAF50' }}>
          <div className="font-fredoka text-2xl text-green-500">{matchedCount}/{totalPairs}</div>
          <div className="text-xs text-gray-500 font-bold">пар найдено</div>
        </div>
      </div>

      <div className="progress-bar w-full max-w-sm">
        <div className="progress-fill" style={{ width: `${(matchedCount / totalPairs) * 100}%` }} />
      </div>

      {celebrate && (
        <div className="animate-bounce-in text-center p-4 rounded-3xl bg-gradient-to-r from-yellow-300 to-orange-300 border-4 border-yellow-400 w-full">
          <div className="text-4xl mb-1">🎉🌟🎉</div>
          <div className="font-fredoka text-xl text-white">Отлично! Все пары найдены!</div>
          <div className="text-white/80 text-sm mt-1">Попыток: {attempts} • Пар: {matchedCount}</div>
          <button onClick={initCards} className="mt-3 btn-fun text-sm bg-white" style={{ color: topic.color }}>
            Сыграть ещё раз!
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
        {cards.map(card => (
          <div key={card.id} onClick={() => handleCardClick(card.id)}
            className={`card-flip cursor-pointer ${shake === card.id ? 'shake' : ''}`} style={{ height: '76px' }}>
            <div className={`card-flip-inner ${card.flipped || card.matched ? 'flipped' : ''}`}>
              <div className="card-front flex items-center justify-center rounded-2xl border-4 border-dashed"
                style={{ borderColor: topic.color, background: `${topic.color}20`, height: '76px' }}>
                <span className="text-2xl">❓</span>
              </div>
              <div className={`card-back flex items-center justify-center rounded-2xl border-4 text-center px-1 ${card.matched ? 'opacity-40' : ''}`}
                style={{ borderColor: topic.color, background: card.type === 'emoji' ? `${topic.color}30` : `${topic.color}15`, height: '76px' }}>
                {card.type === 'emoji'
                  ? <span className="text-3xl">{card.content}</span>
                  : <span className="text-xs font-bold leading-tight" style={{ color: topic.color }}>{card.content}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 font-bold">Найди пары: слово и картинка!</p>
    </div>
  );
}
