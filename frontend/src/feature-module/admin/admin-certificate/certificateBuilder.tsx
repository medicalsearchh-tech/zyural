// src/pages/admin/CertificateBuilder.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi, certificateApi } from '../../../core/utils/api';
import { toast } from 'react-toastify';
import type { CertificateTemplate, CertificateElement } from '../../../core/common/interface';
import ProfileCard from '../common/profileCard';

interface Position {
  x: number;
  y: number;
}

interface Course {
  value: string;
  label: string;
}

interface ElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: number;
  lineHeight?: number;
  opacity?: number;
  rotation?: number;
}

const CertificateBuilder = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);
  
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedElement, setSelectedElement] = useState<CertificateElement | null>(null);
  const [elements, setElements] = useState<CertificateElement[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 850 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [scale, setScale] = useState(0.6);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Toolbar states
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'dynamic'>('select');
  const [showProperties, setShowProperties] = useState(true);
  const [showElementsPanel, setShowElementsPanel] = useState(true);

  // Sample data for preview
  const sampleData = {
    studentName: "John Michael Smith",
    courseTitle: "Advanced Medical Certification Course",
    completionDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    certificateNumber: "CERT-2024-ABC123XYZ",
    instructorName: "Dr. Sarah Johnson, MD",
    creditHours: "8.5",
    creditType: "CME",
    accreditationBody: "American Medical Association",
    issueDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  // Available dynamic fields
  const dynamicFields = [
    { key: 'studentName', label: 'Student Name', sample: sampleData.studentName },
    { key: 'courseTitle', label: 'Course Title', sample: sampleData.courseTitle },
    { key: 'completionDate', label: 'Completion Date', sample: sampleData.completionDate },
    { key: 'certificateNumber', label: 'Certificate Number', sample: sampleData.certificateNumber },
    { key: 'instructorName', label: 'Instructor Name', sample: sampleData.instructorName },
    { key: 'creditHours', label: 'Credit Hours', sample: sampleData.creditHours },
    { key: 'creditType', label: 'Credit Type', sample: sampleData.creditType },
    { key: 'accreditationBody', label: 'Accreditation Body', sample: sampleData.accreditationBody },
    { key: 'issueDate', label: 'Issue Date', sample: sampleData.issueDate }
  ];

  // Font options
  const fontOptions = [
    'Arial', 'Times New Roman', 'Georgia', 'Helvetica', 
    'Roboto', 'Montserrat', 'Playfair Display', 'Open Sans'
  ];

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    } else {
      createNewTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await certificateApi.getTemplate(templateId!);
      if (response.success && response.data?.template) {
        const templateData = response.data.template;
        setTemplate(templateData);
        setElements(templateData.designConfig?.elements || []);
        setCanvasSize({
          width: templateData.designConfig?.canvas?.width || 1200,
          height: templateData.designConfig?.canvas?.height || 850
        });
        
        // Set the course if template has one
        if (templateData.courseId) {
          setSelectedCourseId(templateData.courseId);
        }

        // Set background image preview if exists
        if (templateData.backgroundImageUrl) {
          setBackgroundImagePreview(templateData.backgroundImageUrl);
        }
      } else {
        toast.error('Failed to load template');
        navigate('/admin/admin-certificate');
      }
    } catch (error: any) {
      console.error('Error loading template:', error);
      toast.error(error.message || 'Failed to load template');
      navigate('/admin/admin-certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTemplate = () => {
    const newTemplate: Partial<CertificateTemplate> = {
      name: 'New Certificate Template',
      description: '',
      designConfig: {
        canvas: { width: 1200, height: 850, backgroundColor: '#FFFFFF', backgroundImage:'' },
        elements: []
      },
      dynamicFields: {
        studentName: { enabled: true, required: true, label: 'Student Name' },
        courseTitle: { enabled: true, required: true, label: 'Course Title' },
        completionDate: { enabled: true, required: true, label: 'Completion Date' },
        certificateNumber: { enabled: true, required: true, label: 'Certificate Number' },
        instructorName: { enabled: false, required: false, label: 'Instructor Name' },
        creditHours: { enabled: false, required: false, label: 'Credit Hours' },
        creditType: { enabled: false, required: false, label: 'Credit Type' },
        accreditationBody: { enabled: false, required: false, label: 'Accreditation Body' },
        customFields: []
      }
    };
    setTemplate(newTemplate as CertificateTemplate);
    setElements([]);
    setIsLoading(false);
  };

  const fetchCourses = async () => {
    try {
      const response = await adminApi.getAdminCourses({ limit: 100 });
      if (response.success && response.data) {
        const courseOptions = response.data.courses.map((course: any) => ({
          value: course.id,
          label: course.title
        }));
        setCourses(courseOptions);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 15MB');
      return;
    }

    setBackgroundImage(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setBackgroundImagePreview(previewUrl);

    // Update template with background image
    if (template) {
      setTemplate({
        ...template,
        backgroundImageUrl: previewUrl
      });
    }
  };

  const removeBackgroundImage = () => {
    setBackgroundImage(null);
    setBackgroundImagePreview(null);
    if (template) {
      setTemplate({
        ...template,
        backgroundImageUrl: null
      });
    }
  };

  const addTextElement = () => {
    const newElement: CertificateElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: 50, y: 50 },
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
      },
      content: 'New Text Element'
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const addDynamicField = (fieldKey: string) => {
    const field = dynamicFields.find(f => f.key === fieldKey);
    if (!field) return;

    const newElement: CertificateElement = {
      id: `dynamic-${Date.now()}`,
      type: 'dynamic-field',
      position: { x: 50, y: 50 },
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
      },
      fieldType: fieldKey as any
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const updateElementPosition = (elementId: string, newPosition: Position) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, position: newPosition } : el
    ));
    
    // Update selected element in real-time while dragging
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, position: newPosition } : null);
    }
  };

  const updateElementStyle = (elementId: string, styleUpdates: Partial<ElementStyle>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { 
        ...el, 
        style: { ...el.style, ...styleUpdates } 
      } : el
    ));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { 
        ...prev, 
        style: { ...prev.style, ...styleUpdates } 
      } : null);
    }
  };

  const updateElementContent = (elementId: string, content: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, content } : el
    ));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, content } : null);
    }
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const getElementContent = (element: CertificateElement): string => {
    if (element.type === 'dynamic-field' && element.fieldType) {
      return sampleData[element.fieldType as keyof typeof sampleData] || element.fieldType;
    }
    return element.content || 'Empty';
  };

  const saveTemplate = async () => {
    if (!template) return;

    // Validate course selection for new templates
    if (!templateId && !selectedCourseId) {
      toast.error('Please select a course for this template');
      return;
    }

    try {
      setIsSaving(true);
      
      const designConfig = {
        canvas: {
          ...canvasSize,
          backgroundColor: template.designConfig?.canvas?.backgroundColor || '#FFFFFF',
          backgroundImage: template.backgroundImageUrl
        },
        elements: elements
      };

      let response;
      if (templateId) {
        // Update existing template with background image
        const formData = new FormData();
        formData.append('name', template.name);
        formData.append('description', template.description || '');
        formData.append('designConfig', JSON.stringify(designConfig));
        
        // Append background image if selected
        if (backgroundImage) {
          formData.append('backgroundImage', backgroundImage);
        }
        
        response = await certificateApi.updateTemplate(templateId, formData);
      } else {
        // Create new template with background image
        const formData = new FormData();
        formData.append('name', template.name);
        formData.append('description', template.description || '');
        formData.append('courseId', selectedCourseId);
        formData.append('isGlobal', 'false');
        formData.append('designConfig', JSON.stringify(designConfig));
        
        // Append background image if selected
        if (backgroundImage) {
          formData.append('backgroundImage', backgroundImage);
        }
        
        response = await certificateApi.createTemplate(formData);
      }

      if (response.success) {
        toast.success('Template saved successfully!');
        if (!templateId && response.data?.template) {
          navigate(`/admin/certificate-builder/${response.data.template.id}`);
        }
      } else {
        toast.error(response.message || 'Failed to save template');
      }
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error(error.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const publishTemplate = async () => {
    if (!templateId) {
      toast.error('Please save the template first before publishing');
      return;
    }

    try {
      const response = await certificateApi.publishTemplate(templateId);
      if (response.success) {
        toast.success('Template published successfully!');
        navigate('/admin/admin-certificate');
      } else {
        toast.error(response.message || 'Failed to publish template');
      }
    } catch (error: any) {
      console.error('Error publishing template:', error);
      toast.error(error.message || 'Failed to publish template');
    }
  };

  const handleCanvasClick = (_e: React.MouseEvent) => {
    if (activeTool === 'text') {
      addTextElement();
    }
  };

  if (isLoading) {
    return (
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <div className="col-lg-9">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading certificate builder...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .file-upload {
          transition: all 0.3s ease;
          border: 2px dashed #dee2e6;
        }
        .file-upload:hover {
          border-color: #007bff;
          background-color: #f8f9fa;
        }
        .element {
          transition: border-color 0.2s ease;
        }
        .element:hover {
          border: 1px dashed #007bff !important;
        }
        .element.selected {
          border: 2px solid #007bff !important;
        }
        .element.dragging {
          opacity: 0.8;
          cursor: grabbing !important;
        }
        .canvas-container {
          cursor: ${activeTool === 'text' ? 'crosshair' : 'default'};
          background-color: ${template?.designConfig?.canvas?.backgroundColor || '#FFFFFF'};
        }
      `}</style>
      <div className="content">
        <div className="container-fluid">
          <ProfileCard />
          <div className="row">
            <div className="col-lg-12">
              {/* Header */}
              {/* Header */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="mb-0 fw-bold">Certificate Builder</h5>
                      <p className="text-muted mb-0">
                        {template?.name || 'New Certificate Template'}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      {/* Course Selection */}
                      <div className="me-3">
                        <label className="form-label small fw-bold mb-1">Course</label>
                        <select 
                          className="form-select"
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          style={{ width: '250px' }}
                          disabled={!!templateId} // Disable if editing existing template
                        >
                          <option value="">Select a Course</option>
                          {courses.map(course => (
                            <option key={course.value} value={course.value}>
                              {course.label}
                            </option>
                          ))}
                        </select>
                        {!templateId && !selectedCourseId && (
                          <div className="form-text text-warning">
                            Please select a course for this template
                          </div>
                        )}
                      </div>

                      <div className="btn-group">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => navigate('/admin/admin-certificate')}
                        >
                          <i className="isax isax-arrow-left me-2"></i>
                          Back
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={saveTemplate}
                          disabled={isSaving || (!templateId && !selectedCourseId)}
                        >
                          {isSaving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="isax isax-save-2 me-2"></i>
                              Save
                            </>
                          )}
                        </button>
                        {templateId && (
                          <button
                            className="btn btn-success"
                            onClick={publishTemplate}
                          >
                            <i className="isax isax-tick-circle me-2"></i>
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Left Sidebar - Elements Panel */}
                {showElementsPanel && (
                  <div className="col-lg-2">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-transparent border-bottom-0">
                        <h6 className="mb-0 fw-bold">Elements</h6>
                      </div>
                      <div className="card-body p-2">
                        {/* Tools */}
                        <div className="mb-3">
                          <h6 className="small fw-bold text-muted mb-2">TOOLS</h6>
                          <div className="btn-group-vertical w-100" role="group">
                            <button
                              type="button"
                              className={`btn btn-outline-secondary text-start ${activeTool === 'select' ? 'active' : ''}`}
                              onClick={() => setActiveTool('select')}
                            >
                              <i className="isax isax-mouse me-2"></i>
                              Select
                            </button>
                            <button
                              type="button"
                              className={`btn btn-outline-secondary text-start ${activeTool === 'text' ? 'active' : ''}`}
                              onClick={() => setActiveTool('text')}
                            >
                              <i className="isax isax-text me-2"></i>
                              Add Text
                            </button>
                          </div>
                        </div>

                        {/* Dynamic Fields */}
                        <div className="mb-3">
                          <h6 className="small fw-bold text-muted mb-2">DYNAMIC FIELDS</h6>
                          <div className="d-grid gap-1">
                            {dynamicFields.map(field => (
                              <button
                                key={field.key}
                                type="button"
                                className="btn btn-outline-primary btn-sm text-start"
                                onClick={() => addDynamicField(field.key)}
                              >
                                <i className="isax isax-tag-2 me-2"></i>
                                {field.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Elements List */}
                        <div>
                          <h6 className="small fw-bold text-muted mb-2">LAYERS ({elements.length})</h6>
                          <div className="list-group list-group-flush">
                            {elements.map(element => (
                              <button
                                key={element.id}
                                type="button"
                                className={`list-group-item list-group-item-action border-0 py-2 ${selectedElement?.id === element.id ? 'active' : ''}`}
                                onClick={() => setSelectedElement(element)}
                              >
                                <div className="d-flex align-items-center">
                                  <i className={`isax ${element.type === 'dynamic-field' ? 'isax-tag-2' : 'isax-text'} me-2`}></i>
                                  <span className="small text-truncate">
                                    {element.type === 'dynamic-field' 
                                      ? dynamicFields.find(f => f.key === element.fieldType)?.label || 'Dynamic Field'
                                      : element.content?.substring(0, 20) || 'Text Element'
                                    }
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Canvas Area */}
                <div className={`${showElementsPanel && showProperties ? 'col-lg-7' : showElementsPanel || showProperties ? 'col-lg-9' : 'col-lg-12'}`}>
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-bottom-0 py-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setScale(prev => Math.min(prev + 0.1, 1.5))}
                          >
                            <i className="isax isax-add"></i>
                          </button>
                          <span className="small text-muted">{Math.round(scale * 100)}%</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setScale(prev => Math.max(prev - 0.1, 0.3))}
                          >
                            <i className="isax isax-minus"></i>
                          </button>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowElementsPanel(!showElementsPanel)}
                          >
                            <i className={`isax ${showElementsPanel ? 'isax-element-1' : 'isax-element-minus'}`}></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowProperties(!showProperties)}
                          >
                            <i className={`isax ${showProperties ? 'isax-setting-2' : 'isax-setting-3'}`}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div 
                        className="canvas-container bg-light rounded border position-relative mx-auto"
                        style={{ 
                          width: canvasSize.width * scale, 
                          height: canvasSize.height * scale,
                          maxWidth: '100%',
                          overflow: 'auto'
                        }}
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        onMouseMove={(e) => {
                          if (isDragging && draggedElementId && canvasRef.current) {
                            const rect = canvasRef.current.getBoundingClientRect();
                            const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
                            const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
                            
                            // Constrain to canvas bounds
                            const constrainedX = Math.max(0, Math.min(100, x));
                            const constrainedY = Math.max(0, Math.min(100, y));
                            
                            updateElementPosition(draggedElementId, { 
                              x: constrainedX, 
                              y: constrainedY 
                            });
                          }
                        }}
                        onMouseUp={() => {
                          setIsDragging(false);
                          setDraggedElementId(null);
                        }}
                        onMouseLeave={() => {
                          setIsDragging(false);
                          setDraggedElementId(null);
                        }}
                      >
                        {/* Background Image */}
                        {template?.backgroundImageUrl && (
                          <img 
                            src={template.backgroundImageUrl} 
                            alt="Certificate Background"
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        )}

                        {/* Canvas Elements */}
                        {elements.map(element => (
                        <div
                          key={element.id}
                          className={`element position-absolute ${selectedElement?.id === element.id ? 'selected' : ''} ${isDragging && draggedElementId === element.id ? 'dragging' : ''}`}
                          style={{
                            left: `${element.position.x}%`,
                            top: `${element.position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            fontFamily: element.style?.fontFamily,
                            fontSize: `${(element.style?.fontSize || 16) * scale}px`,
                            fontWeight: element.style?.fontWeight,
                            color: element.style?.color,
                            textAlign: element.style?.textAlign as any,
                            maxWidth: element.style?.maxWidth ? `${element.style.maxWidth * scale}px` : 'none',
                            lineHeight: element.style?.lineHeight,
                            opacity: element.style?.opacity,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            border: selectedElement?.id === element.id ? '2px dashed #007bff' : '1px dashed transparent',
                            padding: '2px 4px',
                            backgroundColor: selectedElement?.id === element.id ? 'rgba(0, 123, 255, 0.1)' : 'transparent'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElement(element);
                            setActiveTool('select');
                          }}
                          onMouseDown={(e) => {
                            if (activeTool === 'select') {
                              e.stopPropagation();
                              setIsDragging(true);
                              setDraggedElementId(element.id);
                              setSelectedElement(element);
                              
                              const rect = canvasRef.current?.getBoundingClientRect();
                              if (rect) {
                                const elementX = (element.position.x / 100) * rect.width;
                                const elementY = (element.position.y / 100) * rect.height;
                                const offsetX = e.clientX - rect.left - elementX;
                                const offsetY = e.clientY - rect.top - elementY;
                                setDragOffset({ x: offsetX, y: offsetY });
                              }
                            }
                          }}
                        >
                          {getElementContent(element)}
                        </div>
                      ))}

                        {/* Add Element Hint */}
                        {activeTool === 'text' && (
                          <div className="position-absolute top-50 start-50 translate-middle text-center">
                            <div className="bg-primary text-white rounded p-3">
                              <i className="isax isax-cursor me-2"></i>
                              Click to add text element
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Properties Panel */}
                {showProperties && (
                  <div className="col-lg-3">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-transparent border-bottom-0">
                        <h6 className="mb-0 fw-bold">
                          {selectedElement ? 'Element Properties' : 'Canvas Properties'}
                        </h6>
                      </div>
                      <div className="card-body">
                        {selectedElement ? (
                          <div>
                            {/* Element Type */}
                            <div className="mb-3">
                              <label className="form-label small fw-bold">Type</label>
                              <div className="form-control bg-light">
                                {selectedElement.type === 'dynamic-field' 
                                  ? `Dynamic Field: ${dynamicFields.find(f => f.key === selectedElement.fieldType)?.label}`
                                  : 'Text Element'
                                }
                              </div>
                            </div>

                            {/* Content for text elements */}
                            {selectedElement.type === 'text' && (
                              <div className="mb-3">
                                <label className="form-label small fw-bold">Content</label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  value={selectedElement.content || ''}
                                  onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
                                  placeholder="Enter text content..."
                                />
                              </div>
                            )}

                            {/* Font Family */}
                            <div className="mb-3">
                              <label className="form-label small fw-bold">Font Family</label>
                              <select
                                className="form-select"
                                value={selectedElement.style?.fontFamily || 'Arial'}
                                onChange={(e) => updateElementStyle(selectedElement.id, { fontFamily: e.target.value })}
                              >
                                {fontOptions.map(font => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </select>
                            </div>

                            {/* Font Size */}
                            <div className="mb-3">
                              <label className="form-label small fw-bold">Font Size</label>
                              <input
                                type="number"
                                className="form-control"
                                value={selectedElement.style?.fontSize || 16}
                                onChange={(e) => updateElementStyle(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                                min="8"
                                max="72"
                              />
                            </div>

                            {/* Color */}
                            <div className="mb-3">
                              <label className="form-label small fw-bold">Color</label>
                              <input
                                type="color"
                                className="form-control form-control-color"
                                value={selectedElement.style?.color || '#000000'}
                                onChange={(e) => updateElementStyle(selectedElement.id, { color: e.target.value })}
                              />
                            </div>

                            {/* Text Align */}
                            <div className="mb-3">
                              <label className="form-label small fw-bold">Text Align</label>
                              <select
                                className="form-select"
                                value={selectedElement.style?.textAlign || 'left'}
                                onChange={(e) => updateElementStyle(selectedElement.id, { textAlign: e.target.value as any })}
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                              </select>
                            </div>

                            {/* Actions */}
                            <div className="d-grid gap-2">
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => deleteElement(selectedElement.id)}
                              >
                                <i className="isax isax-trash me-2"></i>
                                Delete Element
                              </button>
                            </div>
                          </div>
                        ) : (
                           <div>
                              {/* Background Image Upload Section */}
                              <div className="mb-4">
                                <label className="form-label small fw-bold">Background Image</label>
                                
                                {/* Current Background Preview */}
                                {(backgroundImagePreview || template?.backgroundImageUrl) && (
                                  <div className="mb-3">
                                    <div className="position-relative">
                                      <img 
                                        src={backgroundImagePreview || template?.backgroundImageUrl || ''} 
                                        alt="Background preview"
                                        className="img-fluid rounded border"
                                        style={{ maxHeight: '150px', width: '100%', objectFit: 'cover' }}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                        onClick={removeBackgroundImage}
                                      >
                                        <i className="isax isax-close-circle"></i>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Upload Button */}
                                <div className="file-upload drag-file w-100 d-flex align-items-center justify-content-center flex-column border rounded p-3 bg-light">
                                  <span className="upload-img mb-2">
                                    <i className="isax isax-gallery5 fs-24 text-muted"></i>
                                  </span>
                                  <p className="mb-1 small text-center">Drag and drop background image</p>
                                  <p className="mb-2 small text-center">Accept: jpg, jpeg, png, gif, webp (Max: 15MB)</p>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleBackgroundImageUpload}
                                    className="d-none"
                                    id="background-upload"
                                  />
                                  <label 
                                    htmlFor="background-upload"
                                    className="btn btn-secondary btn-sm"
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <i className="isax isax-gallery-add me-1"></i>
                                    Choose Image
                                  </label>
                                </div>
                              </div>

                              {/* Canvas Background Color */}
                              <div className="mb-3">
                                <label className="form-label small fw-bold">Background Color</label>
                                <input
                                  type="color"
                                  className="form-control form-control-color"
                                  value={template?.designConfig?.canvas?.backgroundColor || '#FFFFFF'}
                                  onChange={(e) => {
                                    if (template) {
                                      setTemplate({
                                        ...template,
                                        designConfig: {
                                          ...template.designConfig,
                                          canvas: {
                                            ...template.designConfig.canvas,
                                            backgroundColor: e.target.value
                                          }
                                        }
                                      });
                                    }
                                  }}
                                />
                              </div>

                              {/* Canvas Size */}
                              <div className="mb-3">
                                <label className="form-label small fw-bold">Canvas Size</label>
                                <div className="row g-2">
                                  <div className="col-6">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Width"
                                      value={canvasSize.width}
                                      onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 1200 }))}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Height"
                                      value={canvasSize.height}
                                      onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 850 }))}
                                    />
                                  </div>
                                </div>
                                <div className="form-text">
                                  Standard size: 1200 × 850 pixels
                                </div>
                              </div>

                              <p className="text-muted small">
                                {elements.length === 0 
                                  ? 'No elements added yet. Use the tools on the left to add elements to your certificate.'
                                  : 'Select an element to edit its properties.'
                                }
                              </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateBuilder;