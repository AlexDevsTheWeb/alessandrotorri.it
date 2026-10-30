import { Box, Button, Container, Typography } from '@mui/material';
import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Qualcosa è andato storto
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Ricarica la pagina oppure torna alla galleria.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Ricarica
            </Button>
            <Button component={Link} to="/gallery" nativeButton={false}>
              Galleria
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
