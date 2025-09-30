import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AppBar, Toolbar, Typography, Button, Container, Paper, Stack, Box,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import LogoBonArtisant from './assets/lesbonsartisans_logo.jpg';

const API_BASE = '';

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = React.useState([]);
  const [msg, setMsg] = React.useState('');            // messages d’erreur/succès
  const [snackOpen, setSnackOpen] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const username = location.state?.username || localStorage.getItem('lastUsername') || 'utilisateur';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastUsername');
    navigate('/', { replace: true });
  };

  const handleAddProduct = () => {
    navigate('/addProduct');
  };

  const handleSeeProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/product`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
      const data = await response.json();
      setProducts(data);
      setMsg('');
    } catch (error) {
      console.error(error);
      setMsg('❌ Erreur lors du chargement des produits');
      setSnackOpen(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/product/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du produit');
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      setMsg('✅ Produit supprimé');
      setSnackOpen(true);
    } catch (error) {
      console.error(error);
      setMsg('❌ Suppression impossible');
      setSnackOpen(true);
    }
  };

  const handleEditProduct = (id) => {
    navigate(`/editProduct/${id}`);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box
              component="img"
              src={LogoBonArtisant}
              alt="Catalogue produits"
              sx={{ width: 36, height: 36, mr: 1, borderRadius: '6px' }}
            />
            <Typography variant="h6" noWrap>Mes produits</Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Typography sx={{ mr: 2 }} variant="body2">Bonjour, <strong>{username}</strong></Typography>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
            >
              Ajouter
            </Button>
            <Button
              color="inherit"
              startIcon={<RefreshIcon />}
              onClick={handleSeeProducts}
            >
              Afficher
            </Button>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bienvenue, <strong>{username}</strong> !
          </Typography>

          {products.length > 0 ? (
            <Box role="region" aria-label="Liste de produits" sx={{ overflowX: 'auto' }}>
              <Table size="small" aria-label="table produits">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Prix</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Garantie (ans)</TableCell>
                    <TableCell>Dispo</TableCell>
                    <TableCell align="right" width={180}>Actions</TableCell>
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
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton size="small" onClick={() => handleEditProduct(id)} aria-label="modifier">
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProduct(id)}
                              aria-label="supprimer"
                            >
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
              Clique sur <strong>“Afficher”</strong> pour afficher tes produits.
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
        {msg && (
          <Alert onClose={() => setSnackOpen(false)} severity={msg.startsWith('❌') ? 'error' : 'success'} sx={{ width: '100%' }}>
            {msg}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
