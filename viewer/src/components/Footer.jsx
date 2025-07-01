import React from 'react';

const Footer = () => {
  const lastUpdated = import.meta.env.VITE_APP_BUILD_TIMESTAMP;

  return (
    <footer className="footer mt-auto py-3 text-center">
      <span className="text-muted">
        &copy; {new Date().getFullYear()} ikuko
      </span>
      <div className="mt-2">
        <a href="https://github.com/ikuko/udon-exposed-diff-viewer" target="_blank" rel="noopener noreferrer" className="text-muted me-3">
          GitHub
        </a>
        <a href="https://x.com/magi_ikuko" target="_blank" rel="noopener noreferrer" className="text-muted">
          X
        </a>
      </div>
      {lastUpdated && (
        <div className="mt-2">
          <small className="text-muted">
            Last Updated: {new Date(lastUpdated).toLocaleString()}
          </small>
        </div>
      )}
    </footer>
  );
};

export default Footer;
