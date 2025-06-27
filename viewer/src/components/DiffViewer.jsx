
import React from 'react';

const DiffViewer = ({ diffResult }) => {
  return (
    <div className="mt-4">
      {diffResult.map(({ file, lines, type }) => (
        <div key={file} className="card mb-3">
          <div className="card-header">{file}</div>
          <div className="card-body">
            <pre className="diff-pre">
              {lines.map((line, index) => {
                  let className = '';
                  if (line.separator) {
                    className = 'diff-separator';
                  } else if (line.added) {
                    className = 'diff-added';
                  } else if (line.removed) {
                    className = 'diff-removed';
                  } else {
                    className = 'diff-unchanged';
                  }
                  return (
                    <span key={index} className={className}>
                      <span className="line-num">{line.lineNum1}</span>
                      <span className="line-num">{line.lineNum2}</span>
                      <span className="diff-content">{line.text}</span>
                    </span>
                  );
                })}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiffViewer;
