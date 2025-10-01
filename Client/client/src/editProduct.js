// src/editProduct.js
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Material UI
import {
  Container, Paper, Stack, TextField, Button, Checkbox, FormControlLabel,
  Typography, Snackbar, Alert
} from '@mui/material';

const API_BASE = ''; // grâce au proxy CRA, /api/... ira vers http://localhost:5000

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [rating, setRating] = React.useState('');
  const [warrantyYears, setWarrantyYears] = React.useState('');
  const [available, setAvailable] = React.useState(true);

  const [snack, setSnack] = React.useState({ open: false, msg: '', severity: 'info' });


  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setSnack({ open: true, msg: '❌ Produit introuvable', severity: 'error' });
          return;
        }

        const data = await res.json();
        setName(data.name || '');
        setType(data.type || '');
        setPrice(data.price ?? '');
        setRating(data.rating ?? '');
        setWarrantyYears(data.warranty_years ?? '');
        setAvailable(Boolean(data.available));
      } catch {
        setSnack({ open: true, msg: '❌ Erreur réseau', severity: 'error' });
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          type: type.trim(),
          price: price === '' ? undefined : parseFloat(price),
          rating: rating === '' ? undefined : parseFloat(rating),
          warranty_years: warrantyYears === '' ? undefined : parseInt(warrantyYears, 10),
          available,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setSnack({
          open: true,
          msg: `❌ ${data?.message || `Erreur ${res.status}`}`,
          severity: 'error',
        });
        return;
      }

      setSnack({
        open: true,
        msg: `✅ Produit modifié : ${data.name}`,
        severity: 'success',
      });

      // Retour à la liste après un court délai
      setTimeout(() => navigate('/pageAcceuil'), 600);
    } catch {
      setSnack({ open: true, msg: '❌ Erreur réseau. Vérifie le serveur.', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Modifier le produit</Typography>

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
              inputProps={{ minLength: 2 }}
            />
            <TextField
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              fullWidth
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Prix"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Note (0-5)"
              type="number"
              inputProps={{ step: '0.1', min: 0, max: 5 }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              fullWidth
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Garantie (années)"
              type="number"
              inputProps={{ min: 0 }}
              value={warrantyYears}
              onChange={(e) => setWarrantyYears(e.target.value)}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
              }
              label="Disponible"
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained">Enregistrer</Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>Retour</Button>
          </Stack>
        </Stack>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snack.msg && (
          <Alert
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            severity={snack.severity}
            sx={{ width: '100%' }}
          >
            {snack.msg}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
