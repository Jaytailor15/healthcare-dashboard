import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    file: null
  });
  
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('No file selected');
  const [submitStatus, setSubmitStatus] = useState('');
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Name can only contain letters';
        return '';
      case 'age':
        if (!value) return 'Age is required';
        if (value < 0) return 'Age cannot be negative';
        if (value > 150) return 'Please enter a valid age';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          file: 'File size should not exceed 5MB'
        }));
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setErrors(prev => ({
          ...prev,
          file: 'Invalid file type. Please upload PDF, DOC, DOCX, JPG or PNG'
        }));
        e.target.value = '';
        return;
      }

      setFormData(prevState => ({
        ...prevState,
        file: file
      }));
      setFileName(file.name);
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    } else {
      setFileName('No file selected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        age: true,
        file: true
      });
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({ name: '', age: '', file: null });
        setFileName('No file selected');
        setSubmitStatus('');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Healthcare Portal</h1>
          <p className="subtitle">Patient Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter patient's full name"
              className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
            />
            {touched.name && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter patient's age"
              min="0"
              max="150"
              className={`form-input ${touched.age && errors.age ? 'error' : ''}`}
            />
            {touched.age && errors.age && (
              <span className="error-message">{errors.age}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="file">Medical Records</label>
            <div className={`file-input-wrapper ${errors.file ? 'error' : ''} ${formData.file ? 'file-uploaded' : ''}`}>
              <div className="file-input-content">
                {formData.file ? (
                  <>
                    <span className="file-name" title={fileName}>
                      {fileName}
                    </span>
                    <button 
                      type="button" 
                      className="file-remove-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, file: null }));
                        setFileName('No file selected');
                        setErrors(prev => ({ ...prev, file: '' }));
                        const fileInput = document.getElementById('file');
                        if (fileInput) {
                          fileInput.value = '';
                        }
                      }}
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="no-file">No file chosen</span>
                )}
              </div>
              <label htmlFor="file" className="file-select-label">
                Choose File
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>
            <span className="file-info">Maximum file size: 5MB</span>
            {errors.file && (
              <span className="error-message">{errors.file}</span>
            )}
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${submitStatus === 'loading' ? 'loading' : ''}`}
            disabled={submitStatus === 'loading'}
          >
            {submitStatus === 'loading' ? 'Processing...' : 'Submit Registration'}
          </button>

          {submitStatus === 'success' && (
            <div className="status-message success">
              Registration completed successfully
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="status-message error">
              Registration failed. Please try again
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Dashboard; 