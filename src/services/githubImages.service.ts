import type { RepositoryImageFile } from '../types/image.types';
import { imageIdFromFilename, imagePathFromFilename, isSupportedImageFile } from './images.service';

const DEFAULT_REPOSITORY = 'AlexDevsTheWeb/alessandrotorri.it';
const DEFAULT_BRANCH = 'development';
const GALLERIES_PATH = 'public/galleries';

const repository =
  (import.meta.env.VITE_GITHUB_REPO as string | undefined)?.trim() || DEFAULT_REPOSITORY;
const branch = (import.meta.env.VITE_GITHUB_BRANCH as string | undefined)?.trim() || DEFAULT_BRANCH;

export const GITHUB_REPOSITORY = repository;
export const GITHUB_BRANCH = branch;

interface GitHubContentEntry {
  name: string;
  download_url: string;
}

const isContentEntry = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object';

const toRepositoryFile = (entry: Record<string, unknown>): GitHubContentEntry | null => {
  if (entry.type !== 'file' || typeof entry.name !== 'string') return null;
  if (!isSupportedImageFile(entry.name)) return null;
  return {
    name: entry.name,
    download_url: typeof entry.download_url === 'string' ? entry.download_url : '',
  };
};

export const fetchRepositoryImages = async (): Promise<RepositoryImageFile[]> => {
  const endpoint = `https://api.github.com/repos/${repository}/contents/${GALLERIES_PATH}?ref=${encodeURIComponent(branch)}`;

  let response: Response;
  try {
    response = await fetch(endpoint, { headers: { Accept: 'application/vnd.github+json' } });
  } catch {
    throw new Error('GitHub non raggiungibile. Controlla la connessione e riprova.');
  }

  if (response.status === 404) return [];
  if (response.status === 403 || response.status === 429) {
    throw new Error(
      'Limite di richieste GitHub raggiunto (60/ora senza token). Riprova più tardi.',
    );
  }
  if (!response.ok) {
    throw new Error(`GitHub ha risposto ${response.status}. Riprova più tardi.`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Risposta GitHub inattesa: elenco dei file non riconosciuto.');
  }

  return payload
    .filter(isContentEntry)
    .map(toRepositoryFile)
    .filter((entry): entry is GitHubContentEntry => entry !== null)
    .map((entry) => ({
      filename: entry.name,
      path: imagePathFromFilename(entry.name),
      suggestedId: imageIdFromFilename(entry.name),
      downloadUrl: entry.download_url,
    }));
};
