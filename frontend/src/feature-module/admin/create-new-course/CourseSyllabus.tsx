import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext';
import { courseApi, quizApi, questionApi } from '../../../core/utils/api';
import { RichTextEditorComponent, HtmlEditor, Inject, Toolbar, Image, Link, QuickToolbar } from '@syncfusion/ej2-react-richtexteditor';
import type { ImageUploadingEventArgs } from '@syncfusion/ej2-react-richtexteditor';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-icons/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-react-richtexteditor/styles/material.css';
import './license.css';

interface Quiz {
  id?: string;
  title: string;
  description?: string;
  timeLimit: number; // in minutes
  passingScore: number;
  maxAttempts: number | null;
  isActive: boolean;
  sectionId: string;
  questions?: Question[];
  questionCount?: number;
}

interface Answer {
  id?: string
  text: string
  isCorrect: boolean
  order: number
}

interface Question {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false'
  points: number
  order: number
  answers: Answer[]
  createdAt: string
  updatedAt: string
}

interface QuestionFormData {
  question: string
  type: 'multiple_choice' | 'true_false'
  points: number
  answers: { text: string; isCorrect: boolean }[]
}

interface Lecture {
  id?: string;
  title: string;
  type: 'video' | 'pdf' | 'link' | 'text';
  contentUrl: string; // URL or file path
  textContent?: string;
  contentFile?: File; 
  duration: number; // in minutes
  freePreview: boolean;
  sortOrder: number;
  quizData?: Quiz;
}

interface Section {
  id?: string;
  title: string;
  lessons: Lecture[];
  quizzes: Quiz[]; 
  sortOrder: number;
}

interface UploadResponse {
  success: boolean;
  message?: string;
  data?: {
    url: string;
    publicId?: string;
    originalName?: string;
    size?: number;
    format?: string;
  };
}

interface ReviewerFeedback {
  comments: string;
  status: string;
  requestedChanges: string[];
}

interface DragState {
  draggedItem: string | null;
  dragOverItem: string | null;
  isDragging: boolean;
  dragPosition: 'before' | 'after' | null;
}

const CourseSyllabus = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const route = all_routes;
  const { courseId } = useParams();

  const [sections, setSections] = useState<Section[]>([]);
  const [courseStatus, setCourseStatus] = useState<string>('draft');
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviewerFeedback, setReviewerFeedback] = useState<ReviewerFeedback | null>(null);

  // Modal states
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('');
  
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(-1);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState<number>(-1);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [sectionTitle, setSectionTitle] = useState('');
  const [lectureForm, setLectureForm] = useState<Lecture>({
    title: '',
    type: 'video',
    contentUrl: '',
    textContent: '', 
    duration: 0,
    freePreview: false,
    sortOrder: 0
  });
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(-1);
  const [quizForm, setQuizForm] = useState<Quiz>({
    title: '',
    description: '',
    timeLimit: 60,
    passingScore: 70,
    maxAttempts: null,
    isActive: true,
    sectionId:  ''
  });
  const resetQuizForm = () => {
    setQuizForm({
      title: '',
      description: '',
      timeLimit: 60,
      passingScore: 70,
      maxAttempts: null,
      isActive: true,
      sectionId:  ''
    });
    setCurrentQuizIndex(-1);
  };
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>({
    question: '',
    type: 'multiple_choice',
    points: 1,
    answers: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });
  
  const [dynamicAnswers, setDynamicAnswers] = useState<{ text: string; isCorrect: boolean }[]>([]);

  const [uploadMode, setUploadMode] = useState<'manual' | 'upload'>('upload');
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [deletingDocuments, setDeletingDocuments] = useState<{[key: string]: boolean}>({});

  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null,
    isDragging: false,
    dragPosition: null
  });

  const loadCourseData = async (courseId: string) => {
    try {
      const response = await courseApi.getCourseSyllabus(courseId);
      if (response.success) {
        // Ensure each section has quizzes array
        const sectionsWithQuizzes = (response.data.sections || []).map((section: Section) => ({
          ...section,
          quizzes: [] // Initialize empty array, will be populated by loadQuizzes
        }));
        setSections(sectionsWithQuizzes);
        setCourseStatus(response.data.status || 'draft');
        setReviewerFeedback(response.data.reviewFeedback || null);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    }
  };

  const loadQuizzes = async (courseId: string) => {
    try {
      const response = await quizApi.getById(courseId);
      if (response.success) {
        // Filter only active quizzes
        const quizzesList: Quiz[] = (response.data.quizzes || []).filter(
          (quiz: Quiz) => quiz.isActive === true
        );
        
        setQuizzes(quizzesList);
        setSections(prevSections => {
          return prevSections.map(section => ({
            ...section,
            quizzes: quizzesList.filter(quiz => quiz.sectionId === section.id)
          }));
        });
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };
  const loadQuestions = async (quizId: string) => {
    try {
      const response = await questionApi.getQuizQuestions(quizId!, { 
        page: '1', 
        limit: '10' 
      })
      
      if (response.success && response.data) {
        setQuestions(response.data.questions)
      }
    } catch (error: any) {
      console.error('Error fetching questions:', error)
    } 
  }

  const loadUploadedDocuments = async () => {
    if (!courseId) return;
    
    try {
      const response = await courseApi.getSyllabusDocuments(courseId);
      if (response.success) {
        setUploadedDocuments(response.data.documents || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate(route.login);
    } else if (courseId) {
      loadCourseData(courseId);
      loadQuizzes(courseId);
      loadUploadedDocuments();
    }
  }, [user, navigate, courseId]);

  useEffect(() => {
    if (quizzes.length > 0 && quizzes[0].id) {
      loadQuestions(quizzes[0].id);
    }
  }, [quizzes]);

  if (loading) {
    return (
      <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate(route.login);
    return null;
  }


  const validateSyllabus = (): boolean => {
    if (uploadMode === 'upload' && uploadedDocuments.length === 0) {
      toast.error('Please upload and process a document first, or switch to manual mode');
      return false;
    }

    if (uploadMode === 'manual') {
      if (sections.length === 0) {
        toast.error('At least one section is required');
        return false;
      }

      for (const section of sections) {
        if (section.lessons.length === 0) {
          toast.error(`Section "${section.title}" must have at least one lecture`);
          return false;
        }
      }
      if (questions.length === 0) {
        toast.error('At least one question is required');
        return false;
      }
    }   

    return true;
  };

  const saveDraft = async () => {
    setIsDraftSaving(true);
    try {
      const syllabusData = {
        courseId,
        sections,
        status: 'draft'
      };

      const response = await courseApi.updateCourseSyllabus(courseId, syllabusData);
      if (response.success) {
        toast.success('Draft saved successfully');
      } else {
        toast.error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateSyllabus()) return;

    setIsSubmitting(true);
    try {
      await saveDraft();
      
      navigate(`/admin/course-accreditation/${courseId}`);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      toast.error('Failed to proceed to next step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate(`/admin/create-course/${courseId}`);
  };

  // Section Management
  const openSectionModal = (section?: Section, index?: number) => {
    if (section && typeof index === 'number') {
      setCurrentSection(section);
      setCurrentSectionIndex(index);
      setSectionTitle(section.title);
    } else {
      setCurrentSection(null);
      setCurrentSectionIndex(-1);
      setSectionTitle('');
    }
    setShowSectionModal(true);
  };

  const saveSection = async () => {
    if (!sectionTitle.trim()) {
      toast.error('Section title is required');
      return;
    }

    try {
      const sectionData = {
        title: sectionTitle,
        courseId: courseId,
        sortOrder: currentSectionIndex >= 0 ? currentSectionIndex + 1 : sections.length + 1 // Change sortOrder to sortOrder
      };

      // FIX: Check for section ID first, not index
      if (currentSection?.id) {
        // Update existing section
        const response = await courseApi.updateSection(currentSection.id, sectionData);
        if (response.success) {
          const updatedSections = [...sections];
          updatedSections[currentSectionIndex] = { 
            ...response.data.section, // Use the full response data
            lessons: updatedSections[currentSectionIndex].lessons // Preserve existing lessons
          };
          setSections(updatedSections);
          toast.success('Section updated successfully');
        }
      } else {
        // Create new section
        const response = await courseApi.createSection(sectionData);
        if (response.success) {
          const newSection: Section = {
            ...response.data.section, // Use full response data
            lessons: [] // Initialize empty lessons array
          };
          setSections([...sections, newSection]);
          toast.success('Section created successfully');
        }
      }

      setShowSectionModal(false);
      setSectionTitle('');
      setCurrentSection(null); // Reset current section
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Failed to save section');
    }
  };

  const deleteSection = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    const section = sections[index];
    if (!section.id) {
      // If no ID, just remove from local state
      setSections(sections.filter((_, i) => i !== index));
      return;
    }

    try {
      const response = await courseApi.deleteSection(section.id);
      if (response.success) {
        setSections(sections.filter((_, i) => i !== index));
        toast.success('Section deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
    }
  };

  // Lecture Management
  const openLectureModal = (sectionIndex: number, lecture?: Lecture, lectureIndex?: number) => {
    setCurrentSectionIndex(sectionIndex);
    if (lecture && typeof lectureIndex === 'number') {
      setCurrentLecture(lecture);
      setCurrentLectureIndex(lectureIndex);
      setLectureForm(lecture);
    } else {
      setCurrentLecture(null);
      setCurrentLectureIndex(-1);
      setLectureForm({
        title: '',
        type: 'video',
        contentUrl: '',
        duration: 0,
        freePreview: false,
        sortOrder: sections[sectionIndex]?.lessons.length || 0
      });
    }
    setShowLectureModal(true);
  };

  const saveLecture = async () => {
    if (!lectureForm.title.trim()) {
      toast.error('Lecture title is required');
      return;
    }

    if (!lectureForm.duration) {
      toast.error('Lecture duration is required');
      return;
    }

    if (lectureForm.type === 'text') {
      if (!lectureForm.textContent || !lectureForm.textContent.trim()) {
        toast.error('Text content is required');
        return;
      }
    } else if (!lectureForm.contentUrl.trim() && !selectedFile) {
      toast.error('Lecture content or file is required');
      return;
    }

    const section = sections[currentSectionIndex];
    if (!section?.id) {
      toast.error('Please save the section first');
      return;
    }

    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('title', lectureForm.title);
      formData.append('type', lectureForm.type);
      formData.append('duration', lectureForm.duration.toString());
      formData.append('freePreview', lectureForm.freePreview.toString());
      formData.append('sectionId', section.id);
      formData.append('sortOrder', (section.lessons.length).toString());

      // Handle file upload
      if (lectureForm.type === 'text') {
        formData.append('textContent', lectureForm.textContent || '');
      } else {
        // Handle file upload for video/PDF
        if (selectedFile) {
          formData.append('contentFile', selectedFile);
        } else {
          formData.append('contentUrl', lectureForm.contentUrl);
        }
      }

      if (currentLectureIndex >= 0 && currentLecture?.id) {
        // Update existing lecture
        const response = await courseApi.updateLesson(currentLecture.id, formData);
        if (response.success) {
          const updatedSections = [...sections];
          updatedSections[currentSectionIndex].lessons[currentLectureIndex] = {
            ...lectureForm,
            id: currentLecture.id,
            contentUrl: response.data.contentUrl || lectureForm.contentUrl,
            textContent: lectureForm.type === 'text' ? lectureForm.textContent : undefined // Add this
          };
          setSections(updatedSections);
          toast.success('Lecture updated successfully');
        }
      } else {
        // Create new lecture
        const response = await courseApi.createLesson(formData);
        if (response.success) {
          const updatedSections = [...sections];
          const newLecture = {
            ...lectureForm,
            id: response.data.id,
            contentUrl: response.data.contentUrl || lectureForm.contentUrl,
            textContent: lectureForm.type === 'text' ? lectureForm.textContent : undefined // Add this
          };
          updatedSections[currentSectionIndex].lessons.push(newLecture);
          setSections(updatedSections);
          toast.success('Lecture created successfully');
        }
      }

      setShowLectureModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving lecture:', error);
      toast.error('Failed to save lecture');
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (lectureForm.type === 'video') {
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validVideoTypes.includes(file.type)) {
        toast.error('Please upload a valid video file (MP4, WebM, or OGG)');
        return;
      }
    } else if (lectureForm.type === 'pdf') {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a valid PDF file');
        return;
      }
    }

    // Validate file size (max 500MB for videos, 50MB for PDFs)
    const maxSize = lectureForm.type === 'video' ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${lectureForm.type === 'video' ? '500MB' : '50MB'}`);
      return;
    }

    setSelectedFile(file);
    toast.success('File selected successfully');
  };

  const closeLectureModal = () => {
    setShowLectureModal(false);
    setSelectedFile(null);
    setLectureForm({
      title: '',
      type: 'video',
      contentUrl: '',
      textContent: '',
      duration: 0,
      freePreview: false,
      sortOrder: 0
    });
  };

  const deleteLecture = async (sectionIndex: number, lectureIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) {
      return;
    }

    const lecture = sections[sectionIndex].lessons[lectureIndex];
    if (!lecture.id) {
      // If no ID, just remove from local state
      const updatedSections = [...sections];
      updatedSections[sectionIndex].lessons = updatedSections[sectionIndex].lessons.filter((_, i) => i !== lectureIndex);
      setSections(updatedSections);
      return;
    }

    try {
      const response = await courseApi.deleteLesson(lecture.id);
      if (response.success) {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].lessons = updatedSections[sectionIndex].lessons.filter((_, i) => i !== lectureIndex);
        setSections(updatedSections);
        toast.success('Lecture deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting lecture:', error);
      toast.error('Failed to delete lecture');
    }
  };

  const handleImageUpload = (args: ImageUploadingEventArgs) => {
    
    // The file is provided in filesData (array) for newer typings; keep a safe fallback to fileData via any
    const file = args.filesData?.[0]?.rawFile ?? (args as any).fileData?.rawFile;
    
    console.log('Extracted file from upload event:', file);

    if (!file) {
      toast.error('No file selected - cannot access file from upload event');
      args.cancel = true;
      return;
    }

    args.customFormData = [];
    
    const promise = new Promise<void>((resolve, reject) => {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Use your upload API with proper typing
      courseApi.uploadMedia(formData)
        .then((response: UploadResponse) => {
          if (response.success && response.data) {
            // Cancel the default upload
            args.cancel = true;
            
            // Insert the image manually into the editor
            const rte = document.querySelector('.e-richtexteditor') as any;
            if (rte && rte.ej2_instances && rte.ej2_instances[0]) {
              const editor = rte.ej2_instances[0];
              editor.executeCommand('insertImage', {
                url: response.data.url,
                altText: 'Lecture image'
              });
              // CLOSE THE UPLOAD MODAL PROGRAMMATICALLY
              // Find and close the image upload dialog
              const imageDialog = document.querySelector('.e-rte-image-dialog') as any;
              if (imageDialog) {
                const dialogInstance = imageDialog.ej2_instances?.[0];
                if (dialogInstance) {
                  dialogInstance.hide();
                }
              }
              
              // Alternative: Close any open dialogs
              const openDialogs = document.querySelectorAll('.e-dialog');
              openDialogs.forEach((dialog: any) => {
                if (dialog.ej2_instances?.[0]?.visible) {
                  dialog.ej2_instances[0].hide();
                }
              });
            }
            
            toast.success('Image uploaded successfully');
            resolve();
          } else {
            reject(new Error(response.message || 'Upload failed'));
          }
        })
        .catch((error: Error) => {
          console.error('Image upload error:', error);
          reject(error);
        })
        .finally(() => {
          setUploadingImage(false);
        });
    });

    args.cancel = true; // Cancel default upload since we're handling it manually
    
    promise.catch((error: Error) => {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image: ' + error.message);
    });
  };

  // Handle image upload success
  const handleImageUploadSuccess = (args: any) => {
    console.log('Image upload success:', args);
  };

  // Handle image upload failure
  const handleImageUploadFailure = (args: any) => {
    console.error('Image upload failure:', args);
    toast.error('Image upload failed');
  };

  // Handle other editor actions
  const handleActionBegin = (args: any) => {
    if (args.requestType === 'Image' && uploadingImage) {
      args.cancel = true; // Prevent other image actions while uploading
    }
  };

  const handleActionComplete = (args: any) => {
    if (args.requestType === 'Image' && args.e?.currentTarget?.responseText) {
      try {
        const response = JSON.parse(args.e.currentTarget.responseText);
        if (!response.success) {
          toast.error('Image upload failed: ' + (response.error?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error parsing image upload response:', error);
      }
    }
  };

  // Quiz Management

  // Save quiz
  const saveQuiz = async () => {
    if (!quizForm.title.trim()) {
      toast.error('Quiz title is required');
      return;
    }

    if (quizForm.passingScore < 0 || quizForm.passingScore > 100) {
      toast.error('Passing score must be between 0 and 100');
      return;
    }
    if (!quizForm.maxAttempts) {
      toast.error('Quiz max Attempts is required');
      return;
    }

    const section = sections[currentSectionIndex];
    if (!section?.id) {
      toast.error('Please save the section first');
      return;
    }

    try {
      const quizData = {
        courseId: courseId,
        sectionId: section.id,
        title: quizForm.title,
        description: quizForm.description || '',
        timeLimit: quizForm.timeLimit,
        passingScore: quizForm.passingScore,
        maxAttempts: quizForm.maxAttempts,
        isActive: true
      };

      if (currentQuizIndex >= 0 && quizzes[currentQuizIndex]?.id) {
        // Update existing quiz
        const response = await quizApi.update(quizzes[currentQuizIndex].id!, quizData);
        if (response.success) {
          await loadQuizzes(courseId!);
          toast.success('Quiz updated successfully');
        }
      } else {
        // Create new quiz
        const response = await quizApi.create(quizData);
        if (response.success) {
          await loadQuizzes(courseId!);
          toast.success('Quiz created successfully');
        }
      }

      setShowQuizModal(false);
      resetQuizForm();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz');
    }
  };

  // Delete quiz
  const deleteQuiz = async (sectionIndex: number, quizIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    const section = sections[sectionIndex];
    const quiz = section.quizzes[quizIndex];
    if (!quiz.id) return;

    try {
      const response = await quizApi.delete(quiz.id);
      if (response.success) {
        await loadQuizzes(courseId!);
        toast.success('Quiz deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    }
  };
  
  const openQuizModal = (sectionIndex: number, quiz?: Quiz, quizIndex?: number) => {
    setCurrentSectionIndex(sectionIndex);
    if (quiz && typeof quizIndex === 'number') {
      setCurrentQuizIndex(quizIndex);
      setQuizForm(quiz);
    } else {
      setCurrentQuizIndex(-1);
      setQuizForm({
        title: '',
        description: '',
        timeLimit: 60,
        passingScore: 70,
        maxAttempts: null,
        isActive: true,
        sectionId: sections[sectionIndex]?.id || '' 
      });
    }
    setShowQuizModal(true);
  };

 const openQuizQuestions = async (quiz: Quiz, sectionIndex: number, quizIndex: number) => {
    setCurrentQuiz(quiz);
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuizIndex(quizIndex);
    if (quiz.id) {
      await loadQuestions(quiz.id);
    }
    setShowQuestionModal(true);
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      question: '',
      type: 'multiple_choice',
      points: 1,
      answers: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    });
    setDynamicAnswers([]);
    setSelectedQuestion(null);
  };

  const handleQuestionFormChange = (field: keyof QuestionFormData, value: any) => {
    setQuestionFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'type') {
      if (value === 'true_false') {
        setQuestionFormData(prev => ({
          ...prev,
          answers: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: false }
          ]
        }));
        setDynamicAnswers([]);
      } else {
        setQuestionFormData(prev => ({
          ...prev,
          answers: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }));
        setDynamicAnswers([]);
      }
    }
  };

  const handleAnswerChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const allAnswers = [...questionFormData.answers, ...dynamicAnswers];
    allAnswers[index] = { ...allAnswers[index], [field]: value };
    
    const baseAnswers = allAnswers.slice(0, questionFormData.answers.length);
    const extraAnswers = allAnswers.slice(questionFormData.answers.length);
    
    setQuestionFormData(prev => ({ ...prev, answers: baseAnswers }));
    setDynamicAnswers(extraAnswers);
  };

  const addNewAnswer = () => {
    setDynamicAnswers([...dynamicAnswers, { text: '', isCorrect: false }]);
  };

  const removeAnswer = (index: number) => {
    if (index < questionFormData.answers.length) return;
    const dynamicIndex = index - questionFormData.answers.length;
    setDynamicAnswers(dynamicAnswers.filter((_, i) => i !== dynamicIndex));
  };

  const prepareEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setQuestionFormData({
      question: question.question,
      type: question.type,
      points: question.points,
      answers: question.answers.slice(0, 2).map(a => ({ text: a.text, isCorrect: a.isCorrect }))
    });
    setDynamicAnswers(
      question.answers.slice(2).map(a => ({ text: a.text, isCorrect: a.isCorrect }))
    );
    setShowEditQuestionModal(true);
  };

  const handleCreateQuestion = async () => {
    if (!currentQuiz?.id) return;

    try {
      const allAnswers = [...questionFormData.answers, ...dynamicAnswers];
      
      if (!questionFormData.question.trim()) {
        toast.error('Question text is required');
        return;
      }
      
      if (questionFormData.question.trim().length < 10 || questionFormData.question.trim().length > 200) {
        toast.error('Question must be between 10 and 200 characters');
        return;
      }
      
      if (allAnswers.some(a => !a.text.trim())) {
        toast.error('All answer options must have text');
        return;
      }
      
      if (!allAnswers.some(a => a.isCorrect)) {
        toast.error('At least one answer must be marked as correct');
        return;
      }

      const response = await questionApi.create(currentQuiz.id, {
        questionText: questionFormData.question,
        type: questionFormData.type,
        points: questionFormData.points,
        answers: allAnswers
      });

      if (response.success) {
        toast.success('Question created successfully');
        resetQuestionForm();
        await loadQuestions(currentQuiz.id);
        setShowEditQuestionModal(false);
      }
    } catch (error: any) {
      console.error('Error creating question:', error);
      toast.error(error.message || 'Failed to create question');
    }
  };

  const handleUpdateQuestion = async () => {
    if (!currentQuiz?.id || !selectedQuestion) return;
    
    try {
      const allAnswers = [...questionFormData.answers, ...dynamicAnswers];
      
      if (!questionFormData.question.trim()) {
        toast.error('Question text is required');
        return;
      }
      
      if (questionFormData.question.trim().length < 10 || questionFormData.question.trim().length > 200) {
        toast.error('Question must be between 10 and 200 characters');
        return;
      }
      
      if (allAnswers.some(a => !a.text.trim())) {
        toast.error('All answer options must have text');
        return;
      }
      
      if (!allAnswers.some(a => a.isCorrect)) {
        toast.error('At least one answer must be marked as correct');
        return;
      }

      const response = await questionApi.update(currentQuiz.id, selectedQuestion.id, {
        questionText: questionFormData.question,
        type: questionFormData.type,
        points: questionFormData.points,
        answers: allAnswers
      });

      if (response.success) {
        toast.success('Question updated successfully');
        resetQuestionForm();
        await loadQuestions(currentQuiz.id);
        setShowEditQuestionModal(false);
      }
    } catch (error: any) {
      console.error('Error updating question:', error);
      toast.error(error.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!currentQuiz?.id) return;
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const response = await questionApi.delete(currentQuiz.id, questionId);

      if (response.success) {
        toast.success('Question deleted successfully');
        await loadQuestions(currentQuiz.id);
      }
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast.error(error.message || 'Failed to delete question');
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only PDF or DOC/DOCX files');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setIsProcessingDocument(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('syllabusDocument', file);
      formData.append('courseId', courseId || '');

      const response = await courseApi.uploadSyllabusDocument(courseId, formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setUploadProgress(percentCompleted);
      });

      if (response.success && response.data.sections) {
        // setSections(response.data.sections);
        toast.success('Document processed successfully! Syllabus has been generated.');
        setUploadMode('upload');
        await loadUploadedDocuments();
      } else {
        toast.error('Failed to process document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to process document. Please try again or create manually.');
    } finally {
      setIsProcessingDocument(false);
      setUploadedFile(null);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  const viewDocument = (documentUrl: string) => {
    setCurrentPdfUrl(documentUrl);
    setShowPdfModal(true);
  };

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }
      setDeletingDocuments(prev => ({ ...prev, [documentId]: true }));
    try {
      const response = await courseApi.deleteSyllabusDocument(courseId, documentId);
      
      if (response.success) {
        toast.success('Document deleted successfully');
        // Remove the document from the local state
        setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeletingDocuments(prev => ({ ...prev, [documentId]: false }));
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e: React.DragEvent, sectionIndex: number, lectureIndex: number) => {
    const lectureId = `${sectionIndex}-${lectureIndex}`;
    e.dataTransfer.setData('text/plain', lectureId);
    e.dataTransfer.effectAllowed = 'move';
    
    setDragState(prev => ({
      ...prev,
      draggedItem: lectureId,
      isDragging: true
    }));

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    e.dataTransfer.setDragImage(target, rect.width / 2, rect.height / 2);
    document.body.classList.add('dragging');
  };

  const handleDragEnd = () => {
    setDragState({
      draggedItem: null,
      dragOverItem: null,
      isDragging: false,
      dragPosition: null
    });
    document.body.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent, sectionIndex: number, lectureIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const targetId = `${sectionIndex}-${lectureIndex}`;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';

    setDragState(prev => ({
      ...prev,
      dragOverItem: targetId,
      dragPosition: position
    }));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { clientX, clientY } = e;
    
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      setDragState(prev => ({
        ...prev,
        dragOverItem: null,
        dragPosition: null
      }));
    }
  };

  const handleDrop = async (e: React.DragEvent, targetSectionIndex: number, targetLectureIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (!draggedId) {
      handleDragEnd();
      return;
    }

    const [sourceSectionIdx, sourceLectureIdx] = draggedId.split('-').map(Number);
    const targetId = `${targetSectionIndex}-${targetLectureIndex}`;

    if (draggedId === targetId) {
      handleDragEnd();
      return;
    }

    const updatedSections = [...sections];
    const sourceSection = updatedSections[sourceSectionIdx];
    const targetSection = updatedSections[targetSectionIndex];

    // Remove from source
    const [movedLecture] = sourceSection.lessons.splice(sourceLectureIdx, 1);

    // Calculate insert position
    let insertIndex = targetLectureIndex;
    if (dragState.dragPosition === 'after') {
      insertIndex = targetLectureIndex + 1;
    }

    // Adjust index if moving within same section
    if (sourceSectionIdx === targetSectionIndex && sourceLectureIdx < insertIndex) {
      insertIndex--;
    }

    // Insert at target
    targetSection.lessons.splice(insertIndex, 0, movedLecture);

    // Update sort orders
    [sourceSectionIdx, targetSectionIndex].forEach(sIdx => {
      updatedSections[sIdx].lessons.forEach((lesson, index) => {
        lesson.sortOrder = index;
      });
    });

    setSections(updatedSections);
    handleDragEnd();
    try {
      // Update source section if lessons were reordered
      if (sourceSection.id) {
        const sourceLessonIds = sourceSection.lessons
          .filter(lesson => lesson.id) // Only include lessons with IDs
          .map(lesson => lesson.id!);
        
        if (sourceLessonIds.length > 0) {
          await courseApi.reorderLessons(sourceSection.id, sourceLessonIds);
        }
      }

      // Update target section if different from source
      if (sourceSectionIdx !== targetSectionIndex && targetSection.id) {
        const targetLessonIds = targetSection.lessons
          .filter(lesson => lesson.id)
          .map(lesson => lesson.id!);
        
        if (targetLessonIds.length > 0) {
          await courseApi.reorderLessons(targetSection.id, targetLessonIds);
        }
      }

      toast.success('Lesson order updated successfully');
    } catch (error) {
      console.error('Error updating lesson order:', error);
      toast.error('Failed to save lesson order. Please try again.');
      
      // Optionally: Reload the course data to revert to server state
      if (courseId) {
        await loadCourseData(courseId);
      }
    }
  };

  // Add CSS styles - place this in your component or in a style tag
  const dragDropStyles = `
    .syncfusion-license-error {
      display: none !important;
    }
    div[style*="position: fixed"][style*="z-index: 99999"] {
      display: none !important;
    }
    .dragging {
      cursor: grabbing !important;
    }
    .dragging * {
      cursor: grabbing !important;
    }
    .lecture-item-dragging {
      opacity: 0.5;
      transform: rotate(2deg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .drop-indicator-before::before {
      content: '';
      position: absolute;
      top: -3px;
      left: 0;
      right: 0;
      height: 3px;
      background: #4f46e5;
      border-radius: 2px;
      z-index: 10;
      box-shadow: 0 0 6px rgba(79, 70, 229, 0.5);
    }
    .drop-indicator-after::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 3px;
      background: #4f46e5;
      border-radius: 2px;
      z-index: 10;
      box-shadow: 0 0 6px rgba(79, 70, 229, 0.5);
    }
    .lecture-drag-handle {
      cursor: grab;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .lecture-item:hover .lecture-drag-handle {
      opacity: 1;
    }
    .text-editor-wrapper {
        position: relative;
      }
    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      border: 2px dashed #007bff;
      border-radius: 4px;
    }
    .upload-overlay p {
      margin-top: 10px;
      color: #007bff;
      font-weight: bold;
    }
  `;
    // Show status banner if course is in review or has feedback
  const renderStatusBanner = () => {
    if (courseStatus === 'submitted') {
      return (
        <div className="alert alert-info">
          <i className="fa-solid fa-clock me-2"></i>
          Your course is under review. Expected turnaround: 5-10 business days. You cannot edit until feedback arrives.
        </div>
      );
    }
    
    if (courseStatus === 'changes_requested' && reviewerFeedback) {
      return (
        <div className="alert alert-warning">
          <i className="fa-solid fa-exclamation-triangle me-2"></i>
          <strong>Reviewer Feedback:</strong> {reviewerFeedback.comments}
          <div className="mt-2">
            <a href="#reviewer-comments" className="btn btn-sm btn-outline-warning">
              View Detailed Comments
            </a>
          </div>
        </div>
      );
    }

    if (courseStatus === 'approved') {
      return (
        <div className="alert alert-success">
          <i className="fa-solid fa-check-circle me-2"></i>
          Approved - awaiting publication by Admin.
        </div>
      );
    }

    if (courseStatus === 'published') {
      return (
        <div className="alert alert-success">
          <i className="fa-solid fa-globe me-2"></i>
          Live - Enrollments open.
        </div>
      );
    }

    return null;
  };

  const renderReviewerComments = () => {
    if (courseStatus === 'changes_requested' && reviewerFeedback) {
      return (
        <div id="reviewer-comments" className="reviewer-feedback-section mb-4">
          <div className="card border-warning">
            <div className="card-header bg-warning bg-opacity-10">
              <h6 className="mb-0">
                <i className="fa-solid fa-comment-dots me-2"></i>
                Reviewer Comments
              </h6>
            </div>
            <div className="card-body">
              <p><strong>General Comments:</strong></p>
              <p className="mb-3">{reviewerFeedback.comments}</p>
              
              {reviewerFeedback.requestedChanges && reviewerFeedback.requestedChanges.length > 0 && (
                <div>
                  <p><strong>Requested Changes:</strong></p>
                  <ul className="list-unstyled">
                    {reviewerFeedback.requestedChanges.map((change, index) => (
                      <li key={index} className="mb-1">
                        <i className="fa-solid fa-circle-exclamation text-warning me-2"></i>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const isReadOnly = ['submitted', 'approved', 'published'].includes(courseStatus);

  return (
    <>
      <style>{dragDropStyles}</style>
      <Breadcrumb title="Course Upload - Syllabus & Content" />
      
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {renderStatusBanner()}
              {renderReviewerComments()}
              <div className="add-course-item">
                <div className="wizard">
                  <ul className="form-wizard-steps">
                    <li className="progress-activated">
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">01</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Basics</p>
                        </div>
                      </div>
                    </li>
                    <li className="progress-active">
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">02</span>
                        </span>
                        <div className="step-section">
                          <p>Syllabus & Content</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">03</span>
                        </span>
                        <div className="step-section">
                          <p>Accreditation</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">04</span>
                        </span>
                        <div className="step-section">
                          <p>Pricing</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">05</span>
                        </span>
                        <div className="step-section">
                          <p>SEO</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">06</span>
                        </span>
                        <div className="step-section">
                          <p>Review & Submit</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="initialization-form-set">
                  <div className="form-inner wizard-form-card">
                    <div className="title d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Syllabus & Content</h5>
                        <p>Build course structure with sections and lectures</p>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        {/* Mode Toggle Switch */}
                        <div className="d-flex align-items-center gap-2">
                          <span className={uploadMode === 'upload' ? 'fw-bold' : 'text-muted'}>Upload</span>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="uploadModeSwitch"
                              checked={uploadMode === 'manual'}
                              onChange={(e) => setUploadMode(e.target.checked ? 'manual' : 'upload')}
                              disabled={isReadOnly}
                            />
                          </div>
                          <span className={uploadMode === 'manual' ? 'fw-bold' : 'text-muted'}>Manual</span>
                        </div>

                        {/* Conditional buttons based on mode */}
                        {!isReadOnly && uploadMode === 'manual' && (
                          <Button variant="primary" onClick={() => openSectionModal()}>
                            <i className="fa-solid fa-plus me-2"></i>
                            Add Section
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Document Upload Section - Show when upload mode is active */}
                    {!isReadOnly && uploadMode === 'upload' && (
                      <div className="document-upload-section mb-4">
                        <div className="card">
                          <div className="card-body">
                            <h6 className="mb-3">
                              <i className="fa-solid fa-cloud-upload-alt me-2"></i>
                              Upload Syllabus Document
                            </h6>
                            <p className="text-muted mb-3">
                              Upload a PDF or Word document containing your course syllabus. 
                              Our system will automatically extract sections and lessons from your document.
                            </p>
                            
                            <div className="upload-area border border-2 border-dashed rounded p-4 text-center">
                              {isProcessingDocument ? (
                                <div className="processing-state">
                                  <div className="mb-3">
                                    <div className="spinner-border text-primary mb-3" role="status">
                                      <span className="visually-hidden">Processing...</span>
                                    </div>
                                  </div>
                                  <h6>
                                    {uploadProgress < 100 ? 'Uploading your document...' : 'Processing your document...'}
                                  </h6>
                                  
                                  {/* Progress Bar */}
                                  <div className="progress mb-3" style={{ height: '25px', maxWidth: '400px', margin: '0 auto' }}>
                                    <div
                                      className="progress-bar progress-bar-striped progress-bar-animated"
                                      role="progressbar"
                                      style={{ width: `${uploadProgress}%` }}
                                      aria-valuenow={uploadProgress}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    >
                                      {uploadProgress}%
                                    </div>
                                  </div>
                                  
                                  <p className="text-muted mb-0">
                                    {uploadProgress < 100 
                                      ? 'Please wait while we upload your file...' 
                                      : 'Analyzing document structure and extracting content...'}
                                  </p>
                                  
                                  {uploadedFile && (
                                    <small className="text-muted d-block mt-2">
                                      <i className="fa-solid fa-file me-1"></i>
                                      {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </small>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <i className="fa-solid fa-file-upload fs-48 text-primary mb-3"></i>
                                  <h6>Drag and drop your document here</h6>
                                  <p className="text-muted mb-3">or</p>
                                  <label htmlFor="syllabus-document-upload" className="btn btn-primary">
                                    <i className="fa-solid fa-folder-open me-2"></i>
                                    Browse Files
                                  </label>
                                  <input
                                    type="file"
                                    id="syllabus-document-upload"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleDocumentUpload}
                                    style={{ display: 'none' }}
                                  />
                                  <p className="text-muted mt-3 mb-0">
                                    <small>Supported formats: PDF, DOC, DOCX (Max size: 10MB)</small>
                                  </p>
                                </>
                              )}
                              {uploadedDocuments.length > 0 && (
                                <div className="uploaded-documents mt-4">
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">
                                      <i className="fa-solid fa-files me-2"></i>
                                      Previously Uploaded Documents ({uploadedDocuments.length})
                                    </h6>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => setShowDocumentsModal(true)}
                                    >
                                      View All
                                    </Button>
                                  </div>
                                  
                                  <div className="documents-list">
                                    {uploadedDocuments.slice(0, 3).map((doc) => (
                                      <div key={doc.id} className="document-item border rounded p-3 mb-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div className="d-flex align-items-center">
                                            <i className={`fa-solid fa-file-${doc.fileType === 'pdf' ? 'pdf text-danger' : 'word text-primary'} me-3`}></i>
                                            <div>
                                              <h6 className="mb-1">{doc.originalFileName}</h6>
                                              <div className="document-meta">
                                                <small className="text-muted me-3">
                                                  {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                                </small>
                                                <small className="text-muted me-3">
                                                  {new Date(doc.createdAt).toLocaleDateString()}
                                                </small>
                                                <span className={`badge ${
                                                  doc.processingStatus === 'completed' ? 'bg-success' :
                                                  doc.processingStatus === 'processing' ? 'bg-warning' :
                                                  doc.processingStatus === 'failed' ? 'bg-danger' : 'bg-secondary'
                                                }`}>
                                                  {doc.processingStatus}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="document-actions">
                                            <Button
                                              variant="outline-primary"
                                              size="sm"
                                              className="me-1"
                                              onClick={() => viewDocument(doc.fileUrl)}
                                              disabled={doc.processingStatus !== 'completed'}
                                            >
                                              <i className="fa-solid fa-eye me-1"></i>
                                              View
                                            </Button>
                                            {!isReadOnly && (
                                              <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteDocument(doc.id, doc.originalFileName)}
                                              >
                                                {deletingDocuments[doc.id] ? (
                                                  <>
                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                    Deleting...
                                                  </>
                                                ) : (
                                                  <>
                                                    <i className="fa-solid fa-trash me-1"></i>
                                                    Delete
                                                  </>
                                                )}
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    
                                    {uploadedDocuments.length > 3 && (
                                      <div className="text-center mt-2">
                                        <Button 
                                          variant="link" 
                                          size="sm"
                                          onClick={() => setShowDocumentsModal(true)}
                                        >
                                          Show {uploadedDocuments.length - 3} more documents
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="alert alert-info mt-3 mb-0">
                              <i className="fa-solid fa-info-circle me-2"></i>
                              <strong>Tip:</strong> For best results, structure your document with clear headings for sections 
                              and subheadings for lessons. The system will attempt to parse your document structure automatically.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isReadOnly && uploadMode === 'manual' && (
                    <div className="course-syllabus-builder">
                      {sections.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="fa-solid fa-book fs-48 text-muted mb-3"></i>
                          <h6>No sections created yet</h6>
                          <p className="text-muted">Start building your course by adding sections</p>
                        </div>
                      ) : (
                        <div className="sections-list">
                          {sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="section-card mb-4 border rounded">
                              <div className="section-header bg-light p-3 d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">Section {sectionIndex + 1}: {section.title}</h6>
                                  <small className="text-muted">{section.lessons.length} lecture(s)</small>
                                </div>
                                {!isReadOnly && (
                                  <div className="section-actions">
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => openLectureModal(sectionIndex)}
                                    >
                                      <i className="fa-solid fa-plus"></i> Add Lecture
                                    </Button>
                                    {/* Add Quiz Button */}
                                    <Button
                                      variant="outline-info"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => openQuizModal(sectionIndex)}
                                    >
                                      <i className="fa-solid fa-plus"></i> Add Quiz
                                    </Button>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => openSectionModal(section, sectionIndex)}
                                    >
                                      <i className="fa-solid fa-edit"></i>
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => deleteSection(sectionIndex)}
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <div className="section-content p-3">
                                {section.lessons.length === 0 ? (
                                  <div className="text-center py-3 text-muted">
                                    <i className="fa-solid fa-video me-2"></i>
                                    No lectures added yet
                                  </div>
                                ) : (
                                  <div className="lectures-list">
                                    {section.lessons.map((lecture, lectureIndex) => {
                                      const lectureId = `${sectionIndex}-${lectureIndex}`;
                                      const isDragged = dragState.draggedItem === lectureId;
                                      const isDropTarget = dragState.dragOverItem === lectureId;
                                      
                                      return (
                                        <div 
                                          key={lectureIndex} 
                                          draggable={!isReadOnly}
                                          onDragStart={(e) => handleDragStart(e, sectionIndex, lectureIndex)}
                                          onDragEnd={handleDragEnd}
                                          onDragOver={(e) => handleDragOver(e, sectionIndex, lectureIndex)}
                                          onDragLeave={handleDragLeave}
                                          onDrop={(e) => handleDrop(e, sectionIndex, lectureIndex)}
                                          className={`lecture-item d-flex justify-content-between align-items-center p-2 border rounded mb-2 position-relative ${
                                            isDragged ? 'lecture-item-dragging' : ''
                                          } ${
                                            isDropTarget && dragState.dragPosition === 'before' ? 'drop-indicator-before' : ''
                                          } ${
                                            isDropTarget && dragState.dragPosition === 'after' ? 'drop-indicator-after' : ''
                                          }`}
                                          style={{ 
                                            cursor: isReadOnly ? 'default' : 'move',
                                            transition: 'all 0.2s ease'
                                          }}
                                        >
                                          <div className="lecture-info d-flex align-items-center flex-grow-1">
                                            {!isReadOnly && (
                                              <div className="lecture-drag-handle me-2">
                                                <i className="fa-solid fa-grip-vertical text-muted"></i>
                                              </div>
                                            )}
                                            <div className="lecture-type-icon me-3">
                                              {lecture.type === 'video' && <i className="fa-solid fa-video text-primary"></i>}
                                              {lecture.type === 'pdf' && <i className="fa-solid fa-file-pdf text-danger"></i>}
                                              {lecture.type === 'link' && <i className="fa-solid fa-link text-info"></i>}
                                              {lecture.type === 'text' && <i className="fa-solid fa-file-text text-success"></i>}
                                            </div>
                                            <div>
                                              <h6 className="mb-1">{lecture.title}</h6>
                                              <div className="lecture-meta">
                                                <span className="badge bg-secondary me-2">{lecture.type.toUpperCase()}</span>
                                                {lecture.duration > 0 && (
                                                  <span className="text-muted me-2">
                                                    <i className="fa-solid fa-clock me-1"></i>
                                                    {lecture.duration} min
                                                  </span>
                                                )}
                                                {lecture.freePreview && (
                                                  <span className="badge bg-success">
                                                    <i className="fa-solid fa-eye me-1"></i>
                                                    Free Preview
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          
                                          {/* Keep your existing action buttons */}
                                          {!isReadOnly && (
                                            <div className="lecture-actions" onClick={(e) => e.stopPropagation()}>
                                              {/* Your existing edit and delete buttons */}
                                              <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-1"
                                                onClick={() => {
                                                  openLectureModal(sectionIndex, lecture, lectureIndex);
                                                }}
                                              >
                                                <i className="fa-solid fa-edit"></i>
                                              </Button>
                                              <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => deleteLecture(sectionIndex, lectureIndex)}
                                              >
                                                <i className="fa-solid fa-trash"></i>
                                              </Button>
                                            </div>
                                          )}
                                          
                                          {/* Drag indicator overlay */}
                                          {isDragged && (
                                            <div 
                                              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                              style={{
                                                background: 'rgba(79, 70, 229, 0.1)',
                                                border: '2px solid rgba(79, 70, 229, 0.3)',
                                                borderRadius: '0.25rem',
                                                pointerEvents: 'none'
                                              }}
                                            >
                                              <span className="badge bg-primary">Moving...</span>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {/* Quizzes List */}
                                {section.quizzes && section.quizzes.length > 0 && (
                                  <div className="quizzes-list">
                                    <h6 className="mb-3">Section Quizzes</h6>
                                    {section.quizzes.map((quiz, quizIndex) => (
                                      <div key={quiz.id || quizIndex} className="quiz-card border rounded p-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div>
                                            <h6 className="mb-1">{quiz.title}</h6>
                                            <div className="quiz-meta">
                                              <span className="badge bg-info me-2">{quiz.timeLimit} minutes</span>
                                              <span className="badge bg-success me-2">Pass: {quiz.passingScore}%</span>
                                              <span className="text-muted">{quiz.questionCount || 0} questions</span>
                                            </div>
                                          </div>
                                          {!isReadOnly && (
                                            <div className="quiz-actions">
                                              <Button
                                                variant="outline-info"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => openQuizQuestions(quiz, sectionIndex, quizIndex)}
                                              >
                                                <i className="fa-solid fa-list me-1"></i>
                                                Manage Questions
                                              </Button>
                                              <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => openQuizModal(sectionIndex, quiz, quizIndex)}
                                              >
                                                <i className="fa-solid fa-edit"></i>
                                              </Button>
                                              <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => deleteQuiz(sectionIndex, quizIndex)}
                                              >
                                                <i className="fa-solid fa-trash"></i>
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    )}

                    {!isReadOnly && (
                      <div className="add-form-btn widget-next-btn submit-btn d-flex justify-content-between mb-0">
                        <div className="btn-left d-flex gap-2">
                          <button
                            type="button"
                            className={`btn btn-outline-secondary ${isDraftSaving ? 'disabled' : ''}`}
                            onClick={saveDraft}
                            disabled={isDraftSaving}
                          >
                            {isDraftSaving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving Draft...
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-save me-1"></i>
                                Save Draft
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handlePrevious}
                          >
                            <i className="fa-solid fa-arrow-left me-1"></i>
                            Previous
                          </button>
                        </div>
                        <div className="btn-right">
                          <button
                            type="button"
                            className={`btn main-btn next_btns ${isSubmitting ? 'disabled' : ''}`}
                            onClick={handleNext}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                Next <i className="isax isax-arrow-right-3 ms-1" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Modal */}
      <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentSection ? 'Edit Section' : 'Add New Section'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Section Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter section title"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSectionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveSection}>
            {currentSection ? 'Update Section' : 'Add Section'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lecture Modal */}
      <Modal show={showLectureModal} onHide={closeLectureModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentLecture ? 'Edit Lecture' : 'Add New Lecture'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Lecture Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter lecture title"
                value={lectureForm.title}
                onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={lectureForm.type}
                    onChange={(e) => {
                      setLectureForm({ ...lectureForm, type: e.target.value as any });
                      setSelectedFile(null); // Clear selected file when type changes
                    }}
                  >
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="link">External Link</option>
                    <option value="text">Content</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={lectureForm.duration}
                    onChange={(e) => setLectureForm({ ...lectureForm, duration: parseInt(e.target.value) || 0 })}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Conditional rendering based on type */}
            {lectureForm.type === 'text' ? (
              <Form.Group className="mb-3">
                <Form.Label>Text Content <span className="text-danger">*</span></Form.Label>
                <div className="text-editor-wrapper">
                  {uploadingImage && (
                    <div className="upload-overlay">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Uploading image...</span>
                      </div>
                      <p>Uploading image...</p>
                    </div>
                  )}
                  <RichTextEditorComponent
                    value={lectureForm.textContent || ''}
                    change={(e) => setLectureForm({ ...lectureForm, textContent: e.value })}
                    toolbarSettings={{
                      items: [
                        'Bold', 'Italic', 'Underline', '|',
                        'Formats', 'Alignments', '|',
                        'OrderedList', 'UnorderedList', '|',
                        'CreateLink', 'Image', '|',
                        'SourceCode'
                      ]
                    }}
                    insertImageSettings={{
                      allowedTypes: ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
                      display: 'inline',
                      saveUrl: '/api/upload/image', // Fallback URL
                      saveFormat: 'Blob'
                    }}
                    fileManagerSettings={{ enable: false }}
                    actionBegin={handleActionBegin}
                    actionComplete={handleActionComplete}
                    imageUploading={handleImageUpload}
                    imageUploadSuccess={handleImageUploadSuccess}
                    imageUploadFailed={handleImageUploadFailure}
                    height="300px"
                  >
                    <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
                  </RichTextEditorComponent>
                </div>
                <Form.Text className="text-muted">
                  Use the editor to format your text content. You can upload images (JPG, PNG, GIF, BMP, WebP) up to 5MB.
                </Form.Text>
              </Form.Group>
            ) : lectureForm.type === 'link' ? (
              <Form.Group className="mb-3">
                <Form.Label>External URL <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://example.com/resource"
                  value={lectureForm.contentUrl}
                  onChange={(e) => setLectureForm({ ...lectureForm, contentUrl: e.target.value })}
                />
                <Form.Text className="text-muted">
                  Enter a valid URL to an external resource
                </Form.Text>
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Upload {lectureForm.type === 'video' ? 'Video' : 'PDF'} File
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept={lectureForm.type === 'video' ? 'video/*' : 'application/pdf'}
                    onChange={handleFileSelect}
                  />
                  <Form.Text className="text-muted">
                    {lectureForm.type === 'video' 
                      ? 'Accepted formats: MP4, WebM, OGG (Max 500MB)'
                      : 'Accepted format: PDF (Max 50MB)'}
                  </Form.Text>
                  {selectedFile && (
                    <div className="mt-2">
                      <span className="badge bg-success">
                        <i className="fa-solid fa-check me-1"></i>
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </Form.Group>

                <div className="text-center my-3">
                  <span className="text-muted">OR</span>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {lectureForm.type === 'video' ? 'Video URL' : 'PDF URL'}
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder={`Enter ${lectureForm.type} URL (e.g., YouTube, Vimeo, or direct URL)`}
                    value={lectureForm.contentUrl}
                    onChange={(e) => setLectureForm({ ...lectureForm, contentUrl: e.target.value })}
                    disabled={!!selectedFile}
                  />
                  <Form.Text className="text-muted">
                    You can upload a file OR provide a URL
                  </Form.Text>
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Free Preview (Allow non-enrolled students to view this lecture)"
                checked={lectureForm.freePreview}
                onChange={(e) => setLectureForm({ ...lectureForm, freePreview: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLectureModal} disabled={uploadingFile}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveLecture} disabled={uploadingFile || uploadingImage}>
            {uploadingFile ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Uploading...
                </>
              ) : uploadingImage ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Uploading Image...
                </>
              ) : (
                <>{currentLecture ? 'Update Lecture' : 'Add Lecture'}</>
              )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Quiz Modal */}
      <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentQuizIndex >= 0 ? 'Edit Quiz' : 'Add New Quiz'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Quiz Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quiz title"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter quiz description (optional)"
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Time Limit (minutes) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={quizForm.timeLimit}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) || 60 })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Passing Score (%) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={quizForm.passingScore}
                    onChange={(e) => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) || 70 })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Max Attempts <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Unlimited"
                value={quizForm.maxAttempts || ''}
                onChange={(e) => setQuizForm({ ...quizForm, maxAttempts: e.target.value ? parseInt(e.target.value) : null })}
              />
              <Form.Text className="text-muted">Leave empty for unlimited attempts</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuizModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveQuiz}>
            {currentQuizIndex >= 0 ? 'Update Quiz' : 'Add Quiz'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Question Management Modal */}
      <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Manage Questions - {currentQuiz?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6>Questions ({questions.length})</h6>
            {!isReadOnly && (
              <Button 
                variant="primary" 
                onClick={() => {
                  resetQuestionForm();
                  setShowEditQuestionModal(true);
                }}
              >
                <i className="fa-solid fa-plus me-2"></i>
                Add Question
              </Button>
            )}
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-4 border rounded">
              <i className="fa-solid fa-question fs-48 text-muted mb-3"></i>
              <h6>No questions added yet</h6>
              <p className="text-muted">Add questions to this quiz to assess student knowledge</p>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question.id || index} className="question-card border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Q{index + 1}: {question.question}</h6>
                      <div className="question-meta mb-2">
                        <span className="badge bg-secondary me-2">
                          {question.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="badge bg-info">{question.points} pts</span>
                      </div>
                    </div>
                    {!isReadOnly && (
                      <div className="question-actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => prepareEditQuestion(question)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answer.id || answerIndex} className="mb-1">
                        <span className={answer.isCorrect ? 'text-success fw-bold' : 'text-muted'}>
                          {answer.isCorrect ? '✓' : '○'} {answer.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Question Modal */}
      <Modal show={showEditQuestionModal} onHide={() => setShowEditQuestionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedQuestion ? 'Edit Question' : 'Add New Question'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={questionFormData.question}
                onChange={(e) => handleQuestionFormChange('question', e.target.value)}
                placeholder="Enter your question"
              />
              <Form.Text className="text-muted">
                Between 10 and 200 characters
              </Form.Text>
            </Form.Group>

            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-3">
                  <Form.Label>Question Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={questionFormData.type}
                    onChange={(e) => handleQuestionFormChange('type', e.target.value)}
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True or False</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Points <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="100"
                    value={questionFormData.points}
                    onChange={(e) => handleQuestionFormChange('points', parseInt(e.target.value) || 1)}
                  />
                </Form.Group>
              </div>
            </div>

            <h6 className="mb-3">Answer Options</h6>
            {[...questionFormData.answers, ...dynamicAnswers].map((answer, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <Form.Label className="mb-0">
                    {questionFormData.type === 'true_false' 
                      ? (index === 0 ? 'True' : 'False')
                      : `Choice ${index + 1}`}
                    <span className="text-danger"> *</span>
                  </Form.Label>
                  <Form.Check
                    type={questionFormData.type === 'true_false' ? 'radio' : 'checkbox'}
                    name={questionFormData.type === 'true_false' ? 'correct-answer' : undefined}
                    label="Correct Answer"
                    checked={answer.isCorrect}
                    onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                  />
                </div>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                    disabled={questionFormData.type === 'true_false'}
                    placeholder={`Enter option ${index + 1}`}
                  />
                  {index >= 2 && questionFormData.type === 'multiple_choice' && (
                    <Button
                      variant="outline-danger"
                      onClick={() => removeAnswer(index)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {questionFormData.type === 'multiple_choice' && 
            [...questionFormData.answers, ...dynamicAnswers].length < 6 && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={addNewAnswer}
              >
                <i className="fa-solid fa-plus me-1"></i>
                Add New Option
              </Button>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditQuestionModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={selectedQuestion ? handleUpdateQuestion : handleCreateQuestion}
          >
            {selectedQuestion ? 'Update Question' : 'Add Question'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDocumentsModal} onHide={() => setShowDocumentsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Uploaded Syllabus Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {uploadedDocuments.length === 0 ? (
            <div className="text-center py-4">
              <i className="fa-solid fa-folder-open fs-48 text-muted mb-3"></i>
              <h6>No documents uploaded yet</h6>
              <p className="text-muted">Upload your first syllabus document to get started</p>
            </div>
          ) : (
            <div className="documents-list">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="document-item border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-start flex-grow-1">
                      <i className={`fa-solid fa-file-${doc.fileType === 'pdf' ? 'pdf text-danger' : 'word text-primary'} me-3 mt-1`}></i>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{doc.originalFileName}</h6>
                        <div className="document-meta mb-2">
                          <small className="text-muted me-3">
                            <strong>Size:</strong> {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </small>
                          <small className="text-muted me-3">
                            <strong>Type:</strong> {doc.fileType?.toUpperCase()}
                          </small>
                          <small className="text-muted">
                            <strong>Uploaded:</strong> {new Date(doc.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="document-status">
                          <span className={`badge ${
                            doc.processingStatus === 'completed' ? 'bg-success' :
                            doc.processingStatus === 'processing' ? 'bg-warning' :
                            doc.processingStatus === 'failed' ? 'bg-danger' : 'bg-secondary'
                          } me-2`}>
                            {doc.processingStatus}
                          </span>
                          {doc.processedAt && (
                            <small className="text-muted">
                              Processed: {new Date(doc.processedAt).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="document-actions">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => viewDocument(doc.fileUrl)}
                        disabled={doc.processingStatus !== 'completed'}
                      >
                        <i className="fa-solid fa-eye me-1"></i>
                        View
                      </Button>
                      {doc.processingStatus === 'completed' && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            // Option to re-apply this document's structure
                            if (doc.extractedStructure?.sections) {
                              setSections(doc.extractedStructure.sections);
                              toast.success('Document structure applied successfully!');
                              setShowDocumentsModal(false);
                            }
                          }}
                        >
                          <i className="fa-solid fa-check me-1"></i>
                          Apply
                        </Button>
                      )}
                      {!isReadOnly && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id, doc.originalFileName)}
                        >
                        {deletingDocuments[doc.id] ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-trash me-1"></i>
                            Delete
                          </>
                        )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDocumentsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} size="xl" centered>
        <Modal.Body className="p-0">
          <div className="pdf-viewer-container" style={{ height: '80vh' }}>
            {currentPdfUrl && currentPdfUrl.endsWith('.pdf') ? (
              // PDF file - display directly
              <iframe
                src={currentPdfUrl}
                title="Document Viewer"
                className="w-100 h-100 border-0"
                style={{ minHeight: '500px' }}
              />
            ) : (
              // DOC/DOCX file - use Google Docs Viewer
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(currentPdfUrl)}&embedded=true`}
                title="Document Viewer"
                className="w-100 h-100 border-0"
                style={{ minHeight: '500px' }}
              />
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowPdfModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => window.open(currentPdfUrl, '_blank')}
          >
            <i className="fa-solid fa-external-link-alt me-2"></i>
            Open in New Tab
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default CourseSyllabus;