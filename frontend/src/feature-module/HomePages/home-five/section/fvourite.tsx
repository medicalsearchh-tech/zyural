import { useState, useEffect } from 'react';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';
import { categoryApi } from '../../../../core/utils/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  imageUrl?: string | null;
  courseCount?: number;
  instructorCount?: number;
  description?: string;
}

const Favourite = () => {
  const route = all_routes;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getCategories();

        // Handle structure like { data: { categories: [...] } }
        let categoriesData: Category[] = [];
        if (response?.data?.categories) {
          categoriesData = response.data.categories;
        } else if (Array.isArray(response?.data)) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        }

        console.log('Categories fetched:', categoriesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Favourite Slider settings
  const favouriteslider = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: false,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Render loading state
  if (loading) {
    return (
      <section className="home-five-favourite">
        <div className="container">
          <div className="category-sec">
            <div className="row">
              <div className="container">
                <div className="home-five-head section-header-title" data-aos="fade-up">
                  <div className="row align-items-center justify-content-between row-gap-4">
                    <div className="col-md-8 col-sm-12">
                      <h2>Choose favourite Course from top Category</h2>
                    </div>
                  </div>
                </div>
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading categories...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className="home-five-favourite">
        <div className="container">
          <div className="category-sec">
            <div className="row">
              <div className="container">
                <div className="home-five-head section-header-title" data-aos="fade-up">
                  <div className="row align-items-center justify-content-between row-gap-4">
                    <div className="col-md-8 col-sm-12">
                      <h2>Choose favourite Course from top Category</h2>
                    </div>
                  </div>
                </div>
                <div className="text-center py-5">
                  <p className="text-danger">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render empty state
  if (categories.length === 0) {
    return (
      <section className="home-five-favourite">
        <div className="container">
          <div className="category-sec">
            <div className="row">
              <div className="container">
                <div className="home-five-head section-header-title" data-aos="fade-up">
                  <div className="row align-items-center justify-content-between row-gap-4">
                    <div className="col-md-8 col-sm-12">
                      <h2>Choose favourite Course from top Category</h2>
                    </div>
                  </div>
                </div>
                <div className="text-center py-5">
                  <p>No categories available at the moment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main Render
  return (
    <section className="home-five-favourite">
      <div className="container">
        <div className="category-sec">
          <div className="row">
            <div className="container">
              <div className="home-five-head section-header-title" data-aos="fade-up">
                <div className="row align-items-center justify-content-between row-gap-4">
                  <div className="col-md-8 col-sm-12">
                    <h2>Choose favourite Course from top Category</h2>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <div className="see-all text-end">
                      <Link to={route.courseGrid}>
                        View All
                        <i className="fas fa-arrow-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Slider {...favouriteslider}>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="categories-item categories-item-five"
                    data-aos="fade-down"
                  >
                    <div className="categories-icon">
                      <ImageWithBasePath
                        className="img-fluid"
                        src={category.imageUrl || 'assets/img/icon/default-category.png'}
                        alt={category.name}
                      />
                    </div>
                    <div className="category-info">
                      <h3>
                        <Link to={`${route.courseGrid}?category=${category.slug}`}>
                          {category.name}
                        </Link>
                      </h3>
                      {category.description && (
                        <p className="text-muted small mt-2">{category.description}</p>
                      )}
                    </div>
                    <div className="instructors-info">
                      <p className="me-4">
                        {category.courseCount ? `${category.courseCount} Courses` : 'Instructors'}
                      </p>
                      <ul className="instructors-list">
                        <li>
                          <Link to="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Instructor 1">
                            <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="instructor" />
                          </Link>
                        </li>
                        <li>
                          <Link to="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Instructor 2">
                            <ImageWithBasePath src="assets/img/user/user-02.jpg" alt="instructor" />
                          </Link>
                        </li>
                        <li>
                          <Link to="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Instructor 3">
                            <ImageWithBasePath src="assets/img/user/user-03.jpg" alt="instructor" />
                          </Link>
                        </li>
                        <li className="more-set">
                          <Link to="#">{category.instructorCount ? `${category.instructorCount}+` : '80+'}</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Favourite;
