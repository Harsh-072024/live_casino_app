// ✅ Helper function to get the index of card values
function getValueIndex(value) {
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]; // A is now highest
  return values.indexOf(value);
}


// ✅ Function to get three unique random cards
export function getThreeRandomCards() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  let hand = new Set();

  while (hand.size < 3) {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    hand.add(`${value}${suit}`);
  }

  return [...hand].map(card => ({ value: card.slice(0, -1), suit: card.slice(-1) }));
}

// ✅ Function to determine the rank of a hand
export function getHandRank(hand) {
  const sortedHand = [...hand].sort((a, b) => getValueIndex(a.value) - getValueIndex(b.value));
  // console.log("🃏 Sorted Hand:", sortedHand.map(c => `${c.value}${c.suit}`).join(", "));

  const [card1, card2, card3] = sortedHand;
  const isSameSuit = hand.every(card => card.suit === hand[0].suit);
  const isSequence = getValueIndex(card2.value) === getValueIndex(card1.value) + 1 &&
                     getValueIndex(card3.value) === getValueIndex(card2.value) + 1;
  const isTrail = card1.value === card2.value && card2.value === card3.value;
  const isPair = card1.value === card2.value || card2.value === card3.value || card1.value === card3.value;

  // console.log(`🔍 Checking Hand: ${sortedHand.map(c => `${c.value}${c.suit}`).join(", ")}`);
  // console.log(`→ Trail: ${isTrail}, Pure Sequence: ${isSequence && isSameSuit}, Sequence: ${isSequence}, Flush: ${isSameSuit}, Pair: ${isPair}`);

  if (isTrail) return { rank: 6, highCard: getValueIndex(card1.value) };
  if (isSequence && isSameSuit) return { rank: 5, highCard: getValueIndex(card3.value) };
  if (isSequence) return { rank: 4, highCard: getValueIndex(card3.value) };
  if (isSameSuit) return { rank: 3, highCard: getValueIndex(card3.value) };
  if (isPair) {
    const pairValue = card1.value === card2.value ? card1.value : card3.value;
    return { rank: 2, highCard: getValueIndex(pairValue) };
  }

  const highCard = Math.max(...sortedHand.map(c => getValueIndex(c.value)));
  return { rank: 1, highCard };
}

// ✅ Function to determine the winner based on Teen Patti rules
export function determineTeenPattiWinner(handA, handB) {
  const rankA = getHandRank(handA);
  const rankB = getHandRank(handB);

  // console.log(`🏆 Player A Rank: ${rankA.rank}, High Card: ${rankA.highCard}`);
  // console.log(`🏆 Player B Rank: ${rankB.rank}, High Card: ${rankB.highCard}`);

  if (rankA.rank > rankB.rank) return "A";
  if (rankB.rank > rankA.rank) return "B";

  // console.log("⚠️ High Card Tie-Breaker in progress...");

  // ✅ Fix sorting for tie-breaker
  const sortedA = [...handA].sort((a, b) => getValueIndex(a.value) - getValueIndex(b.value));
  const sortedB = [...handB].sort((a, b) => getValueIndex(a.value) - getValueIndex(b.value));

  // console.log(`🔹 Tie-Breaker Comparison:
  //     - A: ${sortedA.map(c => `${c.value}${c.suit}`).join(", ")}
  //     - B: ${sortedB.map(c => `${c.value}${c.suit}`).join(", ")}`);

  for (let i = 2; i >= 0; i--) {
    // console.log(`⚖️ Comparing Card ${i + 1}: ${sortedA[i].value} vs ${sortedB[i].value}`);
    if (getValueIndex(sortedA[i].value) > getValueIndex(sortedB[i].value)) return "A";
    if (getValueIndex(sortedA[i].value) < getValueIndex(sortedB[i].value)) return "B";
  }

  // console.log("🟡 It's a tie! No winner.");
  return "Tie";
}

