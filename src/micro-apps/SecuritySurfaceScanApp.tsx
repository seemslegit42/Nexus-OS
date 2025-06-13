
'use client';

import React, { useState } from 'react';

const SecuritySurfaceScanApp: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // scanResult can be used later to display actual results
  // const [scanResult, setScanResult] = useState<string | null>(null);

  const isValidTarget = (target: string): boolean => {
    if (!target.trim()) {
      setError("Target cannot be empty.");
      return false;
    }
    if (/\s/.test(target)) {
      setError("Target cannot contain spaces.");
      return false;
    }
    if (!target.includes('.')) {
      setError("Target must be a valid domain or URL (e.g., example.com or http://example.com).");
      return false;
    }
    // Basic check for protocol, could be more robust
    if (!/^(?:[a-zA-Z]+:\/\/)/.test(target) && target.includes('/')) {
        setError("Invalid URL format. If including a path, ensure a protocol (e.g., http://) is present.");
        return false;
    }
    return true;
  };

  const handleScan = () => {
    setError(null); // Clear previous errors
    // setScanResult(null); // Clear previous results

    if (!isValidTarget(targetUrl.trim())) {
      setIsLoading(false); // Ensure loading is false if validation fails early
      return;
    }

    setIsLoading(true);
    console.log('Scan initiated for:', targetUrl.trim());
    // Simulate scan initiation. Actual scan logic will be added later.
    // For now, the loading state will persist.
    // In a real scenario, you would make an API call here and then set isLoading to false
    // and update scanResult based on the API response.
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Security Surface Scan</h2>
      
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <label htmlFor="target-url" style={{ display: 'block', marginBottom: '5px' }}>
          Enter Domain or URL:
        </label>
        <input
          type="text"
          id="target-url"
          value={targetUrl}
          onChange={(e) => {
            setTargetUrl(e.target.value);
            if (error) setError(null); // Clear error on input change
          }}
          placeholder="e.g., example.com or https://example.com"
          style={{ width: '300px', padding: '8px', marginRight: '10px', border: '1px solid #ccc' }}
          disabled={isLoading}
        />
        <button
          onClick={handleScan}
          style={{ 
            padding: '8px 15px', 
            border: '1px solid #007bff', 
            background: isLoading ? '#ccc' : '#007bff', 
            color: 'white', 
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', fontSize: '0.9em', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '20px', border: '1px dashed #eee', padding: '20px', minHeight: '100px' }}>
        {isLoading ? (
          <p style={{ color: '#555', textAlign: 'center' }}>Loading scan...</p>
        ) : (
          // scanResult ? <pre>{scanResult}</pre> : // Placeholder for actual results display
          <p style={{ color: '#777', textAlign: 'center' }}>Scan results will appear here...</p>
        )}
      </div>
    </div>
  );
};

export default SecuritySurfaceScanApp;
