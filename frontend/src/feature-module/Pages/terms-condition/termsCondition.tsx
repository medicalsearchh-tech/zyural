import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";

const TermsCondition = () => {
  return (
    <>
      <Breadcrumb title="Terms and Conditions" />

      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 mx-auto">
              <div className="mb-3">
                <h5 className="mb-3">Introduction</h5>
                <p className="mb-0">
                  Welcome to Zyural. By accessing or using our platform, you
                  agree to comply with and be bound by the following terms and
                  conditions (“Terms”). Please read them carefully before using
                  our services.
                </p>
              </div>
              <div className="mb-3">
                <h5 className="mb-3">Acceptance of Terms</h5>
                <p className="mb-2 d-flex align-items-center">
                  By accessing or using our LMS, you confirm that you have read,
                  understood, and agreed to these Terms.
                </p>
                <p className="mb-0 d-flex align-items-center">
                  If you do not agree to these Terms, you may not use the
                  Website or its services.
                </p>
              </div>
              <div className="mb-3">
                <h5 className="mb-3">Eligibility</h5>
                <p className="mb-2 d-flex align-items-center">
                  Users must be at least 18 years old or have parental/guardian
                  consent to use the platform
                </p>
                <p className="mb-0 d-flex align-items-center">
                  Organizations must ensure that their members comply with these
                  Terms
                </p>
              </div>
              <div className="mb-3">
                <h5 className="mb-3">Account Registration</h5>
                <p className="mb-2 d-flex align-items-center">
                  Users are required to register an account to access courses
                  and other features.
                </p>
                <p className="mb-2 d-flex align-items-center">
                  You agree to provide accurate and complete information during
                  registration.
                </p>
                <p className="mb-0 d-flex align-items-center">
                  You are responsible for maintaining the confidentiality of
                  your login credentials.
                </p>
              </div>
              <div className="mb-3">
                <h5 className="mb-3">Payments and Subscriptions</h5>
                <p className="mb-2 d-flex align-items-center">
                  Certain courses or features may require payment or a
                  subscription.
                </p>
                <p className="mb-0 d-flex align-items-center">
                  You are responsible for any taxes applicable to your purchase.
                </p>
              </div>
              <div className="mb-0">
                <h5 className="mb-3">Changes to Terms &amp; Conditions</h5>
                <p className="mb-0">
                  Zyural may update these Terms &amp; Conditions
                  periodically. Any changes will be communicated through the
                  website or via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsCondition;
