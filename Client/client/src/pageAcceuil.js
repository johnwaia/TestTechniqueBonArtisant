import React from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, upsertProduct, removeProduct } from './store/productsSlice';
import { clearAuth } from './store/authSlice';

import {
  AppBar, Toolbar, Typography, Button, Container, Paper, Stack, Box,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import carnetImg from './assets/lesbonsartisans_logo.jpg';

const API_BASE = '';

export default function Welcome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  const { token } = useSelector(state => state.auth);
  const [msg, setMsg] = React.useState('');
  const [snackOpen, setSnackOpen] = React.useState(false);

  React.useEffect(() => { if (!token) navigate('/', { replace: true }); }, [token, navigate]);

  const handleLogout = () => { dispatch(clearAuth()); navigate('/', { replace: true }); };
  const handleAddProduct = () => navigate('/addProduct');

  const handleSeeProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/product`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      dispatch(setProducts(data));
    } catch (error) { setMsg('❌ Erreur chargement'); setSnackOpen(true); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${API_BASE}/api/product/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      dispatch(removeProduct(id));
      setMsg('✅ Produit supprimé'); setSnackOpen(true);
    } catch (error) { setMsg('❌ Erreur'); setSnackOpen(true); }
  };

  const handleEditProduct = (id) => navigate(`/editProduct/${id}`);

  React.useEffect(() => {
    if (!token) return;
    const socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] });
    socket.on('productUpdated', ({ product, actor }) => { dispatch(upsertProduct(product)); setMsg(`🟡 ${actor?.username} a modifié ${product.name}`); setSnackOpen(true); });
    socket.on('productCreated', ({ product, actor }) => { dispatch(upsertProduct(product)); setMsg(`🟢 ${actor?.username} a ajouté ${product.name}`); setSnackOpen(true); });
    socket.on('productDeleted', ({ id, actor }) => { dispatch(removeProduct(id)); setMsg(`🔴 ${actor?.username} a supprimé un produit`); setSnackOpen(true); });
    return () => socket.disconnect();
  }, [token, dispatch]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box component="img" src={carnetImg} sx={{ width: 36, height: 36, mr: 1, borderRadius: '6px' }} />
            <Typography variant="h6">Mes produits</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1}>
            <Button color="inherit" startIcon={<AddIcon />} onClick={handleAddProduct}>Ajouter</Button>
            <Button color="inherit" startIcon={<RefreshIcon />} onClick={handleSeeProducts}>Afficher</Button>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>Déconnexion</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper sx={{ p: 2 }}>
          {products.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell><TableCell>Type</TableCell><TableCell>Prix</TableCell>
                    <TableCell>Note</TableCell><TableCell>Garantie</TableCell><TableCell>Dispo</TableCell>
                    <TableCell>Créé par</TableCell>
                    <TableCell>Certificat (Hash)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((p) => {
                    const id = p._id || p.id;
                    return (
                      <TableRow key={id} hover>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.type}</TableCell>
                        <TableCell>{p.price}</TableCell>
                        <TableCell>{p.rating ?? '-'}</TableCell>
                        <TableCell>{p.warranty_years ?? '-'}</TableCell>
                        <TableCell>{p.available ? '✅' : '❌'}</TableCell>
                        <TableCell>{p.createdby?.username ?? '-'}</TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {p.hash ? `${p.hash.substring(0, 8)}...` : 'Signé'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton size="small" onClick={() => handleEditProduct(id)} aria-label="modifier">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteProduct(id)} aria-label="supprimer">
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Alert severity="info">
              Clique sur <strong>“Afficher”</strong> pour voir tous les produits disponibles.
            </Alert>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={msg.startsWith('❌') ? 'error' : 'info'} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
}