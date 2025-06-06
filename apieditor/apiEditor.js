import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './apiEditor.css';
import { useParams, useNavigate } from 'react-router-dom';

// PHP keywords for auto-completion
const phpKeywords = [
  'array', 'as', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty',
  'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile',
  'eval', 'exit', 'extends', 'false', 'final', 'for', 'foreach', 'function',
  'global', 'goto', 'if', 'implements', 'include', 'include_once', 'instanceof',
  'interface', 'isset', 'list', 'namespace', 'new', 'null', 'or', 'print',
  'private', 'protected', 'public', 'require', 'require_once', 'return',
  'static', 'switch', 'throw', 'true', 'try', 'unset', 'use', 'var', 'while',
  'yield', 'yield from'
];

const ApiEditor = ({ selectedFile, onFileSelect }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [lineNumbers, setLineNumbers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [saveStatus, setSaveStatus] = useState({ message: '', type: '' });
  const [currentFileName, setCurrentFileName] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [editableLines, setEditableLines] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [usecase, setUsecase] = useState('');
  const [originalUsecase, setOriginalUsecase] = useState('');
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  // Parse editable lines string into array of line numbers
  const parseEditableLines = (linesStr) => {
    if (!linesStr) return [];
    
    try {
      const ranges = linesStr.split(',');
      const editableLines = new Set();
      
      ranges.forEach(range => {
        const trimmedRange = range.trim();
        if (trimmedRange.includes('-')) {
          const [start, end] = trimmedRange.split('-').map(num => parseInt(num.trim()));
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              editableLines.add(i);
            }
          }
        } else {
          const num = parseInt(trimmedRange);
          if (!isNaN(num)) {
            editableLines.add(num);
          }
        }
      });
      
      const result = Array.from(editableLines).sort((a, b) => a - b);
      console.log('Parsed editable lines:', result);
      return result;
    } catch (error) {
      console.error('Error parsing editable lines:', error);
      return [];
    }
  };

  // Load file content and settings when component mounts or selectedFile changes
  useEffect(() => {
    const fetchFileData = async () => {
      // Get file ID from URL params or selectedFile
      const fileId = id || selectedFile?.id;
      
      if (fileId) {
        try {
          const response = await fetch('http://localhost/server.php/api/get-api-by-id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: fileId })
          });
          const data = await response.json();

          if (data.success) {
            console.log('Fetched file data:', data.data);
            setCode(data.data.content || '');
            setOriginalCode(data.data.content || '');
            setCurrentFileName(data.data.fileName);
            setUsecase(data.data.usecase || '');
            setOriginalUsecase(data.data.usecase || '');
            
            // Parse and set editable lines
            const parsedLines = parseEditableLines(data.data.editableLines);
            console.log('Setting editable lines:', parsedLines);
            setEditableLines(parsedLines);
            
            setHasChanges(false);
            
            // Set URL for the file
            const fileUrl = `http://localhost/data/api/${data.data.fileName}`;
            setCurrentUrl(fileUrl);

            // If this is a cloned file, show a success message
            if (selectedFile?.isClone) {
              setSaveStatus({
                message: 'API cloned successfully. You can now edit and save as a new file.',
                type: 'success'
              });
            }
          } else {
            console.error('Failed to fetch file data:', data.error);
            setSaveStatus({
              message: 'Failed to load file: ' + (data.error || 'Unknown error'),
              type: 'error'
            });
          }
        } catch (error) {
          console.error('Error fetching file data:', error);
          setSaveStatus({
            message: 'Error loading file: ' + error.message,
            type: 'error'
          });
        }
      } else {
        // Reset to empty state for new files
        setCode('');
        setOriginalCode('');
        setCurrentFileName(null);
        setCurrentUrl('');
        setEditableLines([]);
        setHasChanges(false);
        setSaveStatus({ message: '', type: '' });
        setUsecase('');
        setOriginalUsecase('');
      }
    };

    fetchFileData();
  }, [id, selectedFile]);

  // Clean up localStorage when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if we're not navigating to a new file
      if (!selectedFile) {
        localStorage.removeItem('currentFileData');
      }
    };
  }, [selectedFile]);

  // Check for changes in code or usecase
  useEffect(() => {
    const codeChanged = code !== originalCode;
    const usecaseChanged = usecase !== originalUsecase;
    setHasChanges(codeChanged || usecaseChanged);
  }, [code, usecase, originalCode, originalUsecase]);

  useEffect(() => {
    // Generate line numbers
    const lines = code.split('\n');
    setLineNumbers(lines.map((_, index) => index + 1));
  }, [code]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    const lines = newCode.split('\n');
    const cursorPosition = e.target.selectionStart;
    
    // Calculate the current line number (1-based)
    let lineNumber = 1;
    let currentPosition = 0;
    
    // Special handling for line 1
    if (cursorPosition <= lines[0].length) {
      lineNumber = 1;
    } else {
      for (let i = 0; i < lines.length; i++) {
        currentPosition += lines[i].length + 1; // +1 for the newline character
        if (cursorPosition <= currentPosition) {
          lineNumber = i + 1;
          break;
        }
      }
    }
    
    // Debug logging
    console.log('Current line:', lineNumber);
    console.log('Editable lines:', editableLines);
    console.log('Is editable:', editableLines.length === 0 || editableLines.includes(lineNumber));
    console.log('Cursor position:', cursorPosition);
    console.log('First line length:', lines[0].length);

    // Only allow changes if the current line is editable
    if (editableLines.length === 0 || editableLines.includes(lineNumber)) {
      setCode(newCode);
      validateCode(newCode);
    } else {
      // If the line is not editable, revert the change
      e.target.value = code;
      e.target.selectionStart = cursorPosition;
      e.target.selectionEnd = cursorPosition;
    }
  };

  const handleUsecaseChange = (e) => {
    setUsecase(e.target.value);
  };

  const isLineEditable = (lineNumber) => {
    // If no editable lines are specified, all lines are editable
    if (!editableLines || editableLines.length === 0) {
      return true;
    }
    
    // Check if the line number is in the editable lines array
    return editableLines.includes(lineNumber);
  };

  const validateCode = (code) => {
    // Basic PHP syntax validation
    const newErrors = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      // Check for unclosed brackets
      const openBrackets = (line.match(/{/g) || []).length;
      const closeBrackets = (line.match(/}/g) || []).length;
      
      if (openBrackets !== closeBrackets) {
        newErrors.push({
          line: index + 1,
          message: 'Unclosed bracket'
        });
      }

      // Check for missing semicolons
      if (line.trim() && !line.trim().endsWith(';') && 
          !line.trim().endsWith('{') && 
          !line.trim().endsWith('}') &&
          !line.trim().startsWith('//') &&
          !line.trim().startsWith('/*')) {
        newErrors.push({
          line: index + 1,
          message: 'Missing semicolon'
        });
      }
    });

    setErrors(newErrors);
  };

  const formatCode = () => {
    // Basic code formatting
    let formattedCode = code
      .replace(/\s+/g, ' ') // Remove extra spaces
      .replace(/\s*{\s*/g, ' {\n    ') // Format opening braces
      .replace(/\s*}\s*/g, '\n}\n') // Format closing braces
      .replace(/\s*;\s*/g, ';\n') // Format semicolons
      .replace(/\n\s*\n/g, '\n\n') // Remove extra newlines
      .trim();

    // Add proper indentation
    let indentLevel = 0;
    formattedCode = formattedCode.split('\n').map(line => {
      if (line.includes('}')) indentLevel--;
      const indentation = '    '.repeat(Math.max(0, indentLevel));
      if (line.includes('{')) indentLevel++;
      return indentation + line.trim();
    }).join('\n');

    setCode(formattedCode);
  };

  const handleKeyDown = (e) => {
    // Auto-completion
    if (e.key === 'Tab') {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = code.substring(0, cursorPosition);
      const wordBeforeCursor = textBeforeCursor.split(/\s+/).pop();

      const suggestions = phpKeywords.filter(keyword => 
        keyword.startsWith(wordBeforeCursor)
      );

      if (suggestions.length > 0) {
        const newCode = code.substring(0, cursorPosition - wordBeforeCursor.length) +
                       suggestions[0] +
                       code.substring(cursorPosition);
        setCode(newCode);
      }
    }
  };

  const scrollSync = (e) => {
    if (editorRef.current && previewRef.current) {
      const { scrollTop } = e.target;
      previewRef.current.scrollTop = scrollTop;
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = currentFileName ? '/api/update-api' : '/api/save-api';
      console.log('Saving to endpoint:', endpoint);
      console.log('Current file name:', currentFileName);
      console.log('Code length:', code.length);
      console.log('Editable lines:', editableLines);
      console.log('Usecase:', usecase);

      // First, if we have editable lines, save them separately
      if (currentFileName && editableLines.length > 0) {
        try {
          const settingsResponse = await fetch('http://localhost/server.php/api/update-api-settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: currentFileName,
              editableLines: editableLines.join(',')
            }),
          });

          const settingsData = await settingsResponse.json();
          if (!settingsData.success) {
            console.error('Failed to save editable lines:', settingsData.error);
          }
        } catch (error) {
          console.error('Error saving editable lines:', error);
        }
      }

      // Then save the main content
      const response = await fetch(`http://localhost/server.php${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          fileName: currentFileName,
          editableLines: editableLines.join(','),
          usecase
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        // Use the fileName from the response if it's a new file, otherwise use the current filename
        const savedFileName = data.data?.fileName || currentFileName;
        const fileUrl = `http://localhost/data/api/${savedFileName}`;
        
        setSaveStatus({
          message: currentFileName ? 'File updated successfully' : `File saved successfully as ${savedFileName}`,
          type: 'success'
        });
        
        setCurrentFileName(savedFileName);
        setCurrentUrl(fileUrl);
        setOriginalCode(code);
        setOriginalUsecase(usecase);
        setHasChanges(false);
        
        // Notify parent component that file was saved
        if (onFileSelect) {
          onFileSelect({ 
            fileName: savedFileName, 
            content: code,
            url: fileUrl,
            editableLines: editableLines.join(','),
            usecase
          });
        }
      } else {
        console.error('Save failed:', data.error);
        setSaveStatus({
          message: data.error || 'Failed to save file',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus({
        message: 'Error saving file: ' + error.message,
        type: 'error'
      });
    }

    // Clear status message after 5 seconds
    setTimeout(() => {
      setSaveStatus({ message: '', type: '' });
    }, 5000);
  };

  return (
    <div className="api-editor-container">
      <div className="editor-header">
        <h2>PHP API Editor {currentFileName ? `- ${currentFileName}` : '(New File)'}</h2>
        <div className="editor-actions">
          <div className="usecase-input">
            <input
              type="text"
              placeholder="Enter API usecase..."
              value={usecase}
              onChange={handleUsecaseChange}
              className="usecase-field"
            />
          </div>
          {editableLines.length > 0 && (
            <div className="editable-lines-info">
              Editable lines: {editableLines.join(', ')}
            </div>
          )}
          <button onClick={formatCode} className="format-button">Format Code</button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={!hasChanges}
          >
            {hasChanges ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>
      <div className="editor-wrapper">
        <div className="line-numbers">
          {lineNumbers.map(num => (
            <div 
              key={num} 
              className={`line-number ${!isLineEditable(num) ? 'non-editable' : ''}`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="code-editor">
          <textarea
            ref={editorRef}
            className="code-input"
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            onScroll={scrollSync}
          />
          <div className="code-preview" ref={previewRef}>
            <SyntaxHighlighter
              language="php"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                height: '100%',
                borderRadius: '0 4px 4px 0',
              }}
              showLineNumbers={true}
              wrapLines={true}
              lineProps={lineNumber => {
                const error = errors.find(e => e.line === lineNumber);
                return {
                  className: !isLineEditable(lineNumber) ? 'non-editable' : '',
                  style: {
                    ...(error ? { backgroundColor: 'rgba(255, 0, 0, 0.1)' } : {}),
                    display: 'block',
                    width: '100%'
                  }
                };
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
      <div className="editor-footer">
        <div className="footer-content">
          <div className="save-status-container">
            {saveStatus.message && (
              <div className={`save-status ${saveStatus.type}`}>
                {saveStatus.message}
              </div>
            )}
            {currentUrl && (
              <div className="file-url">
                <span>URL:</span>
                <a 
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="error-panel">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              Line {error.line}: {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiEditor;
