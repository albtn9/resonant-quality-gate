// Estado compartilhado entre os steps de UM cenário (userId, token, livros...).
// É zerado antes de cada cenário @api, garantindo isolamento.
export const state = {};

export function resetState() {
  Object.keys(state).forEach((key) => delete state[key]);
}
