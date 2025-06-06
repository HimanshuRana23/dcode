import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './listAPIs.css';

const ListAPIs = ({ onFileSelect }) => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const [editableLines, setEditableLines] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAPIs();
  }, []);

  const fetchAPIs = async () => {
    try {
      const response = await fetch('http://localhost/server.php/api/list-apis');
      const data = await response.json();

      if (data.success) {
        const apiFiles = data.data.apis.map(api => {
          return {
            id: api.id,
            fileName: api.fileName,
            timestamp: api.created_at ? new Date(api.created_at).getTime() : Date.now(),
            size: api.size || 0,
            url: `http://localhost/data/api/${api.fileName}`,
            editableLines: api.editableLines || '',
            usecase: api.usecase || ''
          };
        });
        
        const sortedApis = apiFiles.sort((a, b) => b.timestamp - a.timestamp);
        setApis(sortedApis);
      } else {
        setError('Failed to fetch API files');
      }
    } catch (error) {
      setError('Error fetching API files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleFileSelect = async (api) => {
    try {
      const fileData = {
        id: api.id,
        fileName: api.fileName,
        isEdit: false,
        isClone: false
      };
      
      onFileSelect(fileData);
      navigate(`/api-editor/${api.id}`);
    } catch (error) {
      setError('Error loading file: ' + error.message);
    }
  };

  const handleCreateNew = () => {
    onFileSelect({ 
      id: null,
      fileName: null, 
      content: null,
      editableLines: '',
      url: null,
      isEdit: false,
      isClone: false
    });
    navigate('/api-editor');
  };

  const handleDelete = async (fileName) => {
    if (window.confirm('Are you sure you want to delete this API file?')) {
      try {
        const response = await fetch('http://localhost/server.php/api/delete-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName }),
        });

        const data = await response.json();

        if (data.success) {
          setApis(apis.filter(api => api.fileName !== fileName));
        } else {
          setError('Failed to delete API file');
        }
      } catch (error) {
        setError('Error deleting API file: ' + error.message);
      }
    }
  };

  const handleSettingsClick = (api) => {
    setSelectedApi(api);
    setEditableLines(api.editableLines || '');
    setShowSettings(true);
  };

  const handleSettingsSave = async () => {
    if (selectedApi) {
      try {
        const response = await fetch('http://localhost/server.php/api/update-api-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: selectedApi.fileName,
            editableLines: editableLines
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Update the API in the list
          setApis(apis.map(api => 
            api.fileName === selectedApi.fileName 
              ? { ...api, editableLines } 
              : api
          ));
          setShowSettings(false);
          setSelectedApi(null);
        } else {
          setError('Failed to save settings: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        setError('Error saving settings: ' + error.message);
      }
    }
  };

  const handleEdit = async (api) => {
    try {
      const fileData = {
        id: api.id,
        fileName: api.fileName,
        isEdit: true,
        isClone: false
      };
      
      onFileSelect(fileData);
      navigate(`/api-editor/${api.id}`);
    } catch (error) {
      setError('Error loading file for editing: ' + error.message);
    }
  };

  const handleClone = async (api) => {
    try {
      const fileData = {
        id: null, // New file, so no ID yet
        fileName: `api_${Date.now()}.php`,
        content: api.content,
        editableLines: api.editableLines || '',
        usecase: `${api.usecase || ''} (Cloned)`,
        url: `http://localhost/data/api/api_${Date.now()}.php`,
        isClone: true
      };
      
      onFileSelect(fileData);
      navigate('/api-editor');
    } catch (error) {
      setError('Error loading file for cloning: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="list-apis-container">
        <div className="loading">Loading API files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-apis-container">
        <div className="error-message">{error}</div>
        <button onClick={() => setError(null)} className="clear-error-button">
          Clear Error
        </button>
      </div>
    );
  }

  return (
    <div className="list-apis-container">
      <div className="list-header">
        <h2>Saved API Files</h2>
        <div className="header-buttons">
          <button onClick={handleCreateNew} className="create-button">
            Create New API
          </button>
          <button onClick={fetchAPIs} className="refresh-button">
            Refresh List
          </button>
        </div>
      </div>
      
      {showSettings && (
        <div className="settings-panel">
          <h3>API Settings - {selectedApi?.fileName}</h3>
          <div className="settings-content">
            <div className="setting-group">
              <label htmlFor="editableLines">Editable Lines (e.g., "1-5,7,9-12"):</label>
              <input
                type="text"
                id="editableLines"
                value={editableLines}
                onChange={(e) => setEditableLines(e.target.value)}
                placeholder="Enter line numbers or ranges"
              />
              <p className="setting-help">
                Specify which lines should be editable. Use comma-separated values and ranges.
                Example: "1-5,7,9-12" means lines 1 through 5, line 7, and lines 9 through 12 will be editable.
              </p>
            </div>
            <div className="settings-actions">
              <button onClick={handleSettingsSave} className="save-settings-button">
                Save Settings
              </button>
              <button onClick={() => setShowSettings(false)} className="cancel-settings-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {apis.length === 0 ? (
        <div className="no-apis">No API files found</div>
      ) : (
        <div className="apis-table">
          <table>
            <thead>
              <tr>
                <th>Use Case</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apis.map((api) => (
                <tr key={api.id}>
                  <td className="usecase-cell">
                    <div className="usecase-content">
                      <span className="usecase-text">{api.usecase || 'No use case specified'}</span>
                      <span className="file-name">{api.fileName}</span>
                    </div>
                  </td>
                  <td>{formatDate(api.timestamp)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleClone(api)}
                        className="clone-button"
                      >
                        Clone
                      </button>
                      <button
                        onClick={() => handleEdit(api)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleFileSelect(api)}
                        className="view-button"
                      >
                        View
                      </button>
                      <a
                        href={api.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-button"
                      >
                        Link
                      </a>
                      <button
                        onClick={() => handleSettingsClick(api)}
                        className="settings-button"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => handleDelete(api.fileName)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListAPIs;
