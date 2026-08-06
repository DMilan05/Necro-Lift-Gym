function getErrorMessage(err) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    return field === 'email' ? 'Ez az email cím már foglalt.' : 'Ez az érték már foglalt.';
  }
  if (err.name === 'ValidationError') {
    return 'Hiányzó vagy hibás adat - ellenőrizd a kitöltött mezőket.';
  }
  return err.message;
}

module.exports = getErrorMessage;