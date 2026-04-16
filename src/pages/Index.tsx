import { useState, useEffect } from 'react';
import { topics, Topic } from '@/data/topics';
import MemoryGame from '@/components/games/MemoryGame';
import QuizGame from '@/components/games/QuizGame';
import WordBuilder from '@/components/games/WordBuilder';
import DragDropGame from '@/components/games/DragDropGame';
import ListenClick from '@/components/games/ListenClick';
import ToBeGame from '@/components/games/ToBeGame';

type GameType = 'memory' | 'quiz' | 'wordbuilder' | 'dragdrop' | 'listen' | 'tobe';

const gameTypes = [
  { id: 'memory' as GameType, title: 'Карточки', emoji: '🃏', desc: 'Найди пару!', color: '#9B59B6' },
  { id: 'quiz' as GameType, title: 'Викторина', emoji: '❓', desc: 'Выбери ответ!', color: '#2196F3' },
  { id: 'wordbuilder' as GameType, title: 'Собери слово', emoji: '🔤', desc: 'Из букв!', color: '#4CAF50' },
  { id: 'dragdrop' as GameType, title: 'Перетащи', emoji: '✋', desc: 'Слово к картинке!', color: '#FF9800' },
  { id: 'listen' as GameType, title: 'Аудирование', emoji: '🎧', desc: 'Слушай и кликай!', color: '#E91E8C' },
];

const MEDALS = [
  { min: 0, emoji: '🌱', label: 'Начинающий' },
  { min: 50, emoji: '⭐', label: 'Звёздочка' },
  { min: 150, emoji: '🥉', label: 'Бронза' },
  { min: 300, emoji: '🥈', label: 'Серебро' },
  { min: 500, emoji: '🥇', label: 'Золото' },
  { min: 800, emoji: '🏆', label: 'Чемпион!' },
];

export default function Index() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [scorePopup, setScorePopup] = useState(false);
  const [lastPts, setLastPts] = useState(0);
  const [stars, setStars] = useState(0);
  const [view, setView] = useState<'home' | 'topics' | 'games' | 'playing'>('home');

  useEffect(() => {
    const saved = localStorage.getItem('engfun-score');
    if (saved) setTotalScore(Number(saved));
    const savedStars = localStorage.getItem('engfun-stars');
    if (savedStars) setStars(Number(savedStars));
  }, []);

  const addScore = (pts: number) => {
    setLastPts(pts);
    setScorePopup(true);
    const newScore = totalScore + pts;
    const newStars = stars + 1;
    setTotalScore(newScore);
    setStars(newStars);
    localStorage.setItem('engfun-score', String(newScore));
    localStorage.setItem('engfun-stars', String(newStars));
    setTimeout(() => setScorePopup(false), 1500);
  };

  const medal = MEDALS.slice().reverse().find(m => totalScore >= m.min) || MEDALS[0];

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    if (topic.id === 'to-be') {
      setSelectedGame('tobe');
      setView('playing');
    } else {
      setView('games');
    }
  };

  const handleGameSelect = (game: GameType) => {
    setSelectedGame(game);
    setView('playing');
  };

  const goHome = () => {
    setView('home');
    setSelectedTopic(null);
    setSelectedGame(null);
  };

  const goTopics = () => {
    setView('topics');
    setSelectedTopic(null);
    setSelectedGame(null);
  };

  const renderGame = () => {
    if (!selectedGame) return null;
    if (selectedGame === 'tobe') return <ToBeGame onScore={addScore} color="#9B59B6" />;
    if (!selectedTopic) return null;
    switch (selectedGame) {
      case 'memory': return <MemoryGame topic={selectedTopic} onScore={addScore} />;
      case 'quiz': return <QuizGame topic={selectedTopic} onScore={addScore} />;
      case 'wordbuilder': return <WordBuilder topic={selectedTopic} onScore={addScore} />;
      case 'dragdrop': return <DragDropGame topic={selectedTopic} onScore={addScore} />;
      case 'listen': return <ListenClick topic={selectedTopic} onScore={addScore} />;
      default: return null;
    }
  };

  const currentGameInfo = gameTypes.find(g => g.id === selectedGame);

  return (
    <div className="min-h-screen bubble-bg">
      {/* Score popup */}
      {scorePopup && (
        <div className="fixed top-6 right-6 z-50 animate-bounce-in fun-card border-4 border-yellow-400 bg-yellow-50 px-5 py-3 flex items-center gap-2 shadow-2xl">
          <span className="text-3xl">⭐</span>
          <span className="font-fredoka text-2xl text-yellow-600">+{lastPts}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b-4 border-purple-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-3xl">🚀</span>
            <span className="font-fredoka text-xl text-purple-600 hidden sm:block">EnglishFun</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="fun-card border-2 border-yellow-300 px-3 py-1.5 flex items-center gap-2 bg-yellow-50">
              <span className="text-xl">{medal.emoji}</span>
              <div>
                <div className="font-fredoka text-sm text-yellow-700">{totalScore} б.</div>
                <div className="text-xs text-yellow-500 hidden sm:block">{medal.label}</div>
              </div>
            </div>
            <div className="fun-card border-2 border-purple-200 px-3 py-1.5 flex items-center gap-1">
              <span className="text-lg">⭐</span>
              <span className="font-fredoka text-purple-600">{stars}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* HOME */}
        {view === 'home' && (
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-6xl float-anim">🦁</span>
                <span className="text-7xl animate-bounce">🌟</span>
                <span className="text-6xl float-anim-2">🐬</span>
              </div>
              <h1 className="font-fredoka text-5xl md:text-6xl rainbow-text mb-3">
                English Fun!
              </h1>
              <p className="text-xl text-gray-500 font-bold mb-2">Учи английский играя! 🎮</p>
              <p className="text-gray-400 text-sm">12 тем • 6 видов игр • Медали и звёздочки</p>
            </div>

            <button
              onClick={goTopics}
              className="btn-fun text-xl sm:text-2xl px-8 sm:px-10 py-4 sm:py-5 mb-8 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}
            >
              🚀 Начать учиться!
            </button>

            {/* Topics preview grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
              {topics.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => handleTopicSelect(t)}
                  className="fun-card border-4 p-3 text-center hover:scale-110 animate-fade-in-up"
                  style={{ borderColor: t.borderColor, animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  <div className="text-3xl mb-1">{t.emoji}</div>
                  <div className="font-bold text-xs text-gray-600 leading-tight">{t.title}</div>
                </button>
              ))}
            </div>

            {/* Game types */}
            <div className="fun-card border-4 border-purple-200 p-5 mb-6">
              <h2 className="font-fredoka text-2xl text-purple-600 mb-4">Виды игр 🎯</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...gameTypes, { id: 'tobe' as GameType, title: 'Глагол TO BE', emoji: '✏️', desc: 'Тренажёр!', color: '#F44336' }].map(g => (
                  <div key={g.id} className="rounded-2xl p-3 text-center border-2 border-dashed"
                    style={{ borderColor: g.color, background: `${g.color}10` }}>
                    <div className="text-3xl">{g.emoji}</div>
                    <div className="font-bold text-sm mt-1" style={{ color: g.color }}>{g.title}</div>
                    <div className="text-xs text-gray-400">{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medals */}
            <div className="fun-card border-4 border-yellow-300 p-5">
              <h2 className="font-fredoka text-2xl text-yellow-600 mb-4">Медали и награды 🏅</h2>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {MEDALS.map(m => (
                  <div key={m.label} className={`text-center p-3 rounded-2xl border-2 transition-all ${
                    totalScore >= m.min ? 'border-yellow-400 bg-yellow-50 scale-105' : 'border-gray-200 bg-gray-50 opacity-40'
                  }`}>
                    <div className="text-3xl">{m.emoji}</div>
                    <div className="text-xs font-bold text-gray-600 mt-1">{m.label}</div>
                    <div className="text-xs text-gray-400">{m.min}+ б.</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TOPICS */}
        {view === 'topics' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={goHome} className="btn-fun text-sm bg-gray-400">← Назад</button>
              <div>
                <h2 className="font-fredoka text-3xl text-purple-600">Выбери тему!</h2>
                <p className="text-xs text-gray-400">12 тем для изучения</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {topics.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => handleTopicSelect(t)}
                  className="fun-card border-4 p-4 text-left hover:scale-105 animate-fade-in-up"
                  style={{
                    borderColor: t.borderColor,
                    animationDelay: `${i * 0.06}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className={`w-full h-24 rounded-2xl mb-3 flex items-center justify-center bg-gradient-to-br ${t.bgGradient}`}>
                    <span className="text-5xl">{t.emoji}</span>
                  </div>
                  <div className="font-fredoka text-base text-gray-700">{t.title}</div>
                  <div className="text-xs text-gray-400 font-bold">{t.titleEn}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-300">{t.words.length} слов</span>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
                      style={{ background: t.color }}>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAMES */}
        {view === 'games' && selectedTopic && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={goTopics} className="btn-fun text-sm bg-gray-400">← Темы</button>
              <div>
                <h2 className="font-fredoka text-2xl" style={{ color: selectedTopic.color }}>
                  {selectedTopic.emoji} {selectedTopic.title}
                </h2>
                <p className="text-xs text-gray-400">Выбери вид игры!</p>
              </div>
            </div>

            {/* Word preview */}
            <div className="fun-card border-4 p-4 mb-5" style={{ borderColor: selectedTopic.borderColor }}>
              <p className="font-bold text-gray-500 text-sm mb-3">📖 Слова в этой теме:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.words.map(w => (
                  <span key={w.id} className="px-3 py-1 rounded-full text-white text-sm font-bold"
                    style={{ background: selectedTopic.color }}>
                    {w.emoji} {w.word} — {w.translation}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gameTypes.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => handleGameSelect(g.id)}
                  className="fun-card border-4 p-5 text-center hover:scale-105 animate-fade-in-up"
                  style={{
                    borderColor: g.color,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="text-5xl mb-3">{g.emoji}</div>
                  <div className="font-fredoka text-base" style={{ color: g.color }}>{g.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PLAYING */}
        {view === 'playing' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => selectedTopic && selectedGame !== 'tobe' ? setView('games') : goTopics()}
                className="btn-fun text-sm bg-gray-400"
              >
                ← Назад
              </button>
              <div>
                <h2 className="font-fredoka text-xl sm:text-2xl" style={{ color: selectedTopic?.color || '#9B59B6' }}>
                  {selectedGame === 'tobe' ? '✏️ Глагол TO BE' : `${selectedTopic?.emoji} ${selectedTopic?.title}`}
                </h2>
                <p className="text-xs text-gray-400 font-bold">
                  {currentGameInfo?.emoji} {currentGameInfo?.title} — {currentGameInfo?.desc}
                </p>
              </div>
            </div>

            <div className="fun-card border-4 p-5 sm:p-6 animate-fade-in"
              style={{ borderColor: selectedTopic?.color || '#9B59B6' }}>
              {renderGame()}
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-xs">⭐ Правильные ответы = баллы и звёздочки!</p>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm font-bold">
        <span>🚀 EnglishFun — Учи английский, играя!</span>
      </footer>
    </div>
  );
}
