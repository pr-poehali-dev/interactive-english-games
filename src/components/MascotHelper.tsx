import { useEffect, useState } from 'react';

type MascotState = 'idle' | 'correct' | 'wrong' | 'thinking' | 'win' | 'hello';

interface Props {
  state: MascotState;
}

const mascotData: Record<MascotState, { emoji: string; text: string; bg: string }> = {
  idle:     { emoji: '🦉', text: 'Выбери ответ!',         bg: 'from-purple-400 to-purple-500' },
  correct:  { emoji: '🌟', text: 'Отлично! Так держать!', bg: 'from-green-400 to-green-500' },
  wrong:    { emoji: '😅', text: 'Не беда! Попробуй ещё!', bg: 'from-orange-400 to-red-400' },
  thinking: { emoji: '🤔', text: 'Думай-думай...',         bg: 'from-blue-400 to-blue-500' },
  win:      { emoji: '🏆', text: 'Ты чемпион! Ура!',      bg: 'from-yellow-400 to-orange-400' },
  hello:    { emoji: '👋', text: 'Привет! Начнём?',        bg: 'from-pink-400 to-purple-500' },
};

export default function MascotHelper({ state }: Props) {
  const [visible, setVisible] = useState(true);
  const [prevState, setPrevState] = useState(state);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (state !== prevState) {
      setPrevState(state);
      setAnimKey(k => k + 1);
      setVisible(true);
    }
  }, [state, prevState]);

  const data = mascotData[state];

  return (
    <div
      key={animKey}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${data.bg} shadow-lg animate-bounce-in`}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      <span
        className="text-4xl"
        style={{ animation: state === 'correct' || state === 'win' ? 'starBounce 0.5s ease-in-out' : 'floatUp 2s ease-in-out infinite' }}
      >
        {data.emoji}
      </span>
      <div>
        <p className="text-white font-bold text-sm leading-tight">{data.text}</p>
        {state === 'correct' && <p className="text-white/80 text-xs">+баллы!</p>}
        {state === 'win' && <p className="text-white/80 text-xs">Все задания выполнены! 🎉</p>}
      </div>
    </div>
  );
}

export type { MascotState };
