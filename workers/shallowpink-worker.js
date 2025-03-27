self.onmessage = async ({ data: { fenStr } }) => {
  console.log(fenStr);
  try {
    const shallowpinkModule = await import("shallowpink");
    const Shallowpink = shallowpinkModule.default || shallowpinkModule;
    self.postMessage({ move: new Shallowpink(fenStr).suggestMove(3) });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
