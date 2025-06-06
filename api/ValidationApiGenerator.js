import React, { useState, useEffect } from "react";
import ValidationForm from "./ValidationForm";

const ValidationApiGenerator = () => {
    const [output, setOutput] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [savedUseCases, setSavedUseCases] = useState([]);
    const [selectedUseCase, setSelectedUseCase] = useState(null);

    useEffect(() => {
        fetchSavedUseCases();
    }, []);

    const fetchSavedUseCases = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/regular-forms');
            const data = await response.json();
            if (data.success) {
                const useCases = data.forms.map(form => ({
                    value: form.id,
                    label: form.linked_mainaudit_id || 'Unnamed Use Case',
                    data: form
                }));
                setSavedUseCases(useCases);
            }
        } catch (error) {
            console.error('Error fetching use cases:', error);
        }
    };

    const handleUseCaseChange = (selectedOption) => {
        setSelectedUseCase(selectedOption);
    };

    const handleSubmit = submission => {
        const baseUrl = 'https://flask.dfos.co/scalable_apis/dynamicapi.php';
        const params = new URLSearchParams();
        
        // Format the validation rules with AND/OR logic
        const formattedRules = {
            operator: "AND",
            rules: Object.entries(submission.globalJson).map(([paramKey, globalValue]) => {
                const paramNum = paramKey.replace('param', '');
                const localValue = submission.localJson[paramKey];
                const operator = submission.operators[paramKey];
                const messages = submission.messages[paramKey];
                
                // Check if this parameter has nested OR conditions
                const nestedParams = submission.nestedParams?.[paramKey];
                
                if (nestedParams && Object.keys(nestedParams).length > 0) {
                    // Create OR group for this parameter
                    return {
                        operator: "OR",
                        rules: [
                            // Main condition
                            {
                                globalValue,
                                operator,
                                localValue,
                                messages
                            },
                            // Nested OR conditions
                            ...Object.entries(nestedParams).map(([nestedKey, nestedValue]) => ({
                                globalValue: nestedValue.globalJson,
                                operator: nestedValue.operator,
                                localValue: nestedValue.localJson,
                                messages: nestedValue.messages
                            }))
                        ]
                    };
                } else {
                    // Single condition without OR
                    return {
                        globalValue,
                        operator,
                        localValue,
                        messages
                    };
                }
            })
        };

        // Create the final JSON structure
        const formAnswerJson = {
            validation_rules: formattedRules,
            default_message: submission.defaultMessage
        };
        
        // Add the parameters as they are expected by the PHP API
        params.append('linked_mainaudit_id', submission.linked_mainaudit_id);
        params.append('form_answer_json', JSON.stringify(formAnswerJson));
        
        const formattedOutput = `${baseUrl}?${params.toString()}`;
        
        // Display the formatted JSON in the output box
        setOutput(JSON.stringify(formAnswerJson, null, 2));
        setCopySuccess("");
        setResponse(null);
        setError(null);
    };

    const handleReset = () => {
        setOutput("");
        setCopySuccess("");
        setResponse(null);
        setError(null);
        setSelectedUseCase(null);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
    };

    const handleTest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(output, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    linked_mainaudit_id: selectedUseCase?.data.linked_mainaudit_id,
                    form_answer_json: JSON.stringify(selectedUseCase?.data.form_answer_json)
                })
            });
            const data = await response.json();
            setResponse(data);
        } catch (err) {
            setError("Failed to fetch response. Please check the URL and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container px-5">
            <h3 className="text-left mb-4 pt-4">Sheet Production Validation API</h3>
            
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Select Saved Use Case</label>
                        <select
                            className="form-select"
                            value={selectedUseCase?.value || ''}
                            onChange={(e) => {
                                const option = savedUseCases.find(uc => uc.value === e.target.value);
                                handleUseCaseChange(option || null);
                            }}
                        >
                            <option value="">Select a saved use case</option>
                            {savedUseCases.map(useCase => (
                                <option key={useCase.value} value={useCase.value}>
                                    {useCase.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <ValidationForm 
                onSubmit={handleSubmit} 
                onReset={handleReset}
                initialData={selectedUseCase?.data}
            />
            <div 
                className="my-4" 
                style={{
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, #dee2e6, transparent)'
                }}
            />
            <div>
                <h3 className="mb-3">Generated API URL:</h3>
                <div className="position-relative">
                    <pre
                        className="mt-2 p-4"
                        style={{ backgroundColor: "rgb(230, 230, 230)" }}
                    >
                        <code>{output}</code>
                    </pre>
                    {output && (
                        <div className="position-absolute top-0 end-0 p-2">
                            <button 
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={handleCopy}
                            >
                                {copySuccess || "Copy"}
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={handleTest}
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Test"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {(response || error) && (
                <div className="mt-4">
                    <h3 className="mb-3">API Response:</h3>
                    <div className="position-relative">
                        <pre
                            className="mt-2 p-4"
                            style={{ 
                                backgroundColor: "rgb(230, 230, 230)",
                                maxHeight: "400px",
                                overflowY: "auto"
                            }}
                        >
                            <code>
                                {error ? (
                                    <span className="text-danger">{error}</span>
                                ) : (
                                    JSON.stringify(response, null, 2)
                                )}
                            </code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValidationApiGenerator;