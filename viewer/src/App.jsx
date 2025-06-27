import { useTheme } from './hooks/useTheme';
import { useDiffData } from './hooks/useDiffData';
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
    handleCompare,
  } = useDiffData();

  return (
    <div className="container-fluid mt-5">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <h1 className="mb-4">Udon Exposed Diff Viewer</h1>
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

      {diffResult.length > 0 && <DiffViewer diffResult={diffResult} />}
    </div>
  );
}

export default App;