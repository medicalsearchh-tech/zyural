import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi, categoryApi } from '../../../../core/utils/api';
import { all_routes } from '../../../router/all_routes';

interface Course {
  id: string;
  title: string;
  slug: string;
  heroImageUrl: string;
  pricing: {
    price: number;
    certPrice: number;
    currency: string;
  };
  accreditedCreditHours: number;
  accreditedCreditType: 'CME' | 'CPD' | null;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  stats: {
    totalDuration: number;
  };
  totalEnrollments: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const route = all_routes;

  // Fetch courses and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured courses (limit 8 for homepage)
        const coursesResponse = await courseApi.getCourses({
          page: 1,
          limit: 8,
          sortBy: 'createdAt',
          sortOrder: 'DESC'
        });
        
        // Fetch categories
        const categoriesResponse = await categoryApi.getCategories();
        
        if (coursesResponse.success) {
          setCourses(coursesResponse.data.courses);
        }
        
        if (categoriesResponse.success) {
          // Show first 6 categories in tabs
          setCategories(categoriesResponse.data.categories.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses by category
  const handleTabChange = async (categoryId: string, categorySlug: string) => {
    setActiveTab(categorySlug);
    
    try {
      setLoading(true);
      const response = await courseApi.getCourses({
        page: 1,
        limit: 8,
        category: categoryId === 'all' ? '' : categoryId,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      
      if (response.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching filtered courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <>
      {/* Courses */}
      <section className="home-five-courses">
        <div className="container">
          <div className="favourite-course-sec">
            <div className="row">
              <div
                className="home-five-head section-header-title"
                data-aos="fade-up"
              >
                <div className="row align-items-center d-flex justify-content-between row-gap-4">
                  <div className="col-md-6">
                    <h2>Featured Courses</h2>
                  </div>
                  <div className="col-md-6">
                    <div className="see-all text-end">
                      <Link to={route.courseGrid}>
                        View All
                        <i className="fas fa-arrow-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="all-corses-main">
                <div className="tab-content">
                  {/* Category Tabs */}
                  <div className="nav tablist-three" role="tablist">
                    <Link
                      className={`nav-tab me-3 ${activeTab === 'all' ? 'active' : ''}`}
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('all', 'all');
                      }}
                      role="tab"
                    >
                      All
                    </Link>
                    
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        className={`nav-tab me-3 ${activeTab === category.slug ? 'active' : ''}`}
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabChange(category.id, category.slug);
                        }}
                        role="tab"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>

                  {/* Courses Grid */}
                  <div className="tab-content">
                    <div className="tab-pane fade active show" role="tabpanel">
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading courses...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="all-course">
                          <div className="row">
                            {courses.length > 0 ? (
                              courses.map((course) => (
                                <div
                                  key={course.id}
                                  className="col-xl-3 col-lg-6 col-md-6 col-12"
                                  data-aos="fade-up"
                                >
                                  <div className="course-item course-item-five">
                                    <div className="course-img position-relative">
                                      <Link to={route.courseDetails.replace(':courseSlug', course.slug)}>
                                        <img
                                          src={course.heroImageUrl}
                                          alt={course.title}
                                          className="img-fluid"
                                          style={{ 
                                            height: '200px', 
                                            objectFit: 'cover',
                                            width: '100%'
                                          }}
                                        />
                                      </Link>
                                      
                                      {/* Accreditation Badge Overlay */}
                                      {course.accreditedCreditType && (
                                        <div 
                                          className="position-absolute bottom-0 end-0 m-2"
                                          style={{ width: '50px', height: '50px' }}
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
                                          />
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="course-content">
                                      <div className="course-user-img">
                                        <Link to={`${route.instructorDetails}/${course.instructor.id}`}>
                                          <img
                                            src={course.instructor.avatar}
                                            alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                                            className="img-fluid"
                                            style={{
                                              width: '40px',
                                              height: '40px',
                                              objectFit: 'cover',
                                              borderRadius: '50%'
                                            }}
                                          />
                                        </Link>
                                      </div>
                                      
                                      <div className="course-three-text">
                                        <p>{course.category.name}</p>
                                        <h3 className="title instructor-text">
                                          <Link to={route.courseDetails.replace(':courseSlug', course.slug)}>
                                            {course.title}
                                          </Link>
                                        </h3>
                                        
                                        {/* Accreditation Info Badge */}
                                        {course.accreditedCreditType && (
                                          <div className="mb-2">
                                            <span 
                                              className="badge bg-success-transparent text-success" 
                                              style={{ fontSize: '11px' }}
                                            >
                                              <i className="fas fa-certificate me-1"></i>
                                              {course.accreditedCreditType} • {course.accreditedCreditHours}h
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="student-counts-info d-flex align-items-center">
                                        <img
                                          src="/assets/img/icon/student.svg"
                                          alt="Students"
                                        />
                                        <p className="ms-2">{course.totalEnrollments || 0} Students</p>
                                      </div>
                                      
                                      <div className="d-flex align-items-center justify-content-between">
                                        <div className="course-price">
                                          {course.pricing.price === 0 ? (
                                            <h3 className="text-success mb-0">Free</h3>
                                          ) : (
                                            <h3>
                                              ${course.pricing.price}
                                              {course.pricing.certPrice > 0 && (
                                                <span 
                                                  className="d-block" 
                                                  style={{ fontSize: '12px', color: '#666' }}
                                                >
                                                  Cert: ${course.pricing.certPrice}
                                                </span>
                                              )}
                                            </h3>
                                          )}
                                        </div>
                                        
                                        <div className="d-flex align-items-center">
                                          <i className="fa-regular fa-clock me-2" />
                                          <span>{formatDuration(course.stats.totalDuration)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-12">
                                <div className="text-center py-5">
                                  <h5>No courses found</h5>
                                  <p className="text-muted">Try selecting a different category</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View All Button */}
                  {!loading && courses.length > 0 && (
                    <div className="text-center mt-3">
                      <Link to={route.courseGrid} className="btn btn-secondary">
                        View all Courses
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Courses */}
    </>
  );
};

export default Courses;