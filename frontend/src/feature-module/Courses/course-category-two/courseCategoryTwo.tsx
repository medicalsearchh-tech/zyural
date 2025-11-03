import { all_routes } from '../../router/all_routes';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

const CourseCategoryTwo = () => {

  const route = all_routes;

  return (
    <>
      <Breadcrumb title='Course Category 2' />
      <>
        <div className="container">
          <section className="categories-top bg-light border">
            <ImageWithBasePath
              src="./assets/img/course/course-bg-1.svg"
              alt="img"
              className="d-none d-lg-flex course-bg"
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
                    comprehensive online courses.
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
        <section className="course-category-two">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon1.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Management</h6>
                    <p>156 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon2.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">IT &amp; Softwares</h6>
                    <p>214 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon3.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Marketing</h6>
                    <p>174 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to="#">
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon4.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Finance</h6>
                    <p>62 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon5.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Productivity</h6>
                    <p>126 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon6.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Lifestyles</h6>
                    <p>214 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon7.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Design</h6>
                    <p>60Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon8.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Business</h6>
                    <p>21 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon9.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Cyber Security</h6>
                    <p>15 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon10.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Development</h6>
                    <p>21 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon11.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Accounting</h6>
                    <p>33 Courses</p>
                  </div>
                </Link>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <Link to={route.courseDetails2}>
                  <div className="category-item-2">
                    <div className="cat-icon border border-white mx-auto d-flex justify-content-center align-items-center">
                      <ImageWithBasePath src="./assets/img/icons/category-icon12.svg" alt="img" />
                    </div>
                    <h6 className="mb-1">Engineering</h6>
                    <p>42 Courses</p>
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

export default CourseCategoryTwo
