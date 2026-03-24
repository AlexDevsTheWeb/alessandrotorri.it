import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material';
import { collection, doc, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import type { IImage } from '../types/image.types';


const CollectionDetailPage: React.FC = () => {
  const { collectionName } = useParams<{ collectionName: string }>();
  const [images, setImages] = useState<IImage[]>([]);

  const [collectionData, loading, error] = useCollectionData<IImage>(
    query(collection(db, 'images'), where('collection', '==', collectionName), where('isVisible', '==', true)),
    { idField: 'id' }
  );

  useEffect(() => {
    if (collectionData) {
      const sortedImages = [...collectionData].sort((a, b) => a.order - b.order);
      setImages(sortedImages);
    }
  }, [collectionData]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setImages(reorderedImages);

    const batch = writeBatch(db);
    reorderedImages.forEach((image, index) => {
      const docRef = doc(db, 'images', image.id);
      batch.update(docRef, { order: index });
    });
    await batch.commit();
  };

  const handleImageUpdate = async (id: string, field: keyof IImage, value: string | boolean) => {
    const docRef = doc(db, 'images', id);
    await updateDoc(docRef, { [field]: value });
  };

  const handleDeleteImage = async (id: string) => {
    const docRef = doc(db, 'images', id);
    await updateDoc(docRef, { isVisible: false });
  };

  const handleDeleteCollection = async () => {
    const batch = writeBatch(db);
    images.forEach((image) => {
      const docRef = doc(db, 'images', image.id);
      batch.update(docRef, { isVisible: false });
    });
    await batch.commit();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {collectionName}
        </Typography>
        <Button variant="outlined" color="error" onClick={handleDeleteCollection} sx={{ mb: 2 }}>
          Delete Collection
        </Button>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">Error: {error.message}</Typography>}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center' }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 151, mr: 2 }}
                          image={image.url}
                          alt={image.name}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <TextField
                            label="Title"
                            defaultValue={image.name}
                            onBlur={(e) => handleImageUpdate(image.id, 'name', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Metadata"
                            defaultValue={image.metadata}
                            onBlur={(e) => handleImageUpdate(image.id, 'metadata', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={image.isFavorite}
                                onChange={(e) => handleImageUpdate(image.id, 'isFavorite', e.target.checked)}
                              />
                            }
                            label="Favorite"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={image.isLatestWork}
                                onChange={(e) => handleImageUpdate(image.id, 'isLatestWork', e.target.checked)}
                              />
                            }
                            label="Latest Work"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={image.isCoverImage}
                                onChange={(e) => handleImageUpdate(image.id, 'isCoverImage', e.target.checked)}
                              />
                            }
                            label="Cover Image"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={image.isVisible}
                                onChange={(e) => handleImageUpdate(image.id, 'isVisible', e.target.checked)}
                              />
                            }
                            label="Visible"
                          />
                          <Button variant="outlined" color="error" onClick={() => handleDeleteImage(image.id)}>
                            Delete
                          </Button>
                        </Box>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Container>
  );
};

export default CollectionDetailPage;
