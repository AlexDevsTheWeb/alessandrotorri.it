import React, { useState, useCallback } from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Button, Input, LinearProgress, Box, Typography } from '@mui/material';

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFile, uploading, snapshot, error] = useUploadFile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = useCallback(async () => {
    if (selectedFile) {
      const storageRef = ref(storage, `images/${selectedFile.name}`);
      try {
        const result = await uploadFile(storageRef, selectedFile, {
          contentType: selectedFile.type,
        });

        if (result) {
          const downloadURL = await getDownloadURL(result.ref);
          await addDoc(collection(db, 'images'), {
            name: selectedFile.name,
            url: downloadURL,
            createdAt: serverTimestamp(),
          });
          setSelectedFile(null);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [selectedFile, uploadFile]);

  return (
    <Box>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
        Upload
      </Button>
      {uploading && snapshot && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={(snapshot.bytesTransferred / snapshot.totalBytes) * 100}
          />
          <Typography>{`${Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )}%`}</Typography>
        </Box>
      )}
      {error && <Typography color="error">{error.message}</Typography>}
    </Box>
  );
};

export default ImageUpload;
