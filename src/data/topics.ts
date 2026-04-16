export interface WordItem {
  id: string;
  word: string;
  translation: string;
  emoji: string;
  color?: string;
}

export interface Topic {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  words: WordItem[];
}

export const topics: Topic[] = [
  {
    id: 'to-be',
    title: 'Глагол TO BE',
    titleEn: 'Verb TO BE',
    emoji: '✏️',
    color: '#9B59B6',
    bgGradient: 'from-purple-400 to-purple-600',
    borderColor: '#C39BD3',
    words: [
      { id: '1', word: 'I am', translation: 'Я есть', emoji: '🙋' },
      { id: '2', word: 'You are', translation: 'Ты есть', emoji: '👦' },
      { id: '3', word: 'He is', translation: 'Он есть', emoji: '👨' },
      { id: '4', word: 'She is', translation: 'Она есть', emoji: '👩' },
      { id: '5', word: 'It is', translation: 'Это есть', emoji: '🐱' },
      { id: '6', word: 'We are', translation: 'Мы есть', emoji: '👨‍👩‍👧' },
      { id: '7', word: 'They are', translation: 'Они есть', emoji: '👥' },
    ]
  },
  {
    id: 'numbers',
    title: 'Числа',
    titleEn: 'Numbers',
    emoji: '🔢',
    color: '#2196F3',
    bgGradient: 'from-blue-400 to-blue-600',
    borderColor: '#90CAF9',
    words: [
      { id: '1', word: 'one', translation: 'один', emoji: '1️⃣' },
      { id: '2', word: 'two', translation: 'два', emoji: '2️⃣' },
      { id: '3', word: 'three', translation: 'три', emoji: '3️⃣' },
      { id: '4', word: 'four', translation: 'четыре', emoji: '4️⃣' },
      { id: '5', word: 'five', translation: 'пять', emoji: '5️⃣' },
      { id: '6', word: 'six', translation: 'шесть', emoji: '6️⃣' },
      { id: '7', word: 'seven', translation: 'семь', emoji: '7️⃣' },
      { id: '8', word: 'eight', translation: 'восемь', emoji: '8️⃣' },
      { id: '9', word: 'nine', translation: 'девять', emoji: '9️⃣' },
      { id: '10', word: 'ten', translation: 'десять', emoji: '🔟' },
    ]
  },
  {
    id: 'colors',
    title: 'Цвета',
    titleEn: 'Colors',
    emoji: '🎨',
    color: '#E91E8C',
    bgGradient: 'from-pink-400 to-pink-600',
    borderColor: '#F48FB1',
    words: [
      { id: '1', word: 'red', translation: 'красный', emoji: '🔴', color: '#F44336' },
      { id: '2', word: 'blue', translation: 'синий', emoji: '🔵', color: '#2196F3' },
      { id: '3', word: 'green', translation: 'зелёный', emoji: '🟢', color: '#4CAF50' },
      { id: '4', word: 'yellow', translation: 'жёлтый', emoji: '🟡', color: '#FFD700' },
      { id: '5', word: 'orange', translation: 'оранжевый', emoji: '🟠', color: '#FF9800' },
      { id: '6', word: 'purple', translation: 'фиолетовый', emoji: '🟣', color: '#9C27B0' },
      { id: '7', word: 'pink', translation: 'розовый', emoji: '🌸', color: '#E91E63' },
      { id: '8', word: 'white', translation: 'белый', emoji: '⬜', color: '#EEEEEE' },
      { id: '9', word: 'black', translation: 'чёрный', emoji: '⬛', color: '#212121' },
      { id: '10', word: 'brown', translation: 'коричневый', emoji: '🟤', color: '#795548' },
    ]
  },
  {
    id: 'family',
    title: 'Семья',
    titleEn: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    color: '#FF6B35',
    bgGradient: 'from-orange-400 to-orange-600',
    borderColor: '#FFCC80',
    words: [
      { id: '1', word: 'mother', translation: 'мама', emoji: '👩' },
      { id: '2', word: 'father', translation: 'папа', emoji: '👨' },
      { id: '3', word: 'sister', translation: 'сестра', emoji: '👧' },
      { id: '4', word: 'brother', translation: 'брат', emoji: '👦' },
      { id: '5', word: 'grandmother', translation: 'бабушка', emoji: '👵' },
      { id: '6', word: 'grandfather', translation: 'дедушка', emoji: '👴' },
      { id: '7', word: 'baby', translation: 'малыш', emoji: '👶' },
      { id: '8', word: 'family', translation: 'семья', emoji: '👨‍👩‍👧‍👦' },
    ]
  },
  {
    id: 'school',
    title: 'Школьные предметы',
    titleEn: 'School Subjects',
    emoji: '📚',
    color: '#00BCD4',
    bgGradient: 'from-teal-400 to-teal-600',
    borderColor: '#80DEEA',
    words: [
      { id: '1', word: 'maths', translation: 'математика', emoji: '🔢' },
      { id: '2', word: 'English', translation: 'английский', emoji: '🇬🇧' },
      { id: '3', word: 'art', translation: 'рисование', emoji: '🎨' },
      { id: '4', word: 'music', translation: 'музыка', emoji: '🎵' },
      { id: '5', word: 'PE', translation: 'физкультура', emoji: '⚽' },
      { id: '6', word: 'science', translation: 'наука', emoji: '🔬' },
      { id: '7', word: 'history', translation: 'история', emoji: '📜' },
      { id: '8', word: 'reading', translation: 'чтение', emoji: '📖' },
    ]
  },
  {
    id: 'animals',
    title: 'Животные',
    titleEn: 'Animals',
    emoji: '🐾',
    color: '#4CAF50',
    bgGradient: 'from-green-400 to-green-600',
    borderColor: '#A5D6A7',
    words: [
      { id: '1', word: 'cat', translation: 'кошка', emoji: '🐱' },
      { id: '2', word: 'dog', translation: 'собака', emoji: '🐶' },
      { id: '3', word: 'bird', translation: 'птица', emoji: '🐦' },
      { id: '4', word: 'fish', translation: 'рыба', emoji: '🐟' },
      { id: '5', word: 'rabbit', translation: 'кролик', emoji: '🐰' },
      { id: '6', word: 'horse', translation: 'лошадь', emoji: '🐴' },
      { id: '7', word: 'elephant', translation: 'слон', emoji: '🐘' },
      { id: '8', word: 'lion', translation: 'лев', emoji: '🦁' },
      { id: '9', word: 'bear', translation: 'медведь', emoji: '🐻' },
      { id: '10', word: 'monkey', translation: 'обезьяна', emoji: '🐵' },
    ]
  },
  {
    id: 'food',
    title: 'Еда',
    titleEn: 'Food',
    emoji: '🍎',
    color: '#F44336',
    bgGradient: 'from-red-400 to-red-500',
    borderColor: '#EF9A9A',
    words: [
      { id: '1', word: 'apple', translation: 'яблоко', emoji: '🍎' },
      { id: '2', word: 'banana', translation: 'банан', emoji: '🍌' },
      { id: '3', word: 'bread', translation: 'хлеб', emoji: '🍞' },
      { id: '4', word: 'milk', translation: 'молоко', emoji: '🥛' },
      { id: '5', word: 'pizza', translation: 'пицца', emoji: '🍕' },
      { id: '6', word: 'cake', translation: 'торт', emoji: '🎂' },
      { id: '7', word: 'juice', translation: 'сок', emoji: '🧃' },
      { id: '8', word: 'soup', translation: 'суп', emoji: '🍲' },
      { id: '9', word: 'cookie', translation: 'печенье', emoji: '🍪' },
      { id: '10', word: 'ice cream', translation: 'мороженое', emoji: '🍦' },
    ]
  },
  {
    id: 'furniture',
    title: 'Мебель',
    titleEn: 'Furniture',
    emoji: '🛋️',
    color: '#795548',
    bgGradient: 'from-amber-600 to-amber-800',
    borderColor: '#BCAAA4',
    words: [
      { id: '1', word: 'chair', translation: 'стул', emoji: '🪑' },
      { id: '2', word: 'table', translation: 'стол', emoji: '🪞' },
      { id: '3', word: 'bed', translation: 'кровать', emoji: '🛏️' },
      { id: '4', word: 'sofa', translation: 'диван', emoji: '🛋️' },
      { id: '5', word: 'door', translation: 'дверь', emoji: '🚪' },
      { id: '6', word: 'window', translation: 'окно', emoji: '🪟' },
      { id: '7', word: 'lamp', translation: 'лампа', emoji: '💡' },
      { id: '8', word: 'wardrobe', translation: 'шкаф', emoji: '🗄️' },
    ]
  },
  {
    id: 'body',
    title: 'Части тела',
    titleEn: 'Body Parts',
    emoji: '🫀',
    color: '#FF9800',
    bgGradient: 'from-yellow-400 to-orange-500',
    borderColor: '#FFE082',
    words: [
      { id: '1', word: 'head', translation: 'голова', emoji: '🗣️' },
      { id: '2', word: 'eye', translation: 'глаз', emoji: '👁️' },
      { id: '3', word: 'nose', translation: 'нос', emoji: '👃' },
      { id: '4', word: 'mouth', translation: 'рот', emoji: '👄' },
      { id: '5', word: 'ear', translation: 'ухо', emoji: '👂' },
      { id: '6', word: 'hand', translation: 'рука', emoji: '✋' },
      { id: '7', word: 'leg', translation: 'нога', emoji: '🦵' },
      { id: '8', word: 'hair', translation: 'волосы', emoji: '💇' },
      { id: '9', word: 'teeth', translation: 'зубы', emoji: '🦷' },
      { id: '10', word: 'finger', translation: 'палец', emoji: '☝️' },
    ]
  },
  {
    id: 'clothes',
    title: 'Одежда',
    titleEn: 'Clothes',
    emoji: '👕',
    color: '#E91E8C',
    bgGradient: 'from-fuchsia-400 to-fuchsia-600',
    borderColor: '#CE93D8',
    words: [
      { id: '1', word: 'shirt', translation: 'рубашка', emoji: '👔' },
      { id: '2', word: 'trousers', translation: 'брюки', emoji: '👖' },
      { id: '3', word: 'dress', translation: 'платье', emoji: '👗' },
      { id: '4', word: 'shoes', translation: 'туфли', emoji: '👟' },
      { id: '5', word: 'hat', translation: 'шапка', emoji: '🎩' },
      { id: '6', word: 'jacket', translation: 'куртка', emoji: '🧥' },
      { id: '7', word: 'socks', translation: 'носки', emoji: '🧦' },
      { id: '8', word: 'skirt', translation: 'юбка', emoji: '👗' },
    ]
  },
  {
    id: 'weather',
    title: 'Погода',
    titleEn: 'Weather',
    emoji: '⛅',
    color: '#03A9F4',
    bgGradient: 'from-sky-400 to-sky-600',
    borderColor: '#81D4FA',
    words: [
      { id: '1', word: 'sunny', translation: 'солнечно', emoji: '☀️' },
      { id: '2', word: 'cloudy', translation: 'облачно', emoji: '☁️' },
      { id: '3', word: 'rainy', translation: 'дождливо', emoji: '🌧️' },
      { id: '4', word: 'snowy', translation: 'снежно', emoji: '❄️' },
      { id: '5', word: 'windy', translation: 'ветрено', emoji: '💨' },
      { id: '6', word: 'hot', translation: 'жарко', emoji: '🌡️' },
      { id: '7', word: 'cold', translation: 'холодно', emoji: '🥶' },
      { id: '8', word: 'foggy', translation: 'туманно', emoji: '🌫️' },
    ]
  },
  {
    id: 'seasons',
    title: 'Времена года',
    titleEn: 'Seasons',
    emoji: '🌸',
    color: '#8BC34A',
    bgGradient: 'from-lime-400 to-green-500',
    borderColor: '#C5E1A5',
    words: [
      { id: '1', word: 'spring', translation: 'весна', emoji: '🌸' },
      { id: '2', word: 'summer', translation: 'лето', emoji: '☀️' },
      { id: '3', word: 'autumn', translation: 'осень', emoji: '🍂' },
      { id: '4', word: 'winter', translation: 'зима', emoji: '❄️' },
      { id: '5', word: 'January', translation: 'январь', emoji: '❄️' },
      { id: '6', word: 'February', translation: 'февраль', emoji: '💝' },
      { id: '7', word: 'March', translation: 'март', emoji: '🌱' },
      { id: '8', word: 'April', translation: 'апрель', emoji: '🌷' },
      { id: '9', word: 'May', translation: 'май', emoji: '🌺' },
      { id: '10', word: 'June', translation: 'июнь', emoji: '🌻' },
    ]
  },
];
