import React from 'react';

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <nav className={`navbar navbar-expand-lg fixed-top navbar-${theme === 'light' ? 'light' : 'dark'}`}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Udon Exposed Diff Viewer</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <button className="btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
