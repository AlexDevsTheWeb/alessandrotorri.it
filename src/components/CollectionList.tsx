import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const CollectionList: React.FC = () => {
  const [value, loading, error] = useCollection(
    query(collection(db, 'images'), orderBy('collection'))
  );

  const collections = value?.docs.reduce((acc: string[], doc) => {
    const collectionName = doc.data().collection;
    if (collectionName && !acc.includes(collectionName)) {
      acc.push(collectionName);
    }
    return acc;
  }, []);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Collections
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}
      {collections && (
        <List>
          {collections.map((collectionName) => (
            <ListItem key={collectionName} component={Link} to={`/admin/collection/${collectionName}`}>
              <ListItemText primary={collectionName} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CollectionList;
