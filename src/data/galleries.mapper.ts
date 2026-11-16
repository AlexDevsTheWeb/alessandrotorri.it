import type { Gallery } from '../types/gallery.types';
import type { CollectionCover, CollectionPhoto } from './collections.data';

export const galleryToCover = (gallery: Gallery): CollectionCover => ({
  slug: gallery.slug,
  title: gallery.name.toUpperCase(),
  cover: gallery.coverImageUrl || gallery.images[0]?.url || '',
});

export const galleryToPhotos = (gallery: Gallery): CollectionPhoto[] =>
  gallery.images
    .filter((image) => image.url.trim().length > 0)
    .map((image) => ({
      src: image.url.trim(),
      caption: image.title || image.alt || gallery.name,
      alt: image.alt || image.title || gallery.name,
      ratio: image.ratio || '3/2',
    }));
