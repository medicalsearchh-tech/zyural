import { useState, useEffect } from 'react'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ProfileCard from '../common/profileCard'
import InstructorSidebar from '../common/instructorSidebar'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import CustomSelect from '../../../core/common/commonSelect'
import { TimePicker } from 'antd'
import dayjs from 'dayjs'
import { quizApi } from '../../../core/utils/api'
import { toast } from 'react-toastify'

// Types
interface Course {
  label: string
  value: string
}

interface Quiz {
  id: string
  title: string
  description?: string
  timeLimit: number
  passingScore: number
  maxAttempts: number | null
  isActive: boolean
  questionsCount: number
  totalMarks: number
  course: {
    id: string
    title: string
    slug: string
  }
  stats: {
    totalAttempts: number
    completedAttempts: number
    passedAttempts: number
    passRate: number
  }
  createdAt: string
  updatedAt: string
}

interface QuizFormData {
  courseId: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number | null
  isActive: boolean
}

const InstructorQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuizzes: 0,
    hasNext: false,
    hasPrev: false
  })

  // Form states
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  // Form data
  const [formData, setFormData] = useState<QuizFormData>({
    courseId: '',
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    isActive: true
  })

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('')

  const getModalContainer = () => {
    const modalElement = document.getElementById('add_quiz')
    return modalElement ? modalElement : document.body
  }

  const getModalContainer2 = () => {
    const modalElement = document.getElementById('edit_quiz')
    return modalElement ? modalElement : document.body
  }

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await quizApi.getCourses()
      if (response.success && response.data) {
        setCourses(response.data)
      }
    } catch (error: any) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    }
  }

  // Fetch quizzes
  const fetchQuizzes = async (page: number = 1, search: string = '', courseId: string = '') => {
    try {
      setLoading(true)
      const response = await quizApi.getInstructorQuizzes({
        page: page.toString(),
        limit: '10',
        search,
        courseId
      })

      if (response.success && response.data) {
        setQuizzes(response.data.quizzes)
        setPagination(response.data.pagination)
      }
    } catch (error: any) {
      console.error('Error fetching quizzes:', error)
      toast.error('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    fetchQuizzes()
  }, [])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchQuizzes(1, searchTerm, selectedCourseFilter)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      description: '',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      isActive: true
    })
    setSelectedQuiz(null)
  }

  // Handle form input changes
  const handleFormChange = (field: keyof QuizFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Prepare quiz for editing
  const prepareEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setFormData({
      courseId: quiz.course.id,
      title: quiz.title,
      description: quiz.description || '',
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      isActive: quiz.isActive
    })
  }

  // Create quiz
  const handleCreateQuiz = async () => {
    try {
      setIsCreating(true)

      // Validation
      if (!formData.courseId) {
        toast.error('Please select a course')
        return
      }
      if (!formData.title.trim()) {
        toast.error('Quiz title is required')
        return
      }
      if (formData.timeLimit <= 0) {
        toast.error('Time limit must be greater than 0')
        return
      }
      if (formData.passingScore < 0 || formData.passingScore > 100) {
        toast.error('Passing score must be between 0 and 100')
        return
      }

      const response = await quizApi.create({
        courseId: formData.courseId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        maxAttempts: formData.maxAttempts || undefined,
        isActive: formData.isActive
      })

      if (response.success) {
        toast.success('Quiz created successfully')
        resetForm()
        await fetchQuizzes(pagination.currentPage, searchTerm, selectedCourseFilter)
        // Close modal
        const modal = document.getElementById('add_quiz')
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal) || new (window as any).bootstrap.Modal(modal)
          bootstrapModal.hide()
        }
      }
    } catch (error: any) {
      console.error('Error creating quiz:', error)
      toast.error(error.message || 'Failed to create quiz')
    } finally {
      setIsCreating(false)
    }
  }

  // Update quiz
  const handleUpdateQuiz = async () => {
    if (!selectedQuiz) return

    try {
      setIsEditing(true)

      // Validation
      if (!formData.courseId) {
        toast.error('Please select a course')
        return
      }
      if (!formData.title.trim()) {
        toast.error('Quiz title is required')
        return
      }
      if (formData.timeLimit <= 0) {
        toast.error('Time limit must be greater than 0')
        return
      }
      if (formData.passingScore < 0 || formData.passingScore > 100) {
        toast.error('Passing score must be between 0 and 100')
        return
      }

      const response = await quizApi.update(selectedQuiz.id, {
        courseId: formData.courseId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        maxAttempts: formData.maxAttempts || undefined,
        isActive: formData.isActive
      })

      if (response.success) {
        toast.success('Quiz updated successfully')
        resetForm()
        await fetchQuizzes(pagination.currentPage, searchTerm, selectedCourseFilter)
        // Close modal
        const modal = document.getElementById('edit_quiz')
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal) || new (window as any).bootstrap.Modal(modal)
          bootstrapModal.hide()
        }
      }
    } catch (error: any) {
      console.error('Error updating quiz:', error)
      toast.error(error.message || 'Failed to update quiz')
    } finally {
      setIsEditing(false)
    }
  }

  // Delete quiz
  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return

    try {
      setIsDeleting(true)

      const response = await quizApi.delete(selectedQuiz.id)

      if (response.success) {
        toast.success(response.message || 'Quiz deleted successfully')
        setSelectedQuiz(null)
        await fetchQuizzes(pagination.currentPage, searchTerm, selectedCourseFilter)
        // Close modal
        const modal = document.getElementById('delete_modal')
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal) || new (window as any).bootstrap.Modal(modal)
          bootstrapModal.hide()
        }
      }
    } catch (error: any) {
      console.error('Error deleting quiz:', error)
      toast.error(error.message || 'Failed to delete quiz')
    } finally {
      setIsDeleting(false)
    }
  }

  // Format time limit for display
  const formatTimeLimit = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  // Convert minutes to dayjs time format
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return dayjs().hour(hours).minute(mins).second(0)
  }

  // Convert time picker value to minutes
  const timeToMinutes = (time: any) => {
    if (!time) return 30
    return time.hour() * 60 + time.minute()
  }

  return (
    <>
      <Breadcrumb title='Quiz' />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <InstructorSidebar />
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Quiz</h5>
                <div>
                  <button 
                    className="btn btn-secondary" 
                    data-bs-toggle="modal" 
                    data-bs-target="#add_quiz"
                    onClick={resetForm}
                  >
                    Add Quiz
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="card mb-3">
                <div className="card-body">
                  <form onSubmit={handleSearch}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="form-label">Search Quizzes</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="form-label">Filter by Course</label>
                          <CustomSelect
                            options={[{ label: 'All Courses', value: '' }, ...courses]}
                            value={courses.find(c => c.value === selectedCourseFilter) || { label: 'All Courses', value: '' }}
                            onChange={(option: any) => setSelectedCourseFilter(option.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="form-label">&nbsp;</label>
                          <div>
                            <button type="submit" className="btn btn-primary me-2">Search</button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                setSearchTerm('')
                                setSelectedCourseFilter('')
                                fetchQuizzes(1, '', '')
                              }}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Quiz List */}
                  {quizzes.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="isax isax-message-question5 text-muted" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3">No quizzes found</h5>
                      <p className="text-muted">Create your first quiz to get started.</p>
                      <button 
                        className="btn btn-primary"
                        data-bs-toggle="modal" 
                        data-bs-target="#add_quiz"
                        onClick={resetForm}
                      >
                        Add Quiz
                      </button>
                    </div>
                  ) : (
                    quizzes.map((quiz) => (
                      <div key={quiz.id} className="border rounded-2 p-3 mb-3">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <div>
                              <h6 className="mb-2">
                                <Link to={all_routes.instructorQA.replace(':quizId',quiz.id)}>
                                  {quiz.title}
                                </Link>
                                {!quiz.isActive && (
                                  <span className="badge badge-danger ms-2">Inactive</span>
                                )}
                              </h6>
                              <p className="text-muted mb-2 small">{quiz.course.title}</p>
                              <div className="question-info d-flex align-items-center">
                                <p className="d-flex align-items-center fs-14 me-2 pe-2 border-end mb-0">
                                  <i className="isax isax-message-question5 text-primary-soft me-2"></i>
                                  {quiz.questionsCount} Questions
                                </p>
                                <p className="d-flex align-items-center fs-14 me-2 pe-2 border-end mb-0">
                                  <i className="isax isax-clock5 text-secondary-soft me-2"></i>
                                  {formatTimeLimit(quiz.timeLimit)}
                                </p>
                                <p className="d-flex align-items-center fs-14 me-2 pe-2 border-end mb-0">
                                  <i className="isax isax-award5 text-success-soft me-2"></i>
                                  {quiz.totalMarks} Points
                                </p>
                                <p className="d-flex align-items-center fs-14 mb-0">
                                  <i className="isax isax-chart-success5 text-info-soft me-2"></i>
                                  Pass: {quiz.passingScore}%
                                </p>
                              </div>
                              {quiz.stats.totalAttempts > 0 && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    {quiz.stats.completedAttempts} completed attempts • {quiz.stats.passRate}% pass rate
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="d-flex align-items-center justify-content-end mt-2 mt-md-0">
                              <Link 
                                to={`${all_routes.instructorQuizResult.replace(':quizId', quiz.id)}`} 
                                className="text-info text-decoration-underline fs-12 fw-medium me-3"
                              >
                                View Results
                              </Link>
                              <button 
                                className="d-inline-flex fs-14 me-1 action-icon btn btn-link p-0" 
                                data-bs-toggle="modal" 
                                data-bs-target="#edit_quiz"
                                onClick={() => prepareEdit(quiz)}
                              >
                                <i className="isax isax-edit-2"></i>
                              </button>
                              <button 
                                className="d-inline-flex fs-14 action-icon btn btn-link p-0" 
                                data-bs-toggle="modal" 
                                data-bs-target="#delete_modal"
                                onClick={() => setSelectedQuiz(quiz)}
                              >
                                <i className="isax isax-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <nav aria-label="Quiz pagination" className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => fetchQuizzes(pagination.currentPage - 1, searchTerm, selectedCourseFilter)}
                            disabled={!pagination.hasPrev}
                          >
                            Previous
                          </button>
                        </li>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                          <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => fetchQuizzes(page, searchTerm, selectedCourseFilter)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => fetchQuizzes(pagination.currentPage + 1, searchTerm, selectedCourseFilter)}
                            disabled={!pagination.hasNext}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Quiz Modal */}
      <div className="modal fade" id="add_quiz">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Add New Quiz</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="mb-3">
                <label className="form-label">
                  Course <span className="text-danger"> *</span>
                </label>
                <CustomSelect
                  className="select"
                  options={courses}
                  value={courses.find(c => c.value === formData.courseId)}
                  onChange={(option: any) => handleFormChange('courseId', option.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Quiz Title <span className="text-danger"> *</span>
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Enter quiz description (optional)"
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Passing Score (%) <span className="text-danger"> *</span>
                    </label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={formData.passingScore}
                      onChange={(e) => handleFormChange('passingScore', parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Max Attempts
                    </label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={formData.maxAttempts || ''}
                      onChange={(e) => handleFormChange('maxAttempts', e.target.value ? parseInt(e.target.value) : null)}
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Duration <span className="text-danger"> *</span>
                    </label>
                    <div className="input-icon-end position-relative">
                      <TimePicker 
                        getPopupContainer={getModalContainer} 
                        className="form-control timepicker"
                        value={minutesToTime(formData.timeLimit)}
                        onChange={(time) => handleFormChange('timeLimit', timeToMinutes(time))}
                        format="HH:mm"
                        showSecond={false}
                      />
                      <span className="input-icon-addon">
                        <i className="isax isax-clock" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <div className="form-check mt-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="isActiveAdd"
                        checked={formData.isActive}
                        onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="isActiveAdd">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
                type="button"
                onClick={handleCreateQuiz}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating...
                  </>
                ) : (
                  'Add Quiz'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Quiz Modal */}
      <div className="modal fade" id="edit_quiz">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Edit Quiz</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="mb-3">
                <label className="form-label">
                  Course <span className="text-danger"> *</span>
                </label>
                <CustomSelect
                  className="select"
                  options={courses}
                  modal={true}
                  value={courses.find(c => c.value === formData.courseId)}
                  onChange={(option: any) => handleFormChange('courseId', option.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Quiz Title <span className="text-danger"> *</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Enter quiz description (optional)"
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Passing Score (%) <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.passingScore}
                      onChange={(e) => handleFormChange('passingScore', parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Max Attempts
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.maxAttempts || ''}
                      onChange={(e) => handleFormChange('maxAttempts', e.target.value ? parseInt(e.target.value) : null)}
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Duration <span className="text-danger"> *</span>
                    </label>
                    <div className="input-icon-end position-relative">
                      <TimePicker 
                        getPopupContainer={getModalContainer2} 
                        className="form-control timepicker"
                        value={minutesToTime(formData.timeLimit)}
                        onChange={(time) => handleFormChange('timeLimit', timeToMinutes(time))}
                        format="HH:mm"
                        showSecond={false}
                      />
                      <span className="input-icon-addon">
                        <i className="isax isax-clock" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <div className="form-check mt-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="isActiveEdit"
                        checked={formData.isActive}
                        onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="isActiveEdit">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
                type="button"
                onClick={handleUpdateQuiz}
                disabled={isEditing}
              >
                {isEditing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Delete Quiz</h4>
                <p className="mb-3">
                  Are you sure you want to delete "{selectedQuiz?.title}"? This action cannot be undone.
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-secondary rounded-pill"
                    onClick={handleDeleteQuiz}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Deleting...
                      </>
                    ) : (
                      'Yes, Delete'
                    )}
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

export default InstructorQuiz