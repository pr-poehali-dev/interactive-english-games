import { useState, useEffect, useCallback } from 'react';
import { Topic, WordItem } from '@/data/topics';

interface MemoryCard {
  id: string;
  type: 'word' | 'emoji';
  wordId: string;
  content: string;
  matched: boolean;
  flipped: boolean;
}

interface Props {
  topic: Topic;
  onScore: (pts: number) => void;
}

export default function MemoryGame({ topic, onScore }: Props) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const initCards = useCallback(() => {
    const words = topic.words.slice(0, 6);
    const newCards: MemoryCard[] = [];
    words.forEach(w => {
      newCards.push({ id: `w-${w.id}`, type: 'word', wordId: w.id, content: w.word, matched: false, flipped: false });
      newCards.push({ id: `e-${w.id}`, type: 'emoji', wordId: w.id, content: w.emoji, matched: false, flipped: false });
    });
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelected([]);
    setMatchedCount(0);
    setAttempts(0);
    setCelebrate(false);
  }, [topic]);

  useEffect(() => { initCards(); }, [initCards]);

  const handleCardClick = (cardId: string) => {
    if (selected.length === 2) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.matched || card.flipped) return;

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
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
          ));
          const newCount = matchedCount + 1;
          setMatchedCount(newCount);
          onScore(10);
          setSelected([]);
          if (newCount === Math.min(6, topic.words.length)) {
            setCelebrate(true);
          }
        }, 500);
      } else {
        setShake(secondId);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setShake(null);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4 text-center">
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: topic.color }}>
          <div className="text-2xl font-fredoka" style={{ color: topic.color }}>{attempts}</div>
          <div className="text-xs text-gray-500 font-bold">попыток</div>
        </div>
        <div className="fun-card p-3 px-5 border-2" style={{ borderColor: topic.color }}>
          <div className="text-2xl font-fredoka" style={{ color: topic.color }}>{matchedCount}</div>
          <div className="text-xs text-gray-500 font-bold">пар найдено</div>
        </div>
      </div>

      {celebrate && (
        <div className="animate-bounce-in text-center p-4 rounded-3xl bg-gradient-to-r from-yellow-300 to-orange-300 border-4 border-yellow-400 w-full">
          <div className="text-4xl mb-1">🎉🌟🎉</div>
          <div className="font-fredoka text-xl text-white">Отлично! Все пары найдены!</div>
          <button
            onClick={initCards}
            className="mt-2 btn-fun text-sm"
            style={{ background: topic.color }}
          >
            Сыграть ещё раз!
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`card-flip cursor-pointer ${shake === card.id ? 'shake' : ''}`}
            style={{ height: '80px' }}
          >
            <div className={`card-flip-inner ${card.flipped || card.matched ? 'flipped' : ''}`}>
              <div className="card-front flex items-center justify-center rounded-2xl border-4 border-dashed"
                style={{ borderColor: topic.color, background: `${topic.color}20`, height: '80px' }}>
                <span className="text-3xl">❓</span>
              </div>
              <div className={`card-back flex items-center justify-center rounded-2xl border-4 text-center px-1 ${card.matched ? 'opacity-50' : ''}`}
                style={{
                  borderColor: topic.color,
                  background: card.type === 'emoji' ? `${topic.color}30` : `${topic.color}15`,
                  height: '80px'
                }}>
                {card.type === 'emoji'
                  ? <span className="text-3xl">{card.content}</span>
                  : <span className="text-xs font-bold leading-tight" style={{ color: topic.color }}>{card.content}</span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 font-bold">Найди пары: слово и картинка!</p>
    </div>
  );
}
