import type {
  Gallery,
  GalleryImage,
  GalleryLayoutConfig,
  PublicGallery,
} from '../types/gallery.types';
import type { CatalogImage } from '../types/image.types';
import type { CollectionCover, CollectionPhoto } from './collections.data';

const cssRatio = (ratio: string): string => ratio.replace(':', '/');

const imageRatio = (image: CatalogImage, layout: GalleryLayoutConfig): string => {
  if (layout.aspectRatio !== 'auto') return cssRatio(layout.aspectRatio);
  if (image.aspectRatio !== 'auto') return cssRatio(image.aspectRatio);
  return '3/2';
};

export const resolveImageIds = (
  imageIds: string[],
  catalog: CatalogImage[],
  layout: GalleryLayoutConfig,
): GalleryImage[] => {
  const byId = new Map(catalog.map((image) => [image.id, image]));

  return imageIds
    .map((id) => byId.get(id))
    .filter((image): image is CatalogImage => Boolean(image))
    .map((image, index) => ({
      id: image.id,
      url: image.path,
      title: image.title,
      alt: image.alt,
      ratio: imageRatio(image, layout),
      order: index,
    }));
};

export const resolveGalleryImages = (gallery: Gallery, catalog: CatalogImage[]): GalleryImage[] => {
  const resolved = resolveImageIds(gallery.imageIds, catalog, gallery.layoutConfig);
  if (resolved.length > 0) return resolved;
  return gallery.legacyImages;
};

export const galleryToCover = (gallery: PublicGallery): CollectionCover => {
  const cover =
    gallery.images.find((image) => image.url === gallery.coverImageUrl) ?? gallery.images[0];
  const ratio =
    gallery.layoutConfig.aspectRatio === 'auto'
      ? (cover?.ratio ?? '3/2')
      : gallery.layoutConfig.aspectRatio.replace(':', '/');

  return {
    slug: gallery.slug,
    title: gallery.name.toUpperCase(),
    cover: cover?.url ?? '',
    aspectRatio: ratio,
    isFeatured: gallery.isFeatured,
    featuredOrder: gallery.featuredOrder,
  };
};

export const sortFeaturedFirst = (collections: CollectionCover[]): CollectionCover[] =>
  [...collections].sort(
    (a, b) =>
      Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) ||
      (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0),
  );

export const galleryToPhotos = (gallery: PublicGallery): CollectionPhoto[] =>
  gallery.images
    .filter((image) => image.url.trim().length > 0)
    .map((image) => ({
      src: image.url.trim(),
      caption: image.title || image.alt || gallery.name,
      alt: image.alt || image.title || gallery.name,
      ratio: image.ratio || '3/2',
    }));
