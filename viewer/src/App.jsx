import { useTheme } from './hooks/useTheme';
import { useDiffData } from './hooks/useDiffData';
import Navbar from './components/Navbar';
import VersionSelector from './components/VersionSelector';
import DiffViewer from './components/DiffViewer';

function App() {
  const [theme, toggleTheme] = useTheme();
  const {
    versions,
    selectedVersion1,
    setSelectedVersion1,
    selectedVersion2,
    setSelectedVersion2,
    diffResult,
    compared,
    handleCompare,
  } = useDiffData();

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container-fluid pt-5 mt-5">
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
            <button className="btn btn-primary w-100" onClick={handleCompare}>
              Compare
            </button>
          </div>
        </div>

        {compared && diffResult.length === 0 && (
          <div className="alert alert-success mt-4" role="alert">
            No differences found.
          </div>
        )}
        {diffResult.length > 0 && <DiffViewer diffResult={diffResult} />}
      </div>
    </>
  );
}

export default App;