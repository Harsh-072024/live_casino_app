const suits = ["\u2660", "\u2665", "\u2666", "\u2663"]; // Spades, Hearts, Diamonds, Clubs
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Function to generate a hand of 3 random, unique cards
export function getThreeRandomCards() {
  let hand = [];
  while (hand.length < 3) {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    const card = { suit, value };
    if (!hand.some(c => c.suit === card.suit && c.value === card.value)) {
      hand.push(card);
    }
  }
  return hand;
}

// Helper function to get card rank index
function getValueIndex(value) {
  return values.indexOf(value);
}

// Function to determine the rank of a hand
function getHandRank(hand) {
  const sortedHand = [...hand].sort((a, b) => getValueIndex(a.value) - getValueIndex(b.value));
  console.log("Sorted Hand:", sortedHand.map(c => `${c.value}${c.suit}`).join(", "));

  const [card1, card2, card3] = sortedHand;
  const isSameSuit = hand.every(card => card.suit === hand[0].suit);
  const isSequence = getValueIndex(card2.value) === getValueIndex(card1.value) + 1 &&
                     getValueIndex(card3.value) === getValueIndex(card2.value) + 1;
  const isTrail = card1.value === card2.value && card2.value === card3.value;
  const isPair = card1.value === card2.value || card2.value === card3.value || card1.value === card3.value;

  console.log(`Checking Hand: ${sortedHand.map(c => `${c.value}${c.suit}`).join(", ")}`);
  console.log(`→ Trail: ${isTrail}, Pure Sequence: ${isSequence && isSameSuit}, Sequence: ${isSequence}, Flush: ${isSameSuit}, Pair: ${isPair}`);

  if (isTrail) return { rank: 6, highCard: getValueIndex(card1.value) };
  if (isSequence && isSameSuit) return { rank: 5, highCard: getValueIndex(card3.value) };
  if (isSequence) return { rank: 4, highCard: getValueIndex(card3.value) };
  if (isSameSuit) return { rank: 3, highCard: getValueIndex(card3.value) };
  if (isPair) return { rank: 2, highCard: getValueIndex(card2.value) };
  
  return { rank: 1, highCard: getValueIndex(card3.value) };
}


// Function to determine the winner based on Teen Patti rules
export function determineTeenPattiWinner(handA, handB) {
  const rankA = getHandRank(handA);
  const rankB = getHandRank(handB);

  console.log("Player A Hand:", handA.map(c => `${c.value}${c.suit}`).join(", "));
  console.log("Player B Hand:", handB.map(c => `${c.value}${c.suit}`).join(", "));
  console.log(`Player A Rank: ${rankA.rank}, High Card: ${values[rankA.highCard]}`);
  console.log(`Player B Rank: ${rankB.rank}, High Card: ${values[rankB.highCard]}`);

  if (rankA.rank > rankB.rank) {
    console.log("✅ Winner: Player A");
    return "Player A";
  }
  if (rankB.rank > rankA.rank) {
    console.log("✅ Winner: Player B");
    return "Player B";
  }
  if (rankA.highCard > rankB.highCard) {
    console.log("✅ Winner: Player A (High Card)");
    return "Player A";
  }
  if (rankB.highCard > rankA.highCard) {
    console.log("✅ Winner: Player B (High Card)");
    return "Player B";
  }

  // Exact match check
  const isExactMatch = handA.every((card, index) => 
    card.suit === handB[index].suit && card.value === handB[index].value
  );

  console.log(isExactMatch ? "🤝 It's a Tie!" : "⚠️ Issue in comparison logic!");
  return isExactMatch ? "Tie" : (rankA.highCard > rankB.highCard ? "Player A" : "Player B");
}
