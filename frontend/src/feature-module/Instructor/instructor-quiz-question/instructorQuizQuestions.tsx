import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import InstructorSidebar from '../common/instructorSidebar'
import ProfileCard from '../common/profileCard'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CustomSelect from '../../../core/common/commonSelect'
import { questionApi } from '../../../core/utils/api'
import { toast } from 'react-toastify'

// Types
interface Answer {
  id: string
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

interface Quiz {
  id: string
  title: string
  timeLimit: number
  course: {
    id: string
    title: string
  }
}

interface QuestionFormData {
  question: string
  type: 'multiple_choice' | 'true_false'
  points: number
  answers: { text: string; isCorrect: boolean }[]
}

const InstructorQuizQuestions = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    hasNext: false,
    hasPrev: false
  })
  
  // Form states
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [isEditingQuestion, setIsEditingQuestion] = useState(false)
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  
  // Form data
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    type: 'multiple_choice',
    points: 1,
    answers: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  })

  const questionTypeOptions = [
    { label: "Multiple choice", value: "multiple_choice" },
    { label: "True or False", value: "true_false" },
  ]

  // Dynamic answer management for form
  const [dynamicAnswers, setDynamicAnswers] = useState<{ text: string; isCorrect: boolean }[]>([])

  // Fetch questions
  const fetchQuestions = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await questionApi.getQuizQuestions(quizId!, { 
        page: page.toString(), 
        limit: '10' 
      })
      
      if (response.success && response.data) {
        setQuiz(response.data.quiz)
        setQuestions(response.data.questions)
        setPagination(response.data.pagination)
      }
    } catch (error: any) {
      console.error('Error fetching questions:', error)
      toast.error(error.message || 'Failed to load questions')
      if (error.message?.includes('Quiz not found')) {
        navigate(all_routes.instructorQuiz)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quizId) {
      fetchQuestions()
    }
  }, [quizId])

  // Reset form
  const resetForm = () => {
    setFormData({
      question: '',
      type: 'multiple_choice',
      points: 1,
      answers: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    })
    setDynamicAnswers([])
    setSelectedQuestion(null)
  }

  // Handle form input changes
  const handleFormChange = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Reset answers when question type changes
    if (field === 'type') {
      if (value === 'true_false') {
        setFormData(prev => ({
          ...prev,
          answers: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: false }
          ]
        }))
        setDynamicAnswers([])
      } else {
        setFormData(prev => ({
          ...prev,
          answers: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }))
        setDynamicAnswers([])
      }
    }
  }

  // Handle answer changes
  const handleAnswerChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const allAnswers = [...formData.answers, ...dynamicAnswers]
    allAnswers[index] = { ...allAnswers[index], [field]: value }
    
    const baseAnswers = allAnswers.slice(0, formData.answers.length)
    const extraAnswers = allAnswers.slice(formData.answers.length)
    
    setFormData(prev => ({ ...prev, answers: baseAnswers }))
    setDynamicAnswers(extraAnswers)
  }

  // Add new answer option
  const addNewAnswer = () => {
    setDynamicAnswers([...dynamicAnswers, { text: '', isCorrect: false }])
  }

  // Remove answer option
  const removeAnswer = (index: number) => {
    if (index < formData.answers.length) {
      // Can't remove base answers
      return
    }
    const dynamicIndex = index - formData.answers.length
    setDynamicAnswers(dynamicAnswers.filter((_, i) => i !== dynamicIndex))
  }

  // Prepare question for editing
  const prepareEdit = (question: Question) => {
    setSelectedQuestion(question)
    setFormData({
      question: question.question,
      type: question.type,
      points: question.points,
      answers: question.answers.slice(0, 2).map(a => ({ text: a.text, isCorrect: a.isCorrect }))
    })
    setDynamicAnswers(
      question.answers.slice(2).map(a => ({ text: a.text, isCorrect: a.isCorrect }))
    )
  }

  // Create question
  const handleCreateQuestion = async () => {
    try {
      setIsAddingQuestion(true)
      
      const allAnswers = [...formData.answers, ...dynamicAnswers]
      
      // Validation
      if (!formData.question.trim()) {
        toast.error('Question text is required')
        return
      } else if (formData.question.trim().length < 10 || formData.question.trim().length > 200) {
        toast.error('Title must be between 10 and 200 characters');
        return
      }
      
      if (allAnswers.some(a => !a.text.trim())) {
        toast.error('All answer options must have text')
        return
      }
      
      if (!allAnswers.some(a => a.isCorrect)) {
        toast.error('At least one answer must be marked as correct')
        return
      }

      const response = await questionApi.create(quizId!, {
        questionText: formData.question,
        type: formData.type,
        points: formData.points,
        answers: allAnswers
      })

      if (response.success) {
        toast.success('Question created successfully')
        resetForm()
        await fetchQuestions(pagination.currentPage)
        // Close modal
        const modal = document.getElementById('add_question')
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal) || new (window as any).bootstrap.Modal(modal)
          bootstrapModal.hide()
        }
      }
    } catch (error: any) {
      console.error('Error creating question:', error)
      toast.error(error.message || 'Failed to create question')
    } finally {
      setIsAddingQuestion(false)
    }
  }

  // Update question
  const handleUpdateQuestion = async () => {
    if (!selectedQuestion) return
    
    try {
      setIsEditingQuestion(true)
      
      const allAnswers = [...formData.answers, ...dynamicAnswers]
      
      // Validation
      if (!formData.question.trim()) {
        toast.error('Question text is required')
        return
      } else if (formData.question.trim().length < 10 || formData.question.trim().length > 200) {
        toast.error('Title must be between 10 and 200 characters');
        return
      }
      
      if (allAnswers.some(a => !a.text.trim())) {
        toast.error('All answer options must have text')
        return
      }
      
      if (!allAnswers.some(a => a.isCorrect)) {
        toast.error('At least one answer must be marked as correct')
        return
      }

      const response = await questionApi.update(quizId!, selectedQuestion.id, {
        questionText: formData.question,
        type: formData.type,
        points: formData.points,
        answers: allAnswers
      })

      if (response.success) {
        toast.success('Question updated successfully')
        resetForm()
        await fetchQuestions(pagination.currentPage)
        // Close modal
        const modal = document.getElementById('edit_question')
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal) || new (window as any).bootstrap.Modal(modal)
          bootstrapModal.hide()
        }
      }
    } catch (error: any) {
      console.error('Error updating question:', error)
      toast.error(error.message || 'Failed to update question')
    } finally {
      setIsEditingQuestion(false)
    }
  }

  // Delete question
  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return
    
    try {
      setIsDeletingQuestion(true)
      
      const response = await questionApi.delete(quizId!, selectedQuestion.id)

      if (response.success) {
        toast.success('Question deleted successfully')
        setSelectedQuestion(null)
        await fetchQuestions(pagination.currentPage)
        // Close modal
        const modal = document.getElementById('delete_modal')
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal) || new (window as any).bootstrap.Modal(modal)
          bootstrapModal.hide()
        }
      }
    } catch (error: any) {
      console.error('Error deleting question:', error)
      toast.error(error.message || 'Failed to delete question')
    } finally {
      setIsDeletingQuestion(false)
    }
  }

  if (loading && questions.length === 0) {
    return (
      <div className="content">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="content">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            Quiz not found or you don't have permission to access it.
          </div>
        </div>
      </div>
    )
  }

  const allFormAnswers = [...formData.answers, ...dynamicAnswers]

  return (
    <>
      <Breadcrumb title='Quiz' />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <InstructorSidebar />
            <div className="col-lg-9">
              <div className="card bg-light">
                <div className="card-body">
                  <div className="row align-items-center gy-3">
                    <div className="col-xl-8">
                      <div>
                        <div className="d-sm-flex align-items-center">
                          <div className="quiz-img me-3 mb-2 mb-sm-0">
                            <ImageWithBasePath src="assets/img/students/quiz.jpg" alt="" />
                          </div>
                          <div>
                            <h5 className="mb-2">
                              <Link to="#">{quiz.title}</Link>
                            </h5>
                            <div className="question-info d-flex align-items-center">
                              <p className="d-flex align-items-center fs-14 me-2 pe-2 border-end mb-0">
                                <i className="isax isax-message-question5 text-primary-soft me-2"></i>
                                {pagination.totalQuestions} Questions
                              </p>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="isax isax-clock5 text-secondary-soft me-2"></i>
                                {quiz.timeLimit} Minutes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="d-flex align-items-center justify-content-sm-end">
                        <Link 
                          to={all_routes.instructorQuizResult.replace(':quizId', quiz.id)} 
                          className="text-info text-decoration-underline fs-12 fw-medium me-3"
                        >
                          View Results
                        </Link>
                        <Link 
                          to="#" 
                          className="btn btn-secondary" 
                          data-bs-toggle="modal" 
                          data-bs-target="#add_question"
                          onClick={resetForm}
                        >
                          Add Question
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              {questions.map((question) => (
                <div key={question.id} className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6>{question.question}</h6>
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="badge bg-info me-2">{question.points} pts</span>
                        <Link 
                          to="#" 
                          className="d-inline-flex fs-14 me-2 action-icon" 
                          data-bs-toggle="modal" 
                          data-bs-target="#edit_question"
                          onClick={() => prepareEdit(question)}
                        >
                          <i className="isax isax-edit-2"></i>
                        </Link>
                        <Link 
                          to="#" 
                          className="d-inline-flex fs-14 action-icon" 
                          data-bs-toggle="modal" 
                          data-bs-target="#delete_modal"
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <i className="isax isax-trash"></i>
                        </Link>
                      </div>
                    </div>
                    <div>
                      {question.answers.map((answer, answerIndex) => (
                        <div key={answer.id} className="form-check mb-2">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name={`question-${question.id}`} 
                            id={`radio-${question.id}-${answerIndex}`}
                            checked={answer.isCorrect}
                            readOnly
                          />
                          <label 
                            className={`form-check-label ${answer.isCorrect ? 'fw-bold text-success' : ''}`} 
                            htmlFor={`radio-${question.id}-${answerIndex}`}
                          >
                            {answer.text}
                            {answer.isCorrect && <span className="ms-2 text-success">(Correct)</span>}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More */}
              {pagination.hasNext && (
                <div className="text-center">
                  <button 
                    onClick={() => fetchQuestions(pagination.currentPage + 1)}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}

              {questions.length === 0 && !loading && (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="isax isax-message-question5 fs-48 text-muted mb-3"></i>
                    <h5 className="text-muted">No Questions Yet</h5>
                    <p className="text-muted">Start building your quiz by adding the first question.</p>
                    <Link 
                      to="#" 
                      className="btn btn-secondary" 
                      data-bs-toggle="modal" 
                      data-bs-target="#add_question"
                      onClick={resetForm}
                    >
                      Add First Question
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Question Modal */}
      <div className="modal fade" id="add_question">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Add New Question</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateQuestion(); }}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Question <span className="text-danger"> *</span>
                  </label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={formData.question}
                    onChange={(e) => handleFormChange('question', e.target.value)}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">
                        Question Type <span className="text-danger"> *</span>
                      </label>
                      <CustomSelect
                        className="select"
                        options={questionTypeOptions}
                        value={questionTypeOptions.find(opt => opt.value === formData.type)}
                        onChange={(option: any) => handleFormChange('type', option.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Points <span className="text-danger"> *</span>
                      </label>
                      <input 
                        type="number" 
                        className="form-control"
                        min="1"
                        max="100"
                        value={formData.points}
                        onChange={(e) => handleFormChange('points', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <h6 className="mb-3">Answer Options</h6>
                <div className="add-choice-data">
                  {allFormAnswers.map((answer, index) => (
                    <div className="mb-3" key={index}>
                      <div className="d-flex align-items-end justify-content-between">
                        <div className="flex-fill">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="form-label">
                              {formData.type === 'true_false' ? (index === 0 ? 'True' : 'False') : `Choice ${index + 1}`}
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="form-check form-switch form-switch-end">
                              <label className="form-check-label" htmlFor={`switch-add-${index}`}>
                                Correct Answer
                              </label>
                              <input
                                className="form-check-input"
                                type={formData.type === 'true_false' ? 'radio' : 'checkbox'}
                                name={formData.type === 'true_false' ? 'correct-answer' : undefined}
                                role="switch"
                                id={`switch-add-${index}`}
                                checked={answer.isCorrect}
                                onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                              />
                            </div>
                          </div>
                          <input 
                            type="text" 
                            className="form-control"
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                            disabled={formData.type === 'true_false'}
                            required
                          />
                        </div>
                        {index >= 2 && formData.type === 'multiple_choice' && (
                          <Link
                            onClick={(e) => {
                              e.preventDefault();
                              removeAnswer(index);
                            }}
                            to="#"
                            className="delete-item ms-4"
                          >
                            <i className="isax isax-trash" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.type === 'multiple_choice' && allFormAnswers.length < 6 && (
                  <Link
                    to="#"
                    className="text-secondary d-inline-flex align-items-center fw-medium add-choice"
                    onClick={(e) => { e.preventDefault(); addNewAnswer(); }}
                  >
                    <i className="isax isax-add me-1" />
                    Add New Option
                  </Link>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn bg-gray-100 rounded-pill me-2"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-secondary rounded-pill" 
                  type="submit"
                  disabled={isAddingQuestion}
                >
                  {isAddingQuestion ? 'Adding...' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Question Modal */}
      <div className="modal fade" id="edit_question">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Edit Question</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateQuestion(); }}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Question <span className="text-danger"> *</span>
                  </label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={formData.question}
                    onChange={(e) => handleFormChange('question', e.target.value)}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">
                        Question Type <span className="text-danger"> *</span>
                      </label>
                      <CustomSelect
                        className="select"
                        options={questionTypeOptions}
                        value={questionTypeOptions.find(opt => opt.value === formData.type)}
                        onChange={(option: any) => handleFormChange('type', option.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Points <span className="text-danger"> *</span>
                      </label>
                      <input 
                        type="number" 
                        className="form-control"
                        min="1"
                        max="100"
                        value={formData.points}
                        onChange={(e) => handleFormChange('points', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <h6 className="mb-3">Answer Options</h6>
                <div className="add-choice-data">
                  {allFormAnswers.map((answer, index) => (
                    <div className="mb-3" key={index}>
                      <div className="d-flex align-items-end justify-content-between">
                        <div className="flex-fill">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="form-label">
                              {formData.type === 'true_false' ? (index === 0 ? 'True' : 'False') : `Choice ${index + 1}`}
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="form-check form-switch form-switch-end">
                              <label className="form-check-label" htmlFor={`switch-edit-${index}`}>
                                Correct Answer
                              </label>
                              <input
                                className="form-check-input"
                                type={formData.type === 'true_false' ? 'radio' : 'checkbox'}
                                name={formData.type === 'true_false' ? 'correct-answer-edit' : undefined}
                                role="switch"
                                id={`switch-edit-${index}`}
                                checked={answer.isCorrect}
                                onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                              />
                            </div>
                          </div>
                          <input 
                            type="text" 
                            className="form-control"
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                            disabled={formData.type === 'true_false'}
                            required
                          />
                        </div>
                        {index >= 2 && formData.type === 'multiple_choice' && (
                          <Link
                            onClick={(e) => {
                              e.preventDefault();
                              removeAnswer(index);
                            }}
                            to="#"
                            className="delete-item ms-4"
                          >
                            <i className="isax isax-trash" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.type === 'multiple_choice' && allFormAnswers.length < 6 && (
                  <Link
                    to="#"
                    className="text-secondary d-inline-flex align-items-center fw-medium add-choice"
                    onClick={(e) => { e.preventDefault(); addNewAnswer(); }}
                  >
                    <i className="isax isax-add me-1" />
                    Add New Option
                  </Link>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn bg-gray-100 rounded-pill me-2"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-secondary rounded-pill" 
                  type="submit"
                  disabled={isEditingQuestion}
                >
                  {isEditingQuestion ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-secondary-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Delete Question</h4>
                <p className="mb-3">
                  Are you sure you want to delete this question? This action cannot be undone.
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger rounded-pill"
                    onClick={handleDeleteQuestion}
                    disabled={isDeletingQuestion}
                  >
                    {isDeletingQuestion ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InstructorQuizQuestions