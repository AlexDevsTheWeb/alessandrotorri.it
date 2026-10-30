import { useEffect } from 'react';
import { COLLECTIONS } from '../data/collections.data';

const SITE_URL = 'https://www.alessandrotorri.it';
const DEFAULT_TITLE = 'Alessandro Torri — Fotografia di paesaggio';
const DEFAULT_DESCRIPTION = 'Gallerie di fotografia di paesaggio e lunga esposizione di Alessandro Torri.';
const DEFAULT_IMAGE = COLLECTIONS[0]?.cover ?? '';

interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const applyMeta = (title: string, description: string, image: string, path: string) => {
  const url = `${SITE_URL}${path}`;
  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:site_name', 'Alessandro Torri');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);
  upsertCanonical(url);
};

export const usePageMeta = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = window.location.pathname,
}: PageMeta = {}) => {
  useEffect(() => {
    applyMeta(title, description, image, path);

    return () => {
      applyMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, '/');
    };
  }, [description, image, path, title]);
};
