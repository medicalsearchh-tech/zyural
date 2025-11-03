import React, { useState, useEffect } from 'react'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
// import { Slider } from 'antd'
// import type { SliderSingleProps } from 'antd'
import { all_routes } from '../../router/all_routes'
import { courseApi, categoryApi } from '../../../core/utils/api'

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  subtitle: string;
  heroImageUrl: string;
  pricing: {
    price: number
    certPrice: number
    currency: string
    accessType: string
    visibility: string
  }
  level: string;
  learningObjectives: string
  targetAudience: string[]
  averageRating?: number
  totalReviews: number
  totalEnrollments: number
  accreditedCreditHours: number;
  accreditedCreditType: 'CME' | 'CPD' | null;
  instructor: {
    id: string
    firstName: string
    lastName: string
    avatar: string
    bio: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  stats: {
    totalLessons: number;
    totalDuration: number;
    sectionsCount: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [_selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    page: 1,
    limit: 9,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  const route = all_routes;
  // const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `$${value}`;

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourses(filters);
      
      if (response.success) {
        setCourses(response.data.courses);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategory = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoryApi.getCategories();
      
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategory();
  }, [filters]);

  const handleItemClick = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    setFilters(prev => ({ ...prev, search: searchValue, page: 1 }));
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortBy = 'createdAt';
    let sortOrder = 'DESC';

    switch (value) {
      case 'Newly Published':
        sortBy = 'createdAt';
        sortOrder = 'DESC';
        break;
      case 'Trending Courses':
        sortBy = 'totalReviews';
        sortOrder = 'DESC';
        break;
      case 'Top Rated':
        sortBy = 'averageRating';
        sortOrder = 'DESC';
        break;
    }

    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  // Handle level filter
  const handleLevelChange = (level: string) => {
    setFilters(prev => ({ 
      ...prev, 
      level: prev.level === level ? '' : level, 
      page: 1 
    }));
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ 
      ...prev, 
      category: prev.category === category ? '' : category, 
      page: 1 
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      page: 1,
      limit: 9,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
  };

  // Render star averageRating
  const renderStars = (averageRating?: number) => {
    const numRating = typeof averageRating === 'number' && !isNaN(averageRating) ? averageRating : 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    return (
      <>
        {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={`fa-solid fa-star me-1 ${
              index < fullStars
                ? 'text-warning'
                : (index === fullStars && hasHalfStar)
                  ? 'text-warning'
                  : 'text-grey'
            }`}
          />
        ))}
      </>
    );
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}hr ${remainingMinutes}min`;
  };

  return (
    <>
      <Breadcrumb title='Course List' />
      
      <section className="course-content course-list-content">
        <div className="container">
          <div className="row align-items-baseline">
            <div className="col-lg-3 theiaStickySidebar">
              <div className="filter-clear">
                <div className="clear-filter mb-4 pb-lg-2 d-flex align-items-center justify-content-between">
                  <h5>
                    <i className="feather-filter me-2" />
                    Filters
                  </h5>
                  <Link to="#" className="clear-text" onClick={clearFilters}>
                    Clear
                  </Link>
                </div>
                <div className="accordion accordion-customicon1 accordions-items-seperate">
                  {/* Categories Filter */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1One">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1One"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1One"
                      >
                        Categories <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1One"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1One"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        {categoriesLoading ? (
                          <div className="text-center">
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading categories...</span>
                            </div>
                          </div>
                        ) : (
                          categories.map((category) => (
                            <div key={category.id}>
                              <label className="custom_check">
                                <input 
                                  type="checkbox" 
                                  name="select_category"
                                  checked={filters.category === category.id}
                                  onChange={() => handleCategoryChange(category.id)}
                                />
                                <span className="checkmark" /> {category.name} ({category.courseCount})
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1Three">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Three"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Three"
                      >
                        Price
                        <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Three"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1Three"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        <div>
                          <label className="custom_check custom_one">
                            <input 
                              type="checkbox" 
                              name="select_price"
                              checked={filters.sortBy === 'price' && filters.sortOrder === 'ASC'}
                              onChange={() => setFilters(prev => ({ 
                                ...prev, 
                                sortBy: 'price', 
                                sortOrder: 'ASC', 
                                page: 1 
                              }))}
                            />
                            <span className="checkmark" /> Free
                          </label>
                        </div>
                        <div>
                          <label className="custom_check custom_one mb-0">
                            <input 
                              type="checkbox" 
                              name="select_price"
                              checked={filters.sortBy === 'price' && filters.sortOrder === 'DESC'}
                              onChange={() => setFilters(prev => ({ 
                                ...prev, 
                                sortBy: 'price', 
                                sortOrder: 'DESC', 
                                page: 1 
                              }))}
                            />
                            <span className="checkmark" /> Paid
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Range Filter */}
                  {/* <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1Four">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Four"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Four"
                      >
                        Range
                        <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Four"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1Four"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        <div className="filter-range">
                          <Slider range tooltip={{ formatter }} min={0} max={1000} defaultValue={[0, 500]} />
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Level Filter */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1Five">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Five"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Five"
                      >
                        Level
                        <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Five"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1Five"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                          <div key={level}>
                            <label className="custom_check custom_one">
                              <input 
                                type="checkbox" 
                                name="select_level"
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
              {/* Filter */}
              <div className="showing-list mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="show-result text-center text-lg-start">
                      <h6 className="fw-medium">
                        Showing {((pagination.currentPage - 1) * filters.limit) + 1}-
                        {Math.min(pagination.currentPage * filters.limit, pagination.totalCourses)} of {pagination.totalCourses} results
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="show-filter add-course-info">
                      <form onSubmit={handleSearch}>
                        <div className="d-sm-flex justify-content-center justify-content-lg-end mb-1 mb-lg-0">
                          <div className="view-icons mb-2 mb-sm-0">
                            <Link to={route.courseGrid} className="grid-view">
                              <i className="isax isax-element-3" />
                            </Link>
                            <Link to={route.courseList} className="list-view active">
                              <i className="isax isax-task" />
                            </Link>
                          </div>
                          <select className="form-select" onChange={handleSortChange}>
                            <option>Newly Published</option>
                            <option>Trending Courses</option>
                            <option>Top Rated</option>
                            <option>Free Courses</option>
                          </select>
                          <div className="search-group">
                            <i className="isax isax-search-normal-1" />
                            <input
                              type="text"
                              name="search"
                              className="form-control"
                              placeholder="Search"
                              defaultValue={filters.search}
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
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {/* Courses List */}
              {!loading && (
                <div className="row course-list-wrap">
                  {courses.map((course) => (
                    <div key={course.id} className="col-12">
                      <div className="courses-list-item">
                        <div className="d-md-flex align-items-center">
                          <div className="position-relative overflow-hidden rounded-3 card-image">
                            <Link to={all_routes.courseDetails.replace(":courseSlug", course.slug)}>
                              <img
                                className="img-fluid rounded-3"
                                src={course.heroImageUrl}
                                alt={course.title}
                                style={{ width: '300px', height: '165px', objectFit: 'cover' }}
                              />
                            </Link>
                            <div 
                              className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2"
                              onClick={() => handleItemClick(course.id)}
                            >
                              {course.pricing.price === 0 && (
                                <div className="badge text-bg-success me-2">Free</div>
                              )}
                            </div>
                            <div className="position-absolute start-0 bottom-0 d-flex align-items-start w-100 z-index-2">
                              {/* Accreditation Badge */}
                              {course.accreditedCreditType && (
                                <div 
                                  className="me-2" 
                                  style={{ width: '60px', height: '60px' }}
                                  title={`${course.accreditedCreditType} Accredited - ${course.accreditedCreditHours}h`}
                                >
                                  <img
                                    src={
                                      course.accreditedCreditType === 'CME'
                                        ? '/assets/img/icon/CME.svg'
                                        : '/assets/img/icon/CPD.svg'
                                    }
                                    alt={`${course.accreditedCreditType} Accredited`}
                                    className="img-fluid"
                                    style={{height:"60px"}}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="course-list-contents w-100 ps-0 ps-md-3 pt-4 pt-md-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <div className="avatar rounded-circle">
                                  <Link to={`${route.instructorDetails}/${course.instructor.id}`}>
                                    <img
                                      className="img-fluid rounded-circle"
                                      src={course.instructor.avatar}
                                      alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    />
                                  </Link>
                                </div>
                                <p className="ms-2 mb-0">
                                  <Link to={`${route.instructorDetails}/${course.instructor.id}`}>
                                    {course.instructor.firstName} {course.instructor.lastName}
                                  </Link>
                                </p>
                              </div>
                              <span>
                                <Link className="tag-btn" to="#">
                                  {course.category.name}
                                </Link>
                              </span>
                            </div>
                            <h4 className="mt-2 mb-2">
                              <Link to={all_routes.courseDetails.replace(":courseSlug", course.slug)}>
                                {course.title}
                              </Link>
                            </h4>
                            <div className="d-flex aling-items-center justify-content-between">
                              {/* Accreditation Info Badge */}
                              {course.accreditedCreditType && (
                                <div className="mb-2">
                                  <span className="badge bg-success-transparent text-success d-inline-flex align-items-center">
                                    <i className="isax isax-verify me-1" style={{ fontSize: '14px' }}></i>
                                    <span style={{ fontSize: '14px' }}>{course.accreditedCreditType} Accredited • {course.accreditedCreditHours}h Credits</span>
                                  </span>
                                </div>
                              )}
                              
                              <div className="d-flex align-items-center">
                                <p className="d-flex align-items-center mb-0">
                                  {renderStars(course.averageRating)} {course.averageRating}
                                  ({course.totalReviews} Reviews)
                                </p>
                                <span className="dot" />
                                <p className="mb-0">{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</p>
                              </div>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">
                                {course.stats.totalLessons} lessons • {formatDuration(course.stats.totalDuration)} • {course.totalReviews} students
                              </small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              {course.pricing.price === 0 ? (
                                <div>
                                  <h5 className="text-success mb-0">Free</h5>
                                  {course.pricing.certPrice > 0 && (
                                    <small className="text-muted">Certificate: ${course.pricing.certPrice}</small>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <h5 className="text-secondary mb-0">${course.pricing.price}</h5>
                                  {course.pricing.certPrice > 0 && (
                                    <small className="text-muted">Certificate: ${course.pricing.certPrice}</small>
                                  )}
                                </div>
                              )}
                              <Link
                                to={all_routes.courseDetails.replace(":courseSlug", course.slug)}
                                className="btn btn-dark btn-sm d-inline-flex align-items-center"
                              >
                                Get Course
                                <i className="fs-8 fas fa-angle-right ms-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No courses found */}
              {!loading && courses.length === 0 && (
                <div className="text-center py-5">
                  <h5>No courses found</h5>
                  <p className="text-muted">Try adjusting your filters or search terms</p>
                </div>
              )}

              {/* Pagination */}
              {!loading && courses.length > 0 && (
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <p className="pagination-text">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                  </div>
                  <div className="col-md-10">
                    <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                      <li className={`page-item prev ${!pagination.hasPrev ? 'disabled' : ''}`}>
                        <Link
                          className="page-link"
                          to="#"
                          onClick={() => pagination.hasPrev && handlePageChange(pagination.currentPage - 1)}
                          tabIndex={pagination.hasPrev ? 0 : -1}
                        >
                          <i className="fas fa-angle-left" />
                        </Link>
                      </li>
                      
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 || 
                          page === pagination.totalPages ||
                          Math.abs(page - pagination.currentPage) <= 1
                        ) {
                          return (
                            <li 
                              key={page}
                              className={`page-item ${page === pagination.currentPage ? 'active' : ''}`}
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
                        } else if (
                          page === pagination.currentPage - 2 ||
                          page === pagination.currentPage + 2
                        ) {
                          return (
                            <li key={page} className="page-item">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}

                      <li className={`page-item next ${!pagination.hasNext ? 'disabled' : ''}`}>
                        <Link
                          className="page-link"
                          to="#"
                          onClick={() => pagination.hasNext && handlePageChange(pagination.currentPage + 1)}
                        >
                          <i className="fas fa-angle-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CourseList