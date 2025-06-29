export const sendResponse = (res, code, ok, message, data = null) => {
  if (code === 204) {
    if (ok || message || data) {
      const err = new Error('Cannot send body content with 204 no content response');
      console.warn(err);
      throw err;
    }
    return res.status(204).send();
  }
  const payload = {ok, message, data};
  return res.status(code).json(payload);
};
