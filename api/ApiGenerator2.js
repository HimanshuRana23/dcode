import React, { useState } from "react";
import Form2 from "./Form2";

const ApiGenerator2 = () => {
    const [output, setOutput] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = submission => {
        const filterString = submission.filters
            .filter(filter => filter.type && filter.value)
            .map(filter => `"${filter.type}":${filter.value}`)
            .join(',');
        
        const formattedOutput = `https://flask.dfos.co/scalable_apis/dynamicapi.php?server=${submission.server}&table=${submission.table}&columns=${submission.columns.join(',')}&conditions=${filterString ? `{${filterString}}` : ''}`;
        
        setOutput(formattedOutput);
        setCopySuccess("");
        setResponse(null);
        setError(null);
    };

    const handleReset = () => {
        setOutput("");
        setCopySuccess("");
        setResponse(null);
        setError(null);
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
            const response = await fetch(output);
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
            <h3 className="text-left mb-4 pt-4">Data Access-Point Generation</h3>
            <Form2 onSubmit={handleSubmit} onReset={handleReset} />
            <div 
                className="my-4" 
                style={{
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, #dee2e6, transparent)'
                }}
            />
            <div>
                <h3 className="mb-3">Output:</h3>
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
                    <h3 className="mb-3">Response:</h3>
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

export default ApiGenerator2;