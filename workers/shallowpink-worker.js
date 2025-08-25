self.onmessage = async ({ data: { fenStr, states, book, table } }) => {
  console.log(fenStr);
  try {
    const shallowpinkModule = await import("shallowpink");
    const Shallowpink = shallowpinkModule.default || shallowpinkModule;
    const chess = new Shallowpink(fenStr, states, book, table);
    let move = chess.suggestMove(3);
    self.postMessage({ move: move, table: chess.table });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
