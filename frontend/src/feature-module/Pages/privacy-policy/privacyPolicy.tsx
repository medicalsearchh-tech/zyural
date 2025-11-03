import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <>
      <Breadcrumb title="Privacy Policy" />

      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 mx-auto">
              <p className="mb-4">
                At Zyural, we are committed to protecting your privacy. This
                policy outlines how we handle your information:
              </p>
              <div className="mb-4">
                <h6 className="mb-2">Information We Collect</h6>
                <p className="mb-1 d-flex">
                  Data, such as your name, email address, and payment details,
                  collected during registration or purchases.
                </p>
                <p className="mb-0 d-flex align-items-center">
                  Non-personal data, including device information, browser type,
                  and usage patterns, to improve user experience.
                </p>
              </div>
              <div className="mb-4">
                <h6 className="mb-2">How We Use Your Information</h6>
                <p className="mb-1 d-flex">
                  To provide access to courses and services.
                </p>
                <p className="mb-1 d-flex">To process payments securely.</p>
                <p className="mb-1 d-flex">
                  To deliver personalized content and updates.
                </p>
                <p className="mb-0 d-flex align-items-center">
                  For research, analytics, and marketing (with your consent when
                  required).
                </p>
              </div>
              <div className="mb-4">
                <h6 className="mb-2">Data Protection</h6>
                <p className="mb-1 d-flex">
                  We implement technical and organizational measures to
                  safeguard your data.
                </p>
                <p className="mb-0 d-flex align-items-center">
                  Your information is not sold or shared with third parties
                  except for essential service providers (e.g., payment
                  processors) or legal obligations.
                </p>
              </div>
              <div className="mb-4">
                <h6 className="mb-2">Third-Party Links</h6>
                <p className="mb-1 d-flex">
                  Our platform may include links to external websites.
                </p>
                <p className="mb-0 d-flex align-items-center">
                  We are not responsible for their privacy practices, and you
                  should review their policies.
                </p>
              </div>
              <div className="mb-4">
                <h6 className="mb-2">Your Rights</h6>
                <p className="mb-0">
                  Access, update, or delete your personal information by
                  contacting us at [Insert Contact Information].
                </p>
              </div>
              <div className="mb-0">
                <h6 className="mb-2">Policy Updates</h6>
                <p className="mb-1">
                  We may update this policy and notify you of significant
                  changes through our platform or email.
                </p>
                <p className="mb-0">
                  For any questions or concerns about this Privacy Policy,
                  contact us at{" "}
                  <Link to="#" target="_blank">
                    zyural@example.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
