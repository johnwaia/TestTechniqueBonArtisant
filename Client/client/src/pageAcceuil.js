// src/pageAcceuil.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Material UI
import {
  AppBar, Toolbar, Typography, Button, Container, Paper, Stack, Box,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import carnetImg from './assets/carnet.png';

const API_BASE = ''; // proxy CRA ⇒ /api/... ira vers http://localhost:5000

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = React.useState([]);
  const [msg, setMsg] = React.useState('');
  const [snackOpen, setSnackOpen] = React.useState(false);
  const socketRef = React.useRef(null);

  // Redirection si non authentifié
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const username =
    location.state?.username ||
    localStorage.getItem('lastUsername') ||
    'utilisateur';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastUsername');
    navigate('/', { replace: true });
  };

  const handleAddProduct = () => {
    navigate('/addProduct');
  };

  // Charger TOUS les produits
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
      // La suppression arrivera aussi via l’event socket, mais on met à jour localement pour réactivité
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

  React.useEffect(() => {
    if (!localStorage.getItem('token')) return undefined;
    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('productUpdated', ({ product, actor }) => {
      setProducts(prev => prev.map(p => ((p._id || p.id) === product._id ? product : p)));
      setMsg(`🟡 ${actor?.username || 'Un utilisateur'} a modifié « ${product.name} »`);
      setSnackOpen(true);
    });

    socket.on('productDeleted', ({ id, actor }) => {
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
      setMsg(`🔴 ${actor?.username || 'Un utilisateur'} a supprimé un produit`);
      setSnackOpen(true);
    });

    socket.on('productCreated', ({ product, actor }) => {
      setProducts(prev => (prev.some(p => (p._id || p.id) === product._id) ? prev : [product, ...prev]));
      setMsg(`🟢 ${actor?.username || 'Un utilisateur'} a ajouté « ${product.name} »`);
      setSnackOpen(true);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {/* Barre supérieure */}
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box
              component="img"
              src={carnetImg}
              alt="Catalogue produits"
              sx={{ width: 36, height: 36, mr: 1, borderRadius: '6px' }}
            />
            <Typography variant="h6" noWrap>Mes produits</Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ mr: 2 }} variant="body2">Bonjour, <strong>{username}</strong></Typography>

          <Stack direction="row" spacing={1}>
            <Button color="inherit" startIcon={<AddIcon />} onClick={handleAddProduct}>
              Ajouter
            </Button>
            <Button color="inherit" startIcon={<RefreshIcon />} onClick={handleSeeProducts}>
              Afficher
            </Button>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Déconnexion
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Contenu */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bienvenue, <strong>{username}</strong> ! Cliquez sur <b>Afficher</b> pour charger <b>tous les produits</b>.
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
                    <TableCell>Créé par</TableCell>
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
                        <TableCell>{p.createdby?.username ?? '-'}</TableCell>
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
              Clique sur <strong>“Afficher”</strong> pour voir tous les produits disponibles.
            </Alert>
          )}
        </Paper>
      </Container>

      {/* Snackbar messages */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {msg && (
          <Alert onClose={() => setSnackOpen(false)} severity={msg.startsWith('❌') ? 'error' : 'info'} sx={{ width: '100%' }}>
            {msg}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
