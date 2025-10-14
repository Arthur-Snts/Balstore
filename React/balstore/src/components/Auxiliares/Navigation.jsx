import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Início</Link> | <Link to="/sobre">Sobre</Link>
    </nav>
  );
}

export default Navigation;