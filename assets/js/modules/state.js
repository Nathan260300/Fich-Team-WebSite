const _state = {
  currentPage:    null,
  activeModal:    null,
  rawBadParam:    '',

  loaded: {
    home:     false,
    channels: false,
    projects: false,
    members:  false,
  },

  homeCards:    [],
  photoFolders: {},
};

export function getState(key) {
  return key ? _state[key] : { ..._state };
}

export function setState(key, value) {
  if (!(key in _state)) {
    console.warn(`[state] clé inconnue : "${key}"`);
    return;
  }
  _state[key] = value;
}

export function setLoaded(key, value = true) {
  if (!(key in _state.loaded)) {
    console.warn(`[state] loaded.${key} n'existe pas`);
    return;
  }
  _state.loaded[key] = value;
}

export function isLoaded(key) {
  return _state.loaded[key] === true;
}

export function resetPageLoaded() {
  for (const k of Object.keys(_state.loaded)) {
    _state.loaded[k] = false;
  }
}