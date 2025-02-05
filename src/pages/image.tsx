import React, { useState, useRef, useEffect } from 'react';

const ImageUploader = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [uploadsRemaining, setUploadsRemaining] = useState(5);
  const [currentMarkupIndex, setCurrentMarkupIndex] = useState(0);
  
  const canvasRefs = useRef([]);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setPreview(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  useEffect(() => {
    if (preview && analysis?.data?.markup) {
      analysis.data.markup.forEach((_, index) => {
        drawShapeOnCanvas(index);
      });
    }
  }, [preview, analysis, currentMarkupIndex]);

  const drawShapeOnCanvas = (index) => {
    if (!canvasRefs.current[index] || !analysis?.data?.markup) return;
    
    const canvas = canvasRefs.current[index];
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    const convertToPixels = (value, dimension, isHeight = false) => {
      if (typeof value !== 'number') return 0;
      return value * (isHeight ? dimension.height : dimension.width) / 100;
    };

    const drawShape = (shape, coordinates, color) => {
      ctx.strokeStyle = color || '#ff0000';
      ctx.fillStyle = `${color}33` || '#ff000033';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      
      if (shape === 'circle' && coordinates.circle) {
        const { cx, cy, radius } = coordinates.circle;
        const x = convertToPixels(cx, canvas);
        const y = convertToPixels(cy, canvas);
        const r = convertToPixels(radius, canvas);
        ctx.arc(x, y, r, 0, 2 * Math.PI);
      } else if (shape === 'rectangle' && coordinates.rectangle) {
        const { x, y, width, height } = coordinates.rectangle;
        const px = convertToPixels(x, canvas);
        const py = convertToPixels(y, canvas);
        const pw = convertToPixels(width, canvas);
        const ph = convertToPixels(height, canvas);
        ctx.rect(px, py, pw, ph);
      }
      
      ctx.stroke();
      ctx.fill();
    };

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw original image
      ctx.drawImage(image, 0, 0);

      // Draw only the current shape
      const markup = analysis.data.markup[index];
      if (markup.coordinates.unit === '%') {
        drawShape(markup.shape, markup.coordinates, markup.color);
      }

      // Add title for the annotation
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(10, 10, canvas.width - 20, 30);
      ctx.fillStyle = markup.color || '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Annotation ${index + 1}`, 20, 30);
    };

    image.src = preview;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || loading) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/v1/image-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysis(result);
      setUploadsRemaining(prev => prev - 1);
      setCurrentMarkupIndex(0);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreRating = (score) => {
    if (score >= 9) return { text: 'Excellent', color: 'bg-green-500' };
    if (score >= 7) return { text: 'Very Good', color: 'bg-blue-500' };
    if (score >= 5) return { text: 'Good', color: 'bg-yellow-500' };
    if (score >= 3) return { text: 'Needs Improvement', color: 'bg-orange-500' };
    return { text: 'Poor', color: 'bg-red-500' };
  };

  const ScoreIndicator = ({ score, label }) => {
    const [isVisible, setIsVisible] = useState(false);
    const rating = getScoreRating(score);
    const circumference = 2 * Math.PI * 40; // radius = 40
    const strokeDashoffset = circumference - (score / 10) * circumference;

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="flex flex-col items-center p-4">
        <div className="relative w-24 h-24">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Animated progress circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={`${rating.color} transition-all duration-1000 ease-out`}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: isVisible ? strokeDashoffset : circumference,
              }}
            />
          </svg>
          {/* Rating text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-sm font-semibold ${rating.color.replace('bg-', 'text-')}`}>
              {rating.text}
            </span>
          </div>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600">
          {label.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </div>
    );
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Image Analysis</h2>
        <div className="text-sm text-gray-600">
          {uploadsRemaining} uploads remaining today
        </div>
      </div>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef => inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setFile(null);
                  setPreview('');
                  setAnalysis(null);
                }}
                className="text-red-600 hover:text-red-700 mr-4"
              >
                Remove
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Image'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-500"
            >
              Click to upload
            </button>
            <p className="text-gray-500 text-sm mt-2">or drag and drop</p>
            <p className="text-gray-400 text-xs mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {analysis?.data?.markup && (
        <div className="mt-8 space-y-6">
          {analysis.data.markup.map((markup, index) => (
            <div key={index} className="bg-white rounded-lg border p-6">
              <div className="flex flex-col space-y-4">
                <canvas
                  ref={el => canvasRefs.current[index] = el}
                  className="max-w-full rounded-lg"
                />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Annotation {index + 1}</h4>
                  <p className="text-gray-600">{markup.comment}</p>
                  {markup.suggested_action && (
                    <p className="text-blue-600 mt-2">
                      Suggestion: {markup.suggested_action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">General Analysis</h3>
            <p className="text-gray-600">{analysis.data.analysis}</p>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-6">Technical Assessment</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(analysis.data.scores).map(([key, value]) => (
                <ScoreIndicator
                  key={key}
                  score={value}
                  label={key}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
            {Object.entries(analysis.data.suggestions).map(([category, items]) => (
              <div key={category} className="mb-4 last:mb-0">
                <h4 className="font-medium text-gray-700 mb-2">
                  {category.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              {Object.entries(analysis.data.extras).filter(([key]) => 
                typeof analysis.data.extras[key] === 'string'
              ).map(([key, value]) => (
                <div key={key}>
                  <h4 className="font-medium text-gray-700">
                    {key.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h4>
                  <p className="mt-1 text-gray-600">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;