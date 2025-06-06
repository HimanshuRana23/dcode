import React, { useState, useEffect } from "react";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ValidationForm.css';

export default function ValidationForm({ onSubmit, onReset, initialData }) {
  const [formValue, setFormValue] = useState({
    globalJson: initialData?.globalJson || {
      param1: { staticValue: "" }
    },
    localJson: initialData?.localJson || {
      param1: { staticValue: "" }
    },
    operators: initialData?.operators || {
      param1: ">"
    },
    messages: initialData?.messages || {
      param1: {
        fail: "Parameter 1 validation failed: new value must be greater.",
        success: "Parameter 1 validation passed successfully."
      }
    },
    defaultMessage: initialData?.defaultMessage || "One or more fields did not satisfy the required condition.",
    nestedParams: initialData?.nestedParams || {}
  });

  const [inputTypes, setInputTypes] = useState({
    global: {
      param1: "static"
    },
    local: {
      param1: "static"
    }
  });

  const [errors, setErrors] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [parameterCount, setParameterCount] = useState(1);

  const [isLoading, setIsLoading] = useState({
    global: {},
    local: {}
  });

  const [questionIds, setQuestionIds] = useState({
    global: {},
    local: {}
  });

  const operatorOptions = [
    { value: ">", label: ">" },
    { value: ">=", label: ">=" },
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
    { value: "==", label: "==" },
    { value: "===", label: "===" },
    { value: "!=", label: "!=" },
    { value: "!==", label: "!==" }
  ];

  const inputTypeOptions = [
    { value: "static", label: "Static Value" },
    { value: "url", label: "URL" },
    { value: "question", label: "Question ID" }
  ];

  useEffect(() => {
    if (initialData) {
      setFormValue({
        globalJson: initialData.globalJson || {
          param1: { staticValue: "" }
        },
        localJson: initialData.localJson || {
          param1: { staticValue: "" }
        },
        operators: initialData.operators || {
          param1: ">"
        },
        messages: initialData.messages || {
          param1: {
            fail: "Parameter 1 validation failed: new value must be greater.",
            success: "Parameter 1 validation passed successfully."
          }
        },
        defaultMessage: initialData.defaultMessage || "One or more fields did not satisfy the required condition.",
        nestedParams: initialData.nestedParams || {}
      });

      // Initialize input types based on initial data
      const globalTypes = {};
      const localTypes = {};

      Object.keys(initialData.globalJson || {}).forEach(key => {
        if (initialData.globalJson[key].staticValue !== undefined) {
          globalTypes[key] = "static";
        } else if (initialData.globalJson[key].url !== undefined) {
          globalTypes[key] = "url";
        } else if (initialData.globalJson[key].questionId !== undefined) {
          globalTypes[key] = "question";
        }
      });

      Object.keys(initialData.localJson || {}).forEach(key => {
        if (initialData.localJson[key].staticValue !== undefined) {
          localTypes[key] = "static";
        } else if (initialData.localJson[key].url !== undefined) {
          localTypes[key] = "url";
        } else if (initialData.localJson[key].questionId !== undefined) {
          localTypes[key] = "question";
        }
      });

      setInputTypes({
        global: globalTypes,
        local: localTypes
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all parameters
    for (let i = 1; i <= parameterCount; i++) {
      if (!formValue.globalJson[`param${i}`]) {
        newErrors[`globalParam${i}`] = `Global Parameter ${i} is required`;
      } else if (inputTypes.global[`param${i}`] === "url") {
        try {
          new URL(formValue.globalJson[`param${i}`]?.url);
        } catch {
          newErrors[`globalParam${i}`] = `Global Parameter ${i} must be a valid URL`;
        }
      }

      if (!formValue.localJson[`param${i}`]) {
        newErrors[`localParam${i}`] = `Local Parameter ${i} is required`;
      } else if (inputTypes.local[`param${i}`] === "url") {
        try {
          new URL(formValue.localJson[`param${i}`]?.url);
        } catch {
          newErrors[`localParam${i}`] = `Local Parameter ${i} must be a valid URL`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUrlData = async (url, jsonType, field) => {
    try {
      setIsLoading(prev => ({
        ...prev,
        [jsonType === 'globalJson' ? 'global' : 'local']: {
          ...prev[jsonType === 'globalJson' ? 'global' : 'local'],
          [field]: true
        }
      }));

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setFormValue(prev => ({
        ...prev,
        [jsonType]: {
          ...prev[jsonType],
          [field]: { url: JSON.stringify(data) }
        }
      }));
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setErrors(prev => ({
        ...prev,
        [`${jsonType === 'globalJson' ? 'global' : 'local'}Param${field.replace('param', '')}`]: `Failed to fetch data: ${error.message}`
      }));
    } finally {
      setIsLoading(prev => ({
        ...prev,
        [jsonType === 'globalJson' ? 'global' : 'local']: {
          ...prev[jsonType === 'globalJson' ? 'global' : 'local'],
          [field]: false
        }
      }));
    }
  };

  const handleInputTypeChange = async (e, jsonType, field) => {
    const { value } = e.target;
    setIsFormChanged(true);
    setInputTypes(prev => ({
      ...prev,
      [jsonType]: {
        ...prev[jsonType],
        [field]: value
      }
    }));

    // Reset the form value for this field based on the new type
    const jsonField = jsonType === 'global' ? 'globalJson' : 'localJson';
    let newValue = {};
    
    if (value === 'static') {
      newValue = { staticValue: '' };
    } else if (value === 'url') {
      newValue = { url: '' };
    } else if (value === 'question') {
      newValue = { 
        questionId: '',
        answer_id: "15"
      };
    }

    setFormValue(prev => ({
      ...prev,
      [jsonField]: {
        ...prev[jsonField],
        [field]: newValue
      }
    }));
  };

  const handleChange = async (e, jsonType, field) => {
    const { value } = e.target;
    setIsFormChanged(true);
    
    const inputType = inputTypes[jsonType === 'globalJson' ? 'global' : 'local'][field];
    let newValue = {};

    if (inputType === 'static') {
      newValue = { staticValue: value };
    } else if (inputType === 'url') {
      newValue = { url: value };
      // Validate URL format
      try {
        if (value.trim()) {
          new URL(value);
          setErrors(prev => ({
            ...prev,
            [`${jsonType === 'globalJson' ? 'global' : 'local'}Param${field.replace('param', '')}`]: undefined
          }));
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          [`${jsonType === 'globalJson' ? 'global' : 'local'}Param${field.replace('param', '')}`]: 'Invalid URL format'
        }));
      }
    } else if (inputType === 'question') {
      newValue = { 
        questionId: value,
        answer_id: "15"
      };
    }

    setFormValue(prev => ({
      ...prev,
      [jsonType]: {
        ...prev[jsonType],
        [field]: newValue
      }
    }));
  };

  const handleOperatorChange = (e, field) => {
    const { value } = e.target;
    setIsFormChanged(true);
    setFormValue(prev => ({
      ...prev,
      operators: {
        ...prev.operators,
        [field]: value
      }
    }));
  };

  const handleMessageChange = (e, field, type) => {
    const { value } = e.target;
    setIsFormChanged(true);
    setFormValue(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [field]: {
          ...prev.messages[field],
          [type]: value
        }
      }
    }));
  };

  const handleDefaultMessageChange = (e) => {
    const { value } = e.target;
    setIsFormChanged(true);
    setFormValue(prev => ({
      ...prev,
      defaultMessage: value
    }));
  };

  const addParameter = () => {
    if (parameterCount < 5) {
      const newCount = parameterCount + 1;
      setParameterCount(newCount);
      setIsFormChanged(true);
      
      setFormValue(prev => ({
        ...prev,
        globalJson: {
          ...prev.globalJson,
          [`param${newCount}`]: { staticValue: "" }
        },
        localJson: {
          ...prev.localJson,
          [`param${newCount}`]: { staticValue: "" }
        },
        operators: {
          ...prev.operators,
          [`param${newCount}`]: ">"
        },
        messages: {
          ...prev.messages,
          [`param${newCount}`]: {
            fail: `Parameter ${newCount} validation failed: new value must be greater.`,
            success: `Parameter ${newCount} validation passed successfully.`
          }
        }
      }));

      setInputTypes(prev => ({
        global: {
          ...prev.global,
          [`param${newCount}`]: "static"
        },
        local: {
          ...prev.local,
          [`param${newCount}`]: "static"
        }
      }));
    }
  };

  const deleteParameter = (paramNumber) => {
    if (parameterCount > 1) {
      const newCount = parameterCount - 1;
      setParameterCount(newCount);
      setIsFormChanged(true);
      
      // Create new state objects without the deleted parameter
      const newGlobalJson = { ...formValue.globalJson };
      const newLocalJson = { ...formValue.localJson };
      const newOperators = { ...formValue.operators };
      const newMessages = { ...formValue.messages };
      const newGlobalInputTypes = { ...inputTypes.global };
      const newLocalInputTypes = { ...inputTypes.local };

      // Delete the parameter from all objects
      delete newGlobalJson[`param${paramNumber}`];
      delete newLocalJson[`param${paramNumber}`];
      delete newOperators[`param${paramNumber}`];
      delete newMessages[`param${paramNumber}`];
      delete newGlobalInputTypes[`param${paramNumber}`];
      delete newLocalInputTypes[`param${paramNumber}`];

      // Update state
      setFormValue(prev => ({
        ...prev,
        globalJson: newGlobalJson,
        localJson: newLocalJson,
        operators: newOperators,
        messages: newMessages
      }));

      setInputTypes({
        global: newGlobalInputTypes,
        local: newLocalInputTypes
      });
    }
  };

  const addNestedParameter = (parentParam) => {
    const nestedKey = `param${parentParam}_nested${Object.keys(formValue.nestedParams[parentParam] || {}).length + 1}`;
    
    setFormValue(prev => ({
      ...prev,
      nestedParams: {
        ...prev.nestedParams,
        [parentParam]: {
          ...(prev.nestedParams[parentParam] || {}),
          [nestedKey]: {
            globalJson: { staticValue: "" },
            localJson: { staticValue: "" },
            operator: ">",
            messages: {
              fail: `Nested validation failed`,
              success: `Nested validation passed`
            }
          }
        }
      }
    }));

    setInputTypes(prev => ({
      global: {
        ...prev.global,
        [nestedKey]: "static"
      },
      local: {
        ...prev.local,
        [nestedKey]: "static"
      }
    }));
  };

  const deleteNestedParameter = (parentParam, nestedKey) => {
    setFormValue(prev => {
      const newNestedParams = { ...prev.nestedParams };
      if (newNestedParams[parentParam]) {
        delete newNestedParams[parentParam][nestedKey];
        if (Object.keys(newNestedParams[parentParam]).length === 0) {
          delete newNestedParams[parentParam];
        }
      }
      return {
        ...prev,
        nestedParams: newNestedParams
      };
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (!isFormChanged) {
      alert("No changes have been made to the form. Please make changes before submitting.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    console.log('Form Data being submitted:', {
      globalJson: formValue.globalJson,
      localJson: formValue.localJson,
      operators: formValue.operators,
      messages: formValue.messages,
      defaultMessage: formValue.defaultMessage
    });

    onSubmit(formValue);
    setIsFormChanged(false);
  };

  const resetForm = () => {
    setFormValue({
      globalJson: {
        param1: { staticValue: "" }
      },
      localJson: {
        param1: { staticValue: "" }
      },
      operators: {
        param1: ">"
      },
      messages: {
        param1: {
          fail: "Parameter 1 validation failed: new value must be greater.",
          success: "Parameter 1 validation passed successfully."
        }
      },
      defaultMessage: "One or more fields did not satisfy the required condition.",
      nestedParams: {}
    });
    setInputTypes({
      global: {
        param1: "static"
      },
      local: {
        param1: "static"
      }
    });
    setParameterCount(1);
    setIsFormChanged(false);
    setErrors({});
    onReset && onReset();
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/save-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValue)
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus(`Saved successfully! (ID: ${data.fileName})`);
        setTimeout(() => setSaveStatus(""), 3000);
        resetForm();
      } else {
        setSaveStatus(`Failed to save: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving submission:', error);
      setSaveStatus(`Error saving data: ${error.message}`);
    }
  };

  const handleQuestionIdChange = (e, jsonType, field) => {
    const { value } = e.target;
    setQuestionIds(prev => ({
      ...prev,
      [jsonType]: {
        ...prev[jsonType],
        [field]: value
      }
    }));

    // Update the form value with the question ID and static answer_id
    setFormValue(prev => ({
      ...prev,
      [jsonType === 'global' ? 'globalJson' : 'localJson']: {
        ...prev[jsonType === 'global' ? 'globalJson' : 'localJson'],
        [field]: { 
          questionId: value,
          answer_id: "15"
        }
      }
    }));
  };

  return (
    <div className="form-container bg-white">
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        {Array.from({ length: parameterCount }, (_, i) => i + 1).map((num) => (
          <div key={`parameter-group-${num}`} className="parameter-group mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Parameter {num}</h4>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => addNestedParameter(`param${num}`)}
                >
                  <i className="fas fa-plus"></i> Add OR Condition
                </button>
                {parameterCount > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteParameter(num)}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
            </div>
            
            {/* Main Parameter */}
            <div className="row">
              {/* Global JSON */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label htmlFor={`globalParam${num}`} className="form-label">DB Values</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      style={{ maxWidth: '100px' }}
                      value={inputTypes.global[`param${num}`]}
                      onChange={(e) => handleInputTypeChange(e, 'global', `param${num}`)}
                    >
                      {inputTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {inputTypes.global[`param${num}`] === 'question' ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Question ID"
                        value={questionIds.global[`param${num}`] || ''}
                        onChange={(e) => handleQuestionIdChange(e, 'global', `param${num}`)}
                      />
                    ) : (
                      <input
                        type={inputTypes.global[`param${num}`] === 'url' ? 'url' : 'text'}
                        className="form-control"
                        id={`globalParam${num}`}
                        value={inputTypes.global[`param${num}`] === 'static' 
                          ? formValue.globalJson[`param${num}`]?.staticValue || ''
                          : formValue.globalJson[`param${num}`]?.url || ''}
                        onChange={(e) => handleChange(e, 'globalJson', `param${num}`)}
                        required
                        disabled={isLoading.global[`param${num}`]}
                      />
                    )}
                    {isLoading.global[`param${num}`] && (
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="fas fa-spinner fa-spin"></i>
                        </span>
                      </div>
                    )}
                  </div>
                  {errors[`globalParam${num}`] && <div className="text-danger small mt-1">{errors[`globalParam${num}`]}</div>}
                </div>
              </div>

              {/* Operator */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label htmlFor={`operator-param${num}`} className="form-label">Operator</label>
                  <select
                    className="form-select"
                    id={`operator-param${num}`}
                    value={formValue.operators[`param${num}`]}
                    onChange={(e) => handleOperatorChange(e, `param${num}`)}
                  >
                    {operatorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Local JSON */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label htmlFor={`localParam${num}`} className="form-label">Form Values</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      style={{ maxWidth: '100px' }}
                      value={inputTypes.local[`param${num}`]}
                      onChange={(e) => handleInputTypeChange(e, 'local', `param${num}`)}
                    >
                      {inputTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {inputTypes.local[`param${num}`] === 'question' ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Question ID"
                        value={questionIds.local[`param${num}`] || ''}
                        onChange={(e) => handleQuestionIdChange(e, 'local', `param${num}`)}
                      />
                    ) : (
                      <input
                        type={inputTypes.local[`param${num}`] === 'url' ? 'url' : 'text'}
                        className="form-control"
                        id={`localParam${num}`}
                        value={inputTypes.local[`param${num}`] === 'static'
                          ? formValue.localJson[`param${num}`]?.staticValue || ''
                          : formValue.localJson[`param${num}`]?.url || ''}
                        onChange={(e) => handleChange(e, 'localJson', `param${num}`)}
                        required
                        disabled={isLoading.local[`param${num}`]}
                      />
                    )}
                    {isLoading.local[`param${num}`] && (
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="fas fa-spinner fa-spin"></i>
                        </span>
                      </div>
                    )}
                  </div>
                  {errors[`localParam${num}`] && <div className="text-danger small mt-1">{errors[`localParam${num}`]}</div>}
                </div>
              </div>

              {/* Custom Message */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label className="form-label">Messages</label>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Fail Message"
                      value={formValue.messages[`param${num}`]?.fail || ''}
                      onChange={(e) => handleMessageChange(e, `param${num}`, 'fail')}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Success Message"
                      value={formValue.messages[`param${num}`]?.success || ''}
                      onChange={(e) => handleMessageChange(e, `param${num}`, 'success')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nested OR Conditions */}
            {formValue.nestedParams[`param${num}`] && Object.entries(formValue.nestedParams[`param${num}`]).map(([nestedKey, nestedValue]) => (
              <div key={nestedKey} className="nested-parameter mt-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">OR Condition</h5>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteNestedParameter(`param${num}`, nestedKey)}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
                <div className="row">
                  {/* Nested Global JSON */}
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label">DB Values</label>
                      <div className="input-group">
                        <select
                          className="form-select"
                          style={{ maxWidth: '100px' }}
                          value={inputTypes.global[nestedKey] || 'static'}
                          onChange={(e) => handleInputTypeChange(e, 'global', nestedKey)}
                        >
                          {inputTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          value={nestedValue.globalJson.staticValue || ''}
                          onChange={(e) => {
                            setFormValue(prev => ({
                              ...prev,
                              nestedParams: {
                                ...prev.nestedParams,
                                [`param${num}`]: {
                                  ...prev.nestedParams[`param${num}`],
                                  [nestedKey]: {
                                    ...prev.nestedParams[`param${num}`][nestedKey],
                                    globalJson: { staticValue: e.target.value }
                                  }
                                }
                              }
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nested Operator */}
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label">Operator</label>
                      <select
                        className="form-select"
                        value={nestedValue.operator}
                        onChange={(e) => {
                          setFormValue(prev => ({
                            ...prev,
                            nestedParams: {
                              ...prev.nestedParams,
                              [`param${num}`]: {
                                ...prev.nestedParams[`param${num}`],
                                [nestedKey]: {
                                  ...prev.nestedParams[`param${num}`][nestedKey],
                                  operator: e.target.value
                                }
                              }
                            }
                          }));
                        }}
                      >
                        {operatorOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nested Local JSON */}
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label">Form Values</label>
                      <div className="input-group">
                        <select
                          className="form-select"
                          style={{ maxWidth: '100px' }}
                          value={inputTypes.local[nestedKey] || 'static'}
                          onChange={(e) => handleInputTypeChange(e, 'local', nestedKey)}
                        >
                          {inputTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          value={nestedValue.localJson.staticValue || ''}
                          onChange={(e) => {
                            setFormValue(prev => ({
                              ...prev,
                              nestedParams: {
                                ...prev.nestedParams,
                                [`param${num}`]: {
                                  ...prev.nestedParams[`param${num}`],
                                  [nestedKey]: {
                                    ...prev.nestedParams[`param${num}`][nestedKey],
                                    localJson: { staticValue: e.target.value }
                                  }
                                }
                              }
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nested Messages */}
                  <div className="col-md-3">
                    <div className="form-group mb-3">
                      <label className="form-label">Messages</label>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Fail Message"
                          value={nestedValue.messages.fail || ''}
                          onChange={(e) => {
                            setFormValue(prev => ({
                              ...prev,
                              nestedParams: {
                                ...prev.nestedParams,
                                [`param${num}`]: {
                                  ...prev.nestedParams[`param${num}`],
                                  [nestedKey]: {
                                    ...prev.nestedParams[`param${num}`][nestedKey],
                                    messages: {
                                      ...prev.nestedParams[`param${num}`][nestedKey].messages,
                                      fail: e.target.value
                                    }
                                  }
                                }
                              }
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Success Message"
                          value={nestedValue.messages.success || ''}
                          onChange={(e) => {
                            setFormValue(prev => ({
                              ...prev,
                              nestedParams: {
                                ...prev.nestedParams,
                                [`param${num}`]: {
                                  ...prev.nestedParams[`param${num}`],
                                  [nestedKey]: {
                                    ...prev.nestedParams[`param${num}`][nestedKey],
                                    messages: {
                                      ...prev.nestedParams[`param${num}`][nestedKey].messages,
                                      success: e.target.value
                                    }
                                  }
                                }
                              }
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Add Parameter Button */}
        {parameterCount < 5 && (
          <div className="row mb-4">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addParameter}
              >
                <i className="fas fa-plus"></i> Add AND Condition
              </button>
            </div>
          </div>
        )}

        {/* Default Message */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="defaultMessage" className="form-label">Default Message</label>
              <input
                type="text"
                className="form-control"
                id="defaultMessage"
                value={formValue.defaultMessage}
                onChange={handleDefaultMessageChange}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="form-group">
              <button className="btn btn-primary px-4" type="submit">
                Submit
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group d-flex justify-content-center">
              <button 
                type="button" 
                className="btn btn-success px-4" 
                onClick={handleSave}
              >
                Save
              </button>
              {saveStatus && (
                <span className="ms-2 text-success">{saveStatus}</span>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary px-4" 
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
