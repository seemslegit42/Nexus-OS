
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
    // If a path is included, a protocol is typically expected.
    if (!/^(?:[a-zA-Z]+:\/\/)/.test(target) && target.includes('/')) {
        setError("Invalid URL format. If including a path, ensure a protocol (e.g., http://) is present.");
        return false;
    }
    return true;
  };

  const handleScanSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors
    // setScanResult(null); // Clear previous results

    const trimmedTarget = targetUrl.trim();

    if (!isValidTarget(trimmedTarget)) {
      setIsLoading(false); // Ensure loading is false if validation fails early
      return;
    }

    setIsLoading(true);
    console.log('Scan initiated for:', trimmedTarget);
    // Simulate scan initiation. Actual scan logic will be added later.
    // For now, the loading state will persist until manually changed.
    // In a real scenario, you would make an API call here.
    // For this step, we'll just keep it loading.
    // setTimeout(() => {
    //   setIsLoading(false);
    //   setScanResult(`Simulated scan results for ${trimmedTarget}`);
    // }, 3000);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'var(--foreground)' }}>
      <h2>Security Surface Scan</h2>
      
      <form onSubmit={handleScanSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
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
            style={{ 
                width: '300px', 
                padding: '8px', 
                marginRight: '10px', 
                border: error ? '1px solid red' : '1px solid #ccc',
                backgroundColor: 'var(--input)',
                color: 'var(--foreground)',
            }}
            disabled={isLoading}
            aria-invalid={!!error}
            aria-describedby={error ? "target-error" : undefined}
          />
          <button
            type="submit"
            style={{ 
              padding: '8px 15px', 
              border: '1px solid var(--primary)', 
              background: isLoading ? '#ccc' : 'var(--primary)', 
              color: isLoading ? 'var(--muted-foreground)' : 'var(--primary-foreground)', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {error && (
          <div id="target-error" style={{ color: 'red', fontSize: '0.9em', marginBottom: '10px' }}>
            {error}
          </div>
        )}
      </form>

      <div style={{ marginTop: '20px', border: '1px dashed #eee', padding: '20px', minHeight: '100px', background: 'var(--card)', borderRadius: '8px' }}>
        {isLoading ? (
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>Scanning target: {targetUrl}...</p>
        ) : (
          // scanResult ? <pre>{scanResult}</pre> : // Placeholder for actual results display
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>Scan results will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default SecuritySurfaceScanApp;
