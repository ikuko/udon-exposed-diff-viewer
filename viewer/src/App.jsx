import { useTheme } from './hooks/useTheme';
import { useDiffData } from './hooks/useDiffData';
import Navbar from './components/Navbar';
import VersionSelector from './components/VersionSelector';
import DiffViewer from './components/DiffViewer';
import Footer from './components/Footer';

function App() {
  const [theme, toggleTheme] = useTheme();
  const {
    versions,
    loading,
    selectedVersion1,
    setSelectedVersion1,
    selectedVersion2,
    setSelectedVersion2,
    diffResult,
    compared,
    handleCompare,
  } = useDiffData();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container-fluid pt-5 mt-5 flex-grow-1 d-flex flex-column justify-content-center">
        <div className="row align-items-end gy-3">
          <VersionSelector
            versions={versions}
            selectedVersion={selectedVersion1}
            setSelectedVersion={setSelectedVersion1}
            label="Version 1"
          />
          <VersionSelector
            versions={versions}
            selectedVersion={selectedVersion2}
            setSelectedVersion={setSelectedVersion2}
            label="Version 2"
          />
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={handleCompare} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : 'Compare'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {compared && diffResult.length === 0 && !loading && (
          <div className="alert alert-success mt-4" role="alert">
            No differences found.
          </div>
        )}
        {diffResult.length > 0 && !loading && <DiffViewer diffResult={diffResult} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;