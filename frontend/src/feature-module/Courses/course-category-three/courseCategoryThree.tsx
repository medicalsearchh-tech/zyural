import { all_routes } from '../../router/all_routes';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

const CourseCategoryThree = () => {

  const route = all_routes;

  return (
    <>
      <Breadcrumb title='Course Category 3' />

      <>
        <div className="container">
          <section className="categories-top bg-light border">
            <ImageWithBasePath
              src="./assets/img/course/course-bg-3.svg"
              alt="img"
              className="d-none d-lg-flex course-bg3"
            />
            <ImageWithBasePath
              src="./assets/img/course/course-bg-2.png"
              alt="img"
              className="d-none d-lg-flex course-bg2"
            />
            <div className="row align-items-center">
              <div className="col-lg-7 col-12">
                <div className="caetgory-form">
                  <h2 className="mb-2">Browse by Categories</h2>
                  <p>
                    Take the first step towards achieving your goals with our
                    comprehensive.
                  </p>
                  <form className="position-relative">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search School, Online educational centres, etc"
                    />
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Course */}
        <section className="course-category-three">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-19.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Graphic Design</h6>
                      <p>45 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-20.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Photography</h6>
                      <p>13 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-21.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Medical Terminology</h6>
                      <p>21 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-22.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">UX/UI Design</h6>
                      <p>14 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-23.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Personal Finance</h6>
                      <p>06 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-24.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Health and Wellness</h6>
                      <p>12 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-25.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Software Training</h6>
                      <p>15 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-26.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Engineering</h6>
                      <p>22 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-27.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Leadership</h6>
                      <p>19 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-28.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Communication</h6>
                      <p>35 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-29.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Emotional Intelligence</h6>
                      <p>22 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails}>
                  <div className="category-item-3">
                    <div className="category-item-3-image">
                      <ImageWithBasePath
                        src="./assets/img/category/category-30.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="course-category-3-card-body">
                      <h6 className="mb-2">Sales and Marketing</h6>
                      <p>15 Lessons</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <Link to="#" target="_blank" className="btn btn-primary">
              Load More
            </Link>
          </div>
        </section>
        {/* /Course */}
      </>

    </>
  )
}

export default CourseCategoryThree
