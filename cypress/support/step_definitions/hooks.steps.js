import { Before, After } from '@badeball/cypress-cucumber-preprocessor';
import { bookstoreApi } from '../api/bookstoreClient';
import { resetState, state } from '../api/state';
import { resetUiState } from '../utils/uiState';

Before({ tags: '@api' }, () => {
  resetState();
});

Before({ tags: '@ui' }, () => {
  resetUiState();
});

// Cleanup: remove o usuário criado, mesmo que o cenário tenha falhado.
// Gera um token novo para não depender do que o cenário chegou a fazer.
After({ tags: '@api' }, () => {
  if (!state.userId || !state.credentials) return;

  bookstoreApi.generateToken(state.credentials).then((res) => {
    if (res.status === 200 && res.body.token) {
      bookstoreApi.deleteUser(state.userId, res.body.token);
    }
  });
});
