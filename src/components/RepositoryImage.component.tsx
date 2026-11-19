import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React, { useState } from 'react';

interface RepositoryImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  loading?: 'eager' | 'lazy';
  sx?: SxProps<Theme>;
}

interface FailedSource {
  src: string;
  stage: 'local' | 'remote';
}

const RepositoryImage: React.FC<RepositoryImageProps> = ({
  src,
  alt,
  fallbackSrc,
  loading = 'lazy',
  sx,
}) => {
  const [failedSource, setFailedSource] = useState<FailedSource | null>(null);
  const failure = failedSource?.src === src ? failedSource : null;
  const canFallBack = Boolean(fallbackSrc) && fallbackSrc !== src;
  const currentSrc =
    failure?.stage === 'local' && fallbackSrc && fallbackSrc !== src ? fallbackSrc : src;
  const hasFailed =
    !currentSrc || failure?.stage === 'remote' || (failure?.stage === 'local' && !canFallBack);

  if (hasFailed) return null;

  return (
    <Box
      component="img"
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() =>
        setFailedSource((previous) => ({
          src,
          stage: previous?.src === src || !canFallBack ? 'remote' : 'local',
        }))
      }
      sx={sx}
    />
  );
};

export default RepositoryImage;
