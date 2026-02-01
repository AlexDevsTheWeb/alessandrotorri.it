import React, { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Input,
  LinearProgress,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Card,
  CardMedia
} from '@mui/material';

interface FileWithMetadata {
  id: string;
  file: File;
  preview: string;
  title: string;
  metadata: string;
  collection: string;
  isFavorite: boolean;
  isLatestWork: boolean;
  isCoverImage: boolean;
  isVisible: boolean;
  order: number;
  progress: number;
  uploading: boolean;
  error: string | null;
}

const ImageUpload: React.FC = () => {
  const [filesToUpload, setFilesToUpload] = useState<FileWithMetadata[]>([]);

  useEffect(() => {
    // Clean up the object URLs on unmount
    return () => {
      filesToUpload.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [filesToUpload]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map((file, index) => ({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        title: '',
        metadata: '',
        collection: '',
        isFavorite: false,
        isLatestWork: false,
        isCoverImage: false,
        isVisible: true,
        order: index,
        progress: 0,
        uploading: false,
        error: null,
      }));
      setFilesToUpload((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleMetadataChange = (
    id: string,
    field: keyof FileWithMetadata,
    value: string | boolean
  ) => {
    setFilesToUpload((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, [field]: value } : file
      )
    );
  };

  const handleUpload = useCallback(async () => {
    for (const fileToUpload of filesToUpload) {
      if (!fileToUpload.file) continue;

      setFilesToUpload((prev) =>
        prev.map((f) =>
          f.id === fileToUpload.id ? { ...f, uploading: true, error: null } : f
        )
      );

      const storageRef = ref(storage, `images/${fileToUpload.file.name}`);
      try {
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload.file, {
          contentType: fileToUpload.file.type,
        });
        
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilesToUpload((prev) =>
                prev.map((f) =>
                f.id === fileToUpload.id ? { ...f, progress } : f
                )
            );
        }, 
        (error) => {
            setFilesToUpload((prev) =>
                prev.map((f) =>
                f.id === fileToUpload.id ? { ...f, uploading: false, error: error.message } : f
                )
            );
        }, 
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, 'images'), {
                name: fileToUpload.title || fileToUpload.file.name,
                url: downloadURL,
                metadata: fileToUpload.metadata,
                collection: fileToUpload.collection,
                isFavorite: fileToUpload.isFavorite,
                isLatestWork: fileToUpload.isLatestWork,
                isCoverImage: fileToUpload.isCoverImage,
                isVisible: fileToUpload.isVisible,
                order: fileToUpload.order,
                createdAt: serverTimestamp(),
            });
            setFilesToUpload((prev) =>
                prev.filter((f) => f.id !== fileToUpload.id)
            );
        });

      } catch (e: unknown) {
        let errorMessage = 'An unknown error occurred';
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        setFilesToUpload((prev) =>
          prev.map((f) =>
            f.id === fileToUpload.id
              ? { ...f, uploading: false, error: errorMessage }
              : f
          )
        );
      }
    }
  }, [filesToUpload]);

  return (
    <Box>
      <Input type="file" onChange={handleFileChange} inputProps={{ multiple: true }} />
      <List>
        {filesToUpload.map((file) => (
          <ListItem key={file.id} sx={{ display: 'block', my: 2, border: '1px solid #ccc', p: 2 }}>
            <Card sx={{ maxWidth: 345, mb: 2 }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={file.preview}
                    alt={`Preview of ${file.file.name}`}
                />
            </Card>
            <Typography variant="subtitle1">{file.file.name}</Typography>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              onChange={(e) => handleMetadataChange(file.id, 'title', e.target.value)}
            />
            <TextField
              label="Metadata"
              fullWidth
              margin="normal"
              onChange={(e) => handleMetadataChange(file.id, 'metadata', e.target.value)}
            />
            <TextField
              label="Collection"
              fullWidth
              margin="normal"
              onChange={(e) => handleMetadataChange(file.id, 'collection', e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={file.isFavorite}
                  onChange={(e) => handleMetadataChange(file.id, 'isFavorite', e.target.checked)}
                />
              }
              label="Favorite"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={file.isLatestWork}
                  onChange={(e) => handleMetadataChange(file.id, 'isLatestWork', e.target.checked)}
                />
              }
              label="Latest Work"
            />
             <FormControlLabel
              control={
                <Checkbox
                  checked={file.isCoverImage}
                  onChange={(e) => handleMetadataChange(file.id, 'isCoverImage', e.target.checked)}
                />
              }
              label="Cover Image"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={file.isVisible}
                  onChange={(e) => handleMetadataChange(file.id, 'isVisible', e.target.checked)}
                />
              }
              label="Visible"
            />
            {file.uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={file.progress} />
                <Typography>{`${Math.round(file.progress)}%`}</Typography>
              </Box>
            )}
            {file.error && <Typography color="error">{file.error}</Typography>}
          </ListItem>
        ))}
      </List>
      <Button onClick={handleUpload} disabled={filesToUpload.length === 0 || filesToUpload.some(f => f.uploading)}>
        Upload All
      </Button>
    </Box>
  );
};

export default ImageUpload;
