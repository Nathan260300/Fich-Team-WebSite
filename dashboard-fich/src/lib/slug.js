import { useState } from 'react';
import { slugify } from './image';

export function useSlugField(initial, source) {
  const [manual, setManual] = useState(Boolean(initial));
  const [typed, setTyped] = useState(initial ?? '');

  const slug = manual ? typed : slugify(source);

  const setSlug = value => {
    setManual(true);
    setTyped(value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-'));
  };

  return { slug, setSlug, clean: slugify(slug) };
}

export const SLUG_CONFLICT = 'Ce slug est déjà utilisé : choisis-en un autre.';
