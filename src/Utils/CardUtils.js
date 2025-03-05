export const suits = ["♥", "♠", "♣", "♦"];
export const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const getRandomCard = () => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return { suit, value };
};

export const getTwoRandomCards = () => [getRandomCard(), getRandomCard()];

export const determineWinner = (card1, card2) => {
  const rank = { "A": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13 };
  const suitRank = { "♥": 4, "♠": 3, "♣": 2, "♦": 1 };

  if (rank[card1.value] > rank[card2.value]) return "A";
  if (rank[card2.value] > rank[card1.value]) return "B";
  if (card1.suit === card2.suit) return "Tie";

  return suitRank[card1.suit] > suitRank[card2.suit] ? "A" : "B";
};
