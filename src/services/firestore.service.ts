interface FirestoreFailure {
  code: string;
  message: string;
}

export const describeFirestoreFailure = (error: unknown): FirestoreFailure => {
  const candidate = error as { code?: unknown; message?: unknown };
  return {
    code: typeof candidate?.code === 'string' ? candidate.code : 'unknown',
    message:
      typeof candidate?.message === 'string'
        ? candidate.message
        : error instanceof Error
          ? error.message
          : String(error),
  };
};

export const logFirestoreFailure = (
  scope: string,
  operation: string,
  path: string,
  payload: unknown,
  error: unknown,
): void => {
  const failure = describeFirestoreFailure(error);
  console.error(`[${scope}] ${operation} failed (${failure.code})`, {
    path,
    payload,
    code: failure.code,
    message: failure.message,
    error,
  });
};

export const describeFirestoreError = (error: unknown): string => {
  const { code, message } = describeFirestoreFailure(error);
  if (code === 'permission-denied') {
    return 'Permesso negato da Firestore. Verifica che le regole siano pubblicate (firebase deploy --only firestore:rules) e che il tuo UID sia in admins/{uid}. Dettagli nella console del browser.';
  }
  if (code === 'unavailable') {
    return 'Firestore non raggiungibile. Controlla la connessione e riprova.';
  }
  if (code === 'failed-precondition') {
    return 'Operazione rifiutata: controlla gli indici Firestore richiesti.';
  }
  return message;
};
