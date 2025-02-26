import React from 'react';
import Navbar from './Navbar';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Manga Tracker - My Personal Collection</p>
      </footer>
    </div>
  );
};

export default Layout;
