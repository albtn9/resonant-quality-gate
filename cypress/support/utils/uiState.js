// Estado compartilhado entre os steps de UM cenário de UI (aluno gerado, arquivo enviado...).
// É zerado antes de cada cenário @ui.
export const uiState = {};

export function resetUiState() {
  Object.keys(uiState).forEach((key) => delete uiState[key]);
}
