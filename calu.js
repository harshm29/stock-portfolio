// Sample data representing the trades
const trades = [
  { type: "buy", quantity: 100, price: 900, createdAt: new Date("2015-10-04") },
  {
    type: "sell",
    quantity: 50,
    price: 1000,
    createdAt: new Date("2015-10-05"),
  },
  { type: "buy", quantity: 100, price: 850, createdAt: new Date("2015-10-06") },
];

// Filter buy trades and calculate average buying price
const buyTrades = trades.filter((trade) => trade.type === "buy");
const averageBuyingPrice =
  buyTrades.reduce((sum, trade) => sum + trade.price, 0) / buyTrades.length;

// Calculate cumulative return
const initialPrice = buyTrades[0].price; // Assuming the first buy trade determines the initial price
const finalPrice = 100; // Assume final price to be 100 for simplicity
const cumulativeReturn = ((finalPrice - initialPrice) / initialPrice) * 100;

console.log("Average Buying Price:", averageBuyingPrice.toFixed(2));
console.log("Cumulative Return:", cumulativeReturn.toFixed(2) + "%");
