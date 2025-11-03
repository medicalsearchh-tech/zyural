import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";

const PricePlanning = () => {

    const route = all_routes;

  return (
    <>
      <Breadcrumb title="Pricing Plan" />

      <section className="pricing-plan-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 mx-auto">
              <div className="text-center">
                <p className="fw-medium text-secondary mb-2">
                  We keep it simple
                </p>
                <h2 className="main-title mb-2">Choose The Right Plan</h2>
                <p>
                  Improve the way your work, discover a brand new tool and drop
                  the hassle once and for all.
                </p>
                <div className="text-end">
                  <ImageWithBasePath
                    src="./assets/img/icons/save-10.svg"
                    alt="img"
                  />
                </div>
                <div className="enable-item d-flex align-items-center justify-content-center text-gray-9">
                  <label className="mb-0 me-2">Monthly</label>
                  <div className="form-check form-switch check-on m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                    />
                  </div>
                  <label className="mb-0 ms-2">Annualy</label>
                </div>
              </div>
            </div>
          </div>
          <div className="row pricing-cover">
            <div className="col-xl-3 col-md-6 px-2 d-flex">
              <div className="pricing-item flex-fill">
                <h5 className="mb-2">Basic</h5>
                <h1 className="mb-2">
                  <sup className="fs-24 me-1">$</sup>10
                </h1>
                <p>
                  Perfect for individuals or small teams taking their first step
                  into online.
                </p>
                <div className="border-top pt-3 mt-3">
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    10 active courses
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Basic course creation tools
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Student progress tracking
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />1 GB storage
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Email notifications
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Community support
                  </p>
                  <Link to={route.courseCheckout} className="btn btn-start-free w-100">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 px-2 d-flex">
              <div className="pricing-item flex-fill">
                <h5 className="mb-2">Standard</h5>
                <h1 className="mb-2">
                  <sup className="fs-24 me-1">$</sup>50
                </h1>
                <p>
                  Ideal for growing institutions that need advanced tools and
                  greater flexibility.
                </p>
                <div className="border-top pt-3 mt-3">
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Access to 20 courses
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Custom course certificates
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Basic analytics
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    10 GB storage
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Course scheduling
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Priority email and chat support
                  </p>
                  <Link to={route.courseCheckout} className="btn btn-start-free w-100">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 px-2 d-flex">
              <div className="pricing-item flex-fill">
                <h5 className="mb-2">Premium</h5>
                <h1 className="mb-2">
                  <sup className="fs-24 me-1">$</sup>100
                </h1>
                <p>
                  Designed for large-scale learning with robust features and
                  custom branding.
                </p>
                <div className="border-top pt-3 mt-3">
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Unlimited courses
                  </p>
                  <p className="d-flex align-items-center text-truncate mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Advanced course creation tools
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Detailed student analytics
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    100 GB storage
                  </p>
                  <p className="d-flex align-items-center text-truncate mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Integration with third-party tools
                  </p>
                  <p className="d-flex align-items-center mb-3">
                    <i className="fa-solid fa-circle fs-5 me-2" />
                    Completion certificates
                  </p>
                  <Link to={route.courseCheckout} className="btn btn-start-free w-100">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 px-2 d-flex">
              <div className="pricing-item flex-fill">
                <h5 className="fw-bold mb-2 pb-2">Benefits</h5>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Access to slack community
                </p>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Access to support team
                </p>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Algorithmic bidding
                </p>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Keyword and ASIN harvesting
                </p>
                <h5 className="fw-bold mb-2 pb-2 mt-4">Features</h5>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Search term isolation
                </p>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Total Sales Analytics
                </p>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Best seller rank
                </p>
                <p className="d-flex align-items-center mb-3">
                  <i className="fa-solid fa-circle fs-5 me-2" />
                  Placement optimization
                </p>
                <Link to={route.courseCheckout} className="btn btn-start-free w-100">
                  Start For Free
                </Link>
              </div>
            </div>
          </div>
          <div className="table-responsive mt-4">
            <table className="table table-price">
              <thead>
                <tr>
                  <th className="bg-transparent" />
                  <th className="bg-primary-100 text-primary">
                    Self-Employed &amp; Freelance
                  </th>
                  <th className="bg-primary-100 text-primary" colSpan={2}>
                    Small businesses that need accounting, invoicing or payroll
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="basic">
                  <td className="border-0" />
                  <td className="text-center">Basic</td>
                  <td className="text-center">Team</td>
                  <td className="text-center">Pro</td>
                </tr>
                <tr>
                  <td>Separate business/personal</td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Track deductible mileage</td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Download online banking</td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Multi-device</td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Create invoices &amp; estimates</td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Manage VAT</td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Manage bills &amp; payments</td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Multiple currencies</td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Create budgets</td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
                <tr>
                  <td>Track time</td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-close-circle5 fs-24 text-danger" />
                  </td>
                  <td className="text-center">
                    <i className="isax isax-tick-circle5 fs-24 text-success" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricePlanning;
