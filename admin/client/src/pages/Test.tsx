import { useState, useRef } from 'react';
import axios from 'axios';

interface TestProps {
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

interface RecognitionResult {
  success: boolean;
  recognized: boolean;
  person_name: string;
  confidence: number;
  description: string | null;
  face_bbox: number[];
  top_matches: { name: string; score: number }[];
  processing_time: number;
  error?: string;
}

export default function Test({ showToast }: TestProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleTest = async () => {
    if (!selectedFile) {
      showToast('Please select an image first', 'warning');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      if (response.data.success) {
        if (response.data.recognized) {
            showToast(`Recognized: ${response.data.person_name}`, 'success');
        } else {
            showToast('Face detected but not recognized', 'warning');
        }
      } else {
        showToast(response.data.error || 'Recognition failed', 'error');
      }
    } catch (error: any) {
      console.error('Recognition error:', error);
      showToast(error.response?.data?.error || 'Failed to connect to recognition service', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Test Recognition</h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload an image to test face recognition against the database</p>
      </header>

      <div className="dashboard-grid">
        {/* Upload Card */}
        <div className="dashboard-card">
          <div className="card-header-modern">
            <div className="header-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width: '22px', height: '22px', color: 'var(--primary)'}}>
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
              </svg>
              <span>Upload Image</span>
            </div>
          </div>

          <div 
            className="drop-zone"
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            style={{ 
                cursor: selectedFile ? 'default' : 'pointer',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
          >
            {previewUrl ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', display: 'block', margin: '0 auto' }} 
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                  className="btn-delete"
                  style={{ 
                      position: 'absolute', 
                      top: '-10px', 
                      right: '10px', 
                      backgroundColor: 'var(--danger)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '30px', 
                      height: '30px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px'}}>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="drop-zone-content">
                <div className="drop-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <span className="drop-text">Click or drag image here</span>
                <span className="drop-subtext">Supports JPG, PNG, WebP</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn-modern primary"
              onClick={handleTest}
              disabled={!selectedFile || isLoading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', marginRight: '10px' }}></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  Run Recognition Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Card */}
        <div className="dashboard-card">
            <div className="card-header-modern">
                <div className="header-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width: '22px', height: '22px', color: 'var(--primary)'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span>Recognition Results</span>
                </div>
            </div>

            <div className="sync-content">
                {!result && !isLoading && (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" opacity=".3"/>
                            <path d="M11 7h2v2h-2zm0 4h2v6h-2z"/>
                        </svg>
                        <p>Results will appear here after analysis</p>
                    </div>
                )}

                {isLoading && (
                    <div className="loading">
                        <div className="spinner large"></div>
                        <p style={{ marginLeft: '15px' }}>Analyzing face features...</p>
                    </div>
                )}

                {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ 
                            padding: '15px', 
                            borderRadius: '10px', 
                            backgroundColor: result.success ? (result.recognized ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)') : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${result.success ? (result.recognized ? 'var(--success)' : 'var(--warning)') : 'var(--danger)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                backgroundColor: result.success ? (result.recognized ? 'var(--success)' : 'var(--warning)') : 'var(--danger)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                {result.success ? (result.recognized ? '✓' : '?') : '!'}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                                    {result.success ? (result.recognized ? result.person_name : 'Unknown') : 'Error'}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
                                    {result.success ? `Confidence: ${(result.confidence * 100).toFixed(1)}%` : result.error}
                                </p>
                            </div>
                        </div>

                        {result.description && (
                            <div className="person-info" style={{ marginBottom: 0 }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Description</div>
                                {result.description}
                            </div>
                        )}

                        <div>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Top Matches</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {result.top_matches.map((match, idx) => (
                                    <div key={idx} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'between', 
                                        alignItems: 'center', 
                                        padding: '10px', 
                                        background: 'var(--bg)', 
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}>
                                        <span style={{ flex: 1, fontWeight: 500 }}>{match.name}</span>
                                        <span style={{ 
                                            background: match.score > 0.6 ? 'var(--success)' : 'var(--border)', 
                                            color: match.score > 0.6 ? 'white' : 'var(--text)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {(match.score * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Processing Time: {result.processing_time.toFixed(3)}s
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}