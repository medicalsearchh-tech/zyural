import { useState, useEffect } from "react";
import { all_routes } from "../../../router/all_routes";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { getInstructorApi, categoryApi } from "../../../../core/utils/api";
import { toast } from "react-toastify";

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profileImage: string;
  avatar: string;
  expertise: string;
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  courseCount: number;
  totalLessons: number;
  totalDuration: string;
  totalStudents: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount?: number;
}

interface Filters {
  category: string;
  level: string;
  search: string;
  sortBy: string;
  page: number;
}

const InstructorList = () => {
  const route = all_routes;
  
  // State management
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [_selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filters state
  const [filters, setFilters] = useState<Filters>({
    category: '',
    level: '',
    search: '',
    sortBy: 'createdAt',
    page: 1
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        let categoriesData = [];
        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data?.categories && Array.isArray(response.data.categories)) {
          categoriesData = response.data.categories;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        }
        setCategories(categoriesData);
      } catch (err) {
        toast.error(`Error fetching categories: ${err}`);
      }
    };

    fetchCategories();
  }, []);

  // Fetch instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        console.log('Fetching instructors with filters:', filters);
        
        const response = await getInstructorApi.getInstructors({
          category: filters.category,
          level: filters.level,
          search: filters.search,
          sortBy: filters.sortBy,
          page: filters.page,
          limit: 9
        });

        console.log('API Response:', response);

        if (response.success && response.data) {
          const instructorsData = response.data.instructors || [];
          console.log('Instructors data:', instructorsData);
          
          setInstructors(instructorsData);
          
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 1);
            setTotalItems(response.data.pagination.totalInstructors || instructorsData.length);
          } else {
            setTotalPages(1);
            setTotalItems(instructorsData.length);
          }
        } else {
          console.error('API response indicates failure:', response);
          setInstructors([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } catch (err: any) {
        console.error('Error fetching instructors:', err);
        toast.error('Failed to load instructors');
        setInstructors([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [filters]);

  const handleItemClick = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryId ? '' : categoryId,
      page: 1
    }));
  };

  const handleLevelChange = (level: string) => {
    setFilters(prev => ({
      ...prev,
      level: prev.level === level ? '' : level,
      page: 1
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      sortBy: e.target.value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      search: '',
      sortBy: 'createdAt',
      page: 1
    });
  };

  // Get profile image URL - prioritize profileImage, fallback to avatar
  const getProfileImage = (instructor: Instructor) => {
    return instructor.profileImage || instructor.avatar || "assets/img/user/user-61.jpg";
  };

  // Get instructor name - use fullName if available, otherwise combine first and last
  const getInstructorName = (instructor: Instructor) => {
    return instructor.fullName || `${instructor.firstName} ${instructor.lastName}`;
  };

  return (
    <>
      <Breadcrumb title="Instructor List" />
      <div className="main-wrapper">
        <div className="instructor-list">
          <div className="container">
            <div className="row align-items-baseline">
              <div className="col-lg-3">
                <div className="clear-filter mb-4 pb-lg-2 d-flex align-items-center justify-content-between">
                  <h5>
                    <i className="feather-filter me-2" />
                    Filters
                  </h5>
                  <Link to="#" onClick={clearFilters} className="clear-text">
                    Clear
                  </Link>
                </div>
                <div className="filter-clear">
                  <div className="accordion accordion-customicon1 accordions-items-seperate">
                    {/* Categories Filter */}
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingcustomicon1One">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapsecustomicon1One"
                          aria-expanded="true"
                          aria-controls="collapsecustomicon1One"
                        >
                          Categories <i className="fa-solid fa-chevron-down" />
                        </button>
                      </h2>
                      <div
                        id="collapsecustomicon1One"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingcustomicon1One"
                        data-bs-parent="#accordioncustomicon1Example"
                      >
                        <div className="accordion-body">
                          {categories.map((category) => (
                            <div key={category.id}>
                              <label className="custom_check">
                                <input
                                  type="checkbox"
                                  checked={filters.category === category.id}
                                  onChange={() => handleCategoryChange(category.id)}
                                />
                                <span className="checkmark" /> {category.name}
                                {category.courseCount && ` (${category.courseCount})`}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Level Filter */}
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingcustomicon1Five">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapsecustomicon1Five"
                          aria-expanded="true"
                          aria-controls="collapsecustomicon1Five"
                        >
                          Level
                          <i className="fa-solid fa-chevron-down" />
                        </button>
                      </h2>
                      <div
                        id="collapsecustomicon1Five"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingcustomicon1Five"
                        data-bs-parent="#accordioncustomicon1Example"
                      >
                        <div className="accordion-body">
                          {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <div key={level}>
                              <label className="custom_check custom_one">
                                <input
                                  type="checkbox"
                                  checked={filters.level === level}
                                  onChange={() => handleLevelChange(level)}
                                />
                                <span className="checkmark" />
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                {/* Filter Header */}
                <div className="showing-list mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="show-result text-center text-lg-start">
                        <h6 className="fw-medium">
                          Showing {instructors.length > 0 ? ((filters.page - 1) * 9 + 1) : 0}-
                          {Math.min(filters.page * 9, totalItems)} of {totalItems} results
                        </h6>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="show-filter add-course-info">
                        <form action="#">
                          <div className="d-sm-flex justify-content-center justify-content-lg-end mb-1 mb-lg-0">
                            <div className="view-icons mb-2 mb-sm-0">
                              <Link to={route.instructorGrid} className="grid-view">
                                <i className="isax isax-element-3" />
                              </Link>
                              <Link to={route.instructorList} className="list-view active">
                                <i className="isax isax-task" />
                              </Link>
                            </div>
                            <select className="form-select" onChange={handleSortChange} value={filters.sortBy}>
                              <option value="createdAt">Newly Published</option>
                              <option value="rating">Top Rated</option>
                              <option value="firstName">Name (A-Z)</option>
                            </select>
                            <div className="search-group">
                              <i className="feather-search" />
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search instructors..."
                                value={filters.search}
                                onChange={handleSearch}
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Filter */}

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading instructors...</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && instructors.length === 0 && (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="fas fa-users fa-3x text-muted"></i>
                    </div>
                    <h5>No instructors found</h5>
                    <p className="text-muted">
                      {filters.search || filters.category || filters.level 
                        ? "Try adjusting your search filters" 
                        : "No instructors are currently available"}
                    </p>
                    {(filters.search || filters.category || filters.level) && (
                      <button className="btn btn-primary mt-2" onClick={clearFilters}>
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}

                {/* Instructors List */}
                {!loading && instructors.length > 0 && (
                  <>
                    {instructors.map((instructor) => (
                      <div key={instructor.id} className="instructor-item instructor-item-seven mb-4">
                        <div className="instructor-img">
                          <Link to={`${route.instructorDetails.replace(':id', instructor.id)}`}>
                            <ImageWithBasePath
                              src={getProfileImage(instructor)}
                              alt={getInstructorName(instructor)}
                              className="img-fluid"
                              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                          </Link>
                          <div
                            className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2"
                            onClick={() => handleItemClick(instructor.id)}
                          >
                            {instructor.isVerified && (
                              <span className="verify">
                                <ImageWithBasePath
                                  src="assets/img/icons/verify-icon.svg"
                                  alt="verified"
                                  className="img-fluid"
                                />
                              </span>
                            )}
                            {/* <Link
                              className={`favourite ms-auto ${selectedItems[instructor.id] ? "selected" : ""}`}
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleItemClick(instructor.id);
                              }}
                            >
                              <i className="isax isax-heart" />
                            </Link> */}
                          </div>
                        </div>
                        <div className="instructor-content flex-fill">
                          <div className="pb-3 border-bottom mb-3">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 mb-1">
                              <div>
                                <h6 className="title">
                                  <Link to={`${route.instructorDetails.replace(':id', instructor.id)}`}>
                                    {getInstructorName(instructor)}
                                  </Link>
                                </h6>
                                <span className="designation">{instructor.expertise || 'Instructor'}</span>
                              </div>
                              <div>
                                <p className="rating">
                                  <i className="fas fa-star me-1" />
                                  {instructor.rating.toFixed(1)} ({instructor.reviewCount} Reviews)
                                </p>
                              </div>
                            </div>
                            <p className="mb-0">
                              {instructor.bio || `${getInstructorName(instructor)} is a professional instructor with ${instructor.courseCount} courses and ${instructor.totalStudents} students.`}
                            </p>
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div className="d-flex align-items-center flex-wrap gap-y-2 fs-14 counts-details">
                              <span className="d-flex align-items-center me-4">
                                <span className="d-flex align-items-center">
                                  <i className="isax isax-book-saved5 fs-16 text-secondary me-2" />
                                </span>
                                {instructor.courseCount} Course{instructor.courseCount !== 1 ? 's' : ''}
                              </span>
                              <span className="d-flex align-items-center me-4">
                                <span className="d-flex align-items-center">
                                  <i className="isax isax-video-play5 fs-16 text-primary me-2" />
                                </span>
                                {instructor.totalLessons}+ Lessons
                              </span>
                              <span className="d-flex align-items-center me-4">
                                <span className="d-flex align-items-center">
                                  <i className="isax isax-timer-start5 fs-16 text-warning me-2" />
                                </span>
                                {instructor.totalDuration}
                              </span>
                              <span className="d-flex align-items-center">
                                <span className="d-flex align-items-center">
                                  <i className="isax isax-profile-2user5 fs-16 text-success me-2" />
                                </span>
                                {instructor.totalStudents}+ Students
                              </span>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-1">
                              <div className="badge bg-gray-100 text-dark badge-md fs-10 fw-medium rounded">
                                {instructor.expertise || 'Instructor'}
                              </div>
                              {instructor.courseCount > 0 && (
                                <div className="badge bg-primary-soft text-primary badge-md fs-10 fw-medium rounded">
                                  {instructor.courseCount} Courses
                                </div>
                              )}
                              {instructor.isVerified && (
                                <div className="badge bg-success-soft text-success badge-md fs-10 fw-medium rounded">
                                  Verified
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="row align-items-center mt-4">
                        <div className="col-md-2">
                          <p className="pagination-text">
                            Page {filters.page} of {totalPages}
                          </p>
                        </div>
                        <div className="col-md-10">
                          <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                            <li className={`page-item prev ${filters.page === 1 ? 'disabled' : ''}`}>
                              <Link
                                className="page-link"
                                to="#"
                                onClick={() => filters.page > 1 && handlePageChange(filters.page - 1)}
                                tabIndex={-1}
                              >
                                <i className="fas fa-angle-left" />
                              </Link>
                            </li>
                            {[...Array(totalPages)].map((_, index) => {
                              const page = index + 1;
                              if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= filters.page - 1 && page <= filters.page + 1)
                              ) {
                                return (
                                  <li
                                    key={page}
                                    className={`page-item ${filters.page === page ? 'active' : ''}`}
                                  >
                                    <Link
                                      className="page-link"
                                      to="#"
                                      onClick={() => handlePageChange(page)}
                                    >
                                      {page}
                                    </Link>
                                  </li>
                                );
                              } else if (page === filters.page - 2 || page === filters.page + 2) {
                                return (
                                  <li key={page} className="page-item">
                                    <span className="page-link">...</span>
                                  </li>
                                );
                              }
                              return null;
                            })}
                            <li className={`page-item next ${filters.page === totalPages ? 'disabled' : ''}`}>
                              <Link
                                className="page-link"
                                to="#"
                                onClick={() => filters.page < totalPages && handlePageChange(filters.page + 1)}
                              >
                                <i className="fas fa-angle-right" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorList;