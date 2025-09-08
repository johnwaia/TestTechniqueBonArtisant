import React from 'react';

import { useLocation } from 'react-router-dom';

export default function Welcome() {
  const location = useLocation();
  const nameFromState = location.state?.username;
  const fallback = localStorage.getItem('lastUsername') || 'utilisateur';
  const username = nameFromState || fallback;

  return <div>Bienvenue, {username} !</div>;
}
