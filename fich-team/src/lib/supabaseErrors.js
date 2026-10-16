export const ERROR_CODES = Object.freeze({
  SUPABASE_UNAVAILABLE: 'SUPABASE_UNAVAILABLE',
  NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  SUPABASE_AUTH_ERROR: 'SUPABASE_AUTH_ERROR',
  SUPABASE_PERMISSION_DENIED: 'SUPABASE_PERMISSION_DENIED',
  SUPABASE_CONFIGURATION_ERROR: 'SUPABASE_CONFIGURATION_ERROR',
  SUPABASE_QUERY_ERROR: 'SUPABASE_QUERY_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

const GLOBAL_CODES = new Set([
  ERROR_CODES.SUPABASE_UNAVAILABLE,
  ERROR_CODES.NETWORK_UNAVAILABLE,
  ERROR_CODES.REQUEST_TIMEOUT,
  ERROR_CODES.SUPABASE_CONFIGURATION_ERROR,
]);

const DISPLAY_STATUS = {
  [ERROR_CODES.SUPABASE_UNAVAILABLE]: 503,
  [ERROR_CODES.NETWORK_UNAVAILABLE]: null,
  [ERROR_CODES.REQUEST_TIMEOUT]: 503,
  [ERROR_CODES.SUPABASE_AUTH_ERROR]: 401,
  [ERROR_CODES.SUPABASE_PERMISSION_DENIED]: 403,
  [ERROR_CODES.SUPABASE_CONFIGURATION_ERROR]: 500,
  [ERROR_CODES.SUPABASE_QUERY_ERROR]: 500,
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 404,
  [ERROR_CODES.INTERNAL_ERROR]: 500,
};

const NETWORK_MESSAGE_RE = /failed to fetch|networkerror|network request failed|load failed|fetch failed|err_internet|err_network|err_connection|err_name_not_resolved/i;
const TIMEOUT_MESSAGE_RE = /timeout|timed out|aborterror/i;
const API_KEY_RE = /invalid api key|no api key|apikey/i;
const MISSING_OBJECT_CODES = new Set(['PGRST202', 'PGRST200', 'PGRST204', 'PGRST205', '42883', '42P01', '42703']);
const SERVER_UNAVAILABLE_CODES = new Set(['PGRST000', 'PGRST001', 'PGRST002', '08000', '08003', '08006', '57P01', '57P03', '53300']);
const AUTH_CODES = new Set(['PGRST301', 'PGRST302', 'PGRST303', 'bad_jwt', 'no_authorization', 'session_not_found', 'session_expired', 'refresh_token_not_found', 'refresh_token_already_used', 'invalid_jwt']);

function readHttpStatus(error, status) {
  const value = Number(status ?? error?.status ?? 0);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function build(code, httpStatus, error) {
  return {
    code,
    httpStatus,
    displayStatus: DISPLAY_STATUS[code] ?? null,
    global: GLOBAL_CODES.has(code),
    retryable: GLOBAL_CODES.has(code) && code !== ERROR_CODES.SUPABASE_CONFIGURATION_ERROR,
    upstreamCode: typeof error?.code === 'string' && error.code ? error.code : null,
  };
}

export function classifySupabaseError(error, status) {
  if (!error) return null;

  const httpStatus = readHttpStatus(error, status);
  const message = String(error.message ?? '');
  const name = String(error.name ?? '');
  const pgCode = typeof error.code === 'string' ? error.code : '';

  if (pgCode === '42501' || pgCode === 'insufficient_privilege') {
    return build(ERROR_CODES.SUPABASE_PERMISSION_DENIED, httpStatus, error);
  }

  if (name === 'TimeoutError' || pgCode === '57014' || httpStatus === 504 || (!httpStatus && TIMEOUT_MESSAGE_RE.test(`${name} ${message}`))) {
    return build(ERROR_CODES.REQUEST_TIMEOUT, httpStatus, error);
  }

  if (!httpStatus && (name === 'AuthRetryableFetchError' || NETWORK_MESSAGE_RE.test(message) || (name === 'TypeError' && /fetch/i.test(message)))) {
    return build(ERROR_CODES.NETWORK_UNAVAILABLE, null, error);
  }

  if (SERVER_UNAVAILABLE_CODES.has(pgCode) || httpStatus === 502 || httpStatus === 503 || (httpStatus >= 520 && httpStatus <= 530)) {
    return build(ERROR_CODES.SUPABASE_UNAVAILABLE, httpStatus, error);
  }

  if (httpStatus === 401 && API_KEY_RE.test(message)) {
    return build(ERROR_CODES.SUPABASE_CONFIGURATION_ERROR, httpStatus, error);
  }

  if (AUTH_CODES.has(pgCode) || httpStatus === 401 || name === 'AuthSessionMissingError') {
    return build(ERROR_CODES.SUPABASE_AUTH_ERROR, httpStatus, error);
  }

  if (httpStatus === 403) {
    return build(ERROR_CODES.SUPABASE_PERMISSION_DENIED, httpStatus, error);
  }

  if (MISSING_OBJECT_CODES.has(pgCode)) {
    return build(ERROR_CODES.SUPABASE_CONFIGURATION_ERROR, httpStatus, error);
  }

  if (httpStatus === 404 || pgCode === 'PGRST116') {
    return build(ERROR_CODES.RESOURCE_NOT_FOUND, httpStatus, error);
  }

  if (httpStatus && httpStatus >= 400 && httpStatus < 500) {
    return build(ERROR_CODES.SUPABASE_QUERY_ERROR, httpStatus, error);
  }

  if (httpStatus && httpStatus >= 500) {
    return build(pgCode ? ERROR_CODES.SUPABASE_QUERY_ERROR : ERROR_CODES.INTERNAL_ERROR, httpStatus, error);
  }

  if (pgCode) {
    return build(ERROR_CODES.SUPABASE_QUERY_ERROR, httpStatus, error);
  }

  return build(ERROR_CODES.INTERNAL_ERROR, httpStatus, error);
}

export function isGlobalFailure(classified) {
  return Boolean(classified?.global);
}

export function isMissingFunctionError(error) {
  const code = typeof error?.code === 'string' ? error.code : '';
  return code === 'PGRST202' || code === '42883';
}

export const ERROR_COPY = {
  [ERROR_CODES.SUPABASE_UNAVAILABLE]: {
    visual: '503',
    title: 'Service temporairement indisponible',
    message: 'Le service qui héberge nos données ne répond pas pour le moment. Il s’agit d’un incident temporaire, aucune de tes données n’est en cause.',
  },
  [ERROR_CODES.NETWORK_UNAVAILABLE]: {
    visual: 'OFF',
    title: 'Connexion impossible',
    message: 'Impossible de joindre nos serveurs. Vérifie ta connexion internet puis réessaie.',
  },
  [ERROR_CODES.REQUEST_TIMEOUT]: {
    visual: '503',
    title: 'Service temporairement indisponible',
    message: 'Le service met trop de temps à répondre. Réessaie dans quelques instants.',
  },
  [ERROR_CODES.SUPABASE_CONFIGURATION_ERROR]: {
    visual: '500',
    title: 'Erreur de configuration',
    message: 'Le site n’est pas correctement configuré côté serveur. Une intervention de l’équipe est nécessaire.',
  },
  [ERROR_CODES.SUPABASE_AUTH_ERROR]: {
    visual: '401',
    title: 'Authentification requise',
    message: 'Ta session n’est plus valide. Reconnecte-toi pour continuer.',
  },
  [ERROR_CODES.SUPABASE_PERMISSION_DENIED]: {
    visual: '403',
    title: 'Accès refusé',
    message: 'Tu n’as pas l’autorisation d’accéder à cette ressource.',
  },
  [ERROR_CODES.RESOURCE_NOT_FOUND]: {
    visual: '404',
    title: 'Ressource introuvable',
    message: 'La ressource demandée n’existe pas ou n’est plus disponible.',
  },
  [ERROR_CODES.SUPABASE_QUERY_ERROR]: {
    visual: '500',
    title: 'Erreur de requête',
    message: 'Une requête n’a pas pu aboutir. Réessaie dans quelques instants.',
  },
  [ERROR_CODES.INTERNAL_ERROR]: {
    visual: '500',
    title: 'Erreur interne',
    message: 'Une erreur inattendue est survenue. Réessaie dans quelques instants.',
  },
};

export function describeError(code) {
  return ERROR_COPY[code] ?? ERROR_COPY[ERROR_CODES.INTERNAL_ERROR];
}
