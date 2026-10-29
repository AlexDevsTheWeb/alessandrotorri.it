export interface CollectionCover {
  slug: string;
  title: string;
  cover: string;
  placeholder: string;
}

export interface CollectionPhoto {
  src: string;
  caption: string;
}

const CDN = 'https://cdn.myportfolio.com/003f706d94be83b9dd8b07d5b1778379';

export const COLLECTIONS: CollectionCover[] = [
  {
    slug: '01-favorite',
    title: 'FAVORITE',
    cover: `${CDN}/1fb958b7-04d3-40f7-b9e7-ece79e5e9012_carw_16x9x1280.jpg?h=ae395f468fd9e5f5fd84db1b00f43d77`,
    placeholder: `${CDN}/1fb958b7-04d3-40f7-b9e7-ece79e5e9012_carw_16x9x32.jpg?h=b7af85c81fccb438bdc5bed4ec7e0118`,
  },
  {
    slug: '02-ultimi-lavori',
    title: 'ULTIMI LAVORI',
    cover: `${CDN}/20fcbf67-7e36-47d2-aed7-e8f6ee245d6d_carw_16x9x1280.jpg?h=eba170e69df3d5a28b7002db692fc766`,
    placeholder: `${CDN}/20fcbf67-7e36-47d2-aed7-e8f6ee245d6d_carw_16x9x32.jpg?h=e52f373d7bae5b3cc2874e47b1e85954`,
  },
  {
    slug: '07-francia',
    title: 'FRANCIA',
    cover: `${CDN}/4e4867d6-c298-480a-bcc3-87b65c23b908_carw_16x9x1280.jpg?h=82b63e80395a1a0732769e194a563e4f`,
    placeholder: `${CDN}/4e4867d6-c298-480a-bcc3-87b65c23b908_carw_16x9x32.jpg?h=bce0076946eff24413944eeb920c4b1b`,
  },
  {
    slug: '09-irlanda',
    title: 'IRLANDA',
    cover: `${CDN}/f2d7aefd-aaeb-4598-963f-bfe7833a469e_carw_16x9x1280.jpg?h=967c89b4af35ed8290c2365cecf4977a`,
    placeholder: `${CDN}/f2d7aefd-aaeb-4598-963f-bfe7833a469e_carw_16x9x32.jpg?h=f18f70f61edbe7e3ad665cdef78cac75`,
  },
  {
    slug: '03-italia',
    title: 'ITALIA',
    cover: `${CDN}/5746880c-d2b9-481b-a0ab-72ee947a8533_carw_16x9x1280.jpg?h=91a74f539fe839c18cd340985caeb2b2`,
    placeholder: `${CDN}/5746880c-d2b9-481b-a0ab-72ee947a8533_carw_16x9x32.jpg?h=46392cc221eba712e338804fda6f245b`,
  },
  {
    slug: '05-portogallo',
    title: 'PORTOGALLO',
    cover: `${CDN}/445d5fad-1356-4c25-bf14-f63822981b45_carw_16x9x1280.jpg?h=69cdffe563858fe9d561f84932f60d92`,
    placeholder: `${CDN}/445d5fad-1356-4c25-bf14-f63822981b45_carw_16x9x32.jpg?h=6670ff1d0f4cbbd3c8118b30ee5871ee`,
  },
  {
    slug: '08-uk',
    title: 'REGNO UNITO',
    cover: `${CDN}/4e60929e-578b-4464-93ce-97b660192c75_carw_16x9x1280.jpg?h=24dfff4c3c26b63a7a082ab7a00e9e2d`,
    placeholder: `${CDN}/4e60929e-578b-4464-93ce-97b660192c75_carw_16x9x32.jpg?h=5df732ee8c5dcc49b1e17e3fa9de0817`,
  },
  {
    slug: '06-scozia',
    title: 'SCOZIA',
    cover: `${CDN}/47629a85-a281-46ef-8dd4-4aad23b1837e_carw_16x9x1280.jpg?h=49a44ca0dd7033bc9e49743df2bc8f38`,
    placeholder: `${CDN}/47629a85-a281-46ef-8dd4-4aad23b1837e_carw_16x9x32.jpg?h=5fb2aaf8e6f6ccebacc91a26dad9265f`,
  },
  {
    slug: '04-spagna',
    title: 'SPAGNA',
    cover: `${CDN}/b535cd1a-6734-4509-a06b-45bb16c139ce_carw_16x9x1280.jpg?h=5249f1bb149f95f522e6e8f06a78e354`,
    placeholder: `${CDN}/b535cd1a-6734-4509-a06b-45bb16c139ce_carw_16x9x32.jpg?h=9aa3b2c6e7ae602f699be4b244318be0`,
  },
];

export const FAVORITE_CAPTIONS: string[] = [
  'Eilean Donan Castle - Scozia',
  'Badlands - South Dakota',
  "Falaise d'Étretat - Normandia",
  "Falaise d'Étretat - Normandia",
  'Dolomiti di Brenta',
  'Lago di Braies',
  'Tellaro',
  'Grandes Jorasses',
  'Riomaggiore',
  'Bedruthan steps - Cornovaglia',
  'Holywell Bay Beach - Cornovaglia',
  "Land's End - Cornovaglia",
  'Vernazza',
  'Pointe du Raz - Bretagna',
  'Pointe du Van - Bretagna',
  'Kermorvan - Bretagna',
  'Arnìa - Cantabria',
  'Virxe da Barca - Galizia',
  'Cabo de São Vicente - Portogallo',
  'Cabo da Roca - Portogallo',
  'Dunquin pier - Irlanda',
  'The three sisters - Irlanda',
  'Faro di Goury - Francia',
  'Le Mont Saint-Michel - Francia',
];

export const PHOTOS: Record<string, CollectionPhoto[]> = Object.fromEntries(
  COLLECTIONS.map((c) => [
    c.slug,
    c.slug === '01-favorite'
      ? FAVORITE_CAPTIONS.map((caption) => ({ src: c.cover, caption }))
      : [{ src: c.cover, caption: c.title }],
  ]),
);
