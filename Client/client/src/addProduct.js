import React from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { upsertProduct } from './store/productsSlice';

// MUI
import {
  Container, Paper, Stack, TextField, Button, Checkbox, FormControlLabel, Typography, Alert
} from '@mui/material';

const API_BASE = ''; // proxy CRA

export default function AddProduct() {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [rating, setRating] = React.useState('');
  const [warrantyYears, setWarrantyYears] = React.useState('');
  const [available, setAvailable] = React.useState(true);
  const [msg, setMsg] = React.useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(s => s.auth.token);

  React.useEffect(() => {
    if (!token) navigate('/', { replace: true });
  }, [token, navigate]);

  const handleRegisterProduct = async (e) => {
    e.preventDefault();
    setMsg('Envoi...');

    try {
      const res = await fetch(`${API_BASE}/api/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: name.trim(),
          type: type.trim(),
          price: parseFloat(price),
          rating: rating === '' ? undefined : parseFloat(rating),
          warranty_years: warrantyYears === '' ? undefined : parseInt(warrantyYears, 10),
          available,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg(`❌ ${data?.message || `Erreur ${res.status}`}`);
        return;
      }

      dispatch(upsertProduct({
        id: data.id,
        name: data.name,
        type: data.type,
        price: data.price,
        rating: data.rating,
        warranty_years: data.warranty_years,
        available: data.available,
        createdAt: data.createdAt
      }));

      setMsg(`✅ Produit créé : ${data.name}`);

      // Naviguer vers la liste après un court délai
      setTimeout(() => navigate('/pageAcceuil'), 600);
    } catch {
      setMsg('❌ Erreur réseau');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Créer un produit</Typography>
        <Stack component="form" spacing={2} onSubmit={handleRegisterProduct}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Nom" value={name} onChange={e => setName(e.target.value)} required fullWidth />
            <TextField label="Type" value={type} onChange={e => setType(e.target.value)} required fullWidth />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Prix"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Note (0-5)"
              type="number"
              inputProps={{ step: '0.1', min: 0, max: 5 }}
              value={rating}
              onChange={e => setRating(e.target.value)}
              fullWidth
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Garantie (années)"
              type="number"
              inputProps={{ min: 0 }}
              value={warrantyYears}
              onChange={e => setWarrantyYears(e.target.value)}
              fullWidth
            />
            <FormControlLabel
              control={<Checkbox checked={available} onChange={e => setAvailable(e.target.checked)} />}
              label="Disponible"
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained">Créer</Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>Retour</Button>
          </Stack>

          {msg && (
            <Alert severity={msg.startsWith('❌') ? 'error' : 'success'}>{msg}</Alert>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
