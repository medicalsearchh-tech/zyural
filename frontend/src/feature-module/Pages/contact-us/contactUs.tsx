import { useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { contactApi } from "../../../core/utils/api";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactUs = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const response = await contactApi.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response.success) {
        toast.success(
          response.message ||
            "Thank you for contacting us! We'll get back to you soon."
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      }
    } catch (error: any) {
      console.error("Contact form error:", error);

      let errorMessage = "Failed to send message. Please try again later.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors: FormErrors = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.param) {
            backendErrors[err.param as keyof FormErrors] = err.msg;
          }
        });
        setErrors(backendErrors);
        errorMessage = "Please check the form for errors.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Contact Us" />

      <section className="contact-sec">
        <div className="container">
          <div className="contact-info"></div>

          <div className="bg-light border rounded-4 p-4 p-sm-5 p-md-6">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="contact-details">
                  <div className="section-header">
                    <span className="section-badge">Contact Us</span>
                    <h2>Get in touch with us today</h2>
                    <p>
                      Get in touch with us to explore how our LMS solution can
                      enhance your e-learning experience. We're here to help
                      you build a seamless and engaging learning platform!
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card mb-0">
                  <div className="card-body p-4 p-sm-5 p-md-6">
                    <h4 className="mb-3">Send Us Message</h4>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label">
                              Name <span className="ms-1 text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              className={`form-control form-control-lg ${
                                errors.name ? "is-invalid" : ""
                              }`}
                              value={formData.name}
                              onChange={handleChange}
                              disabled={loading}
                            />
                            {errors.name && (
                              <div className="invalid-feedback">
                                {errors.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label">
                              Email Address{" "}
                              <span className="ms-1 text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              className={`form-control form-control-lg ${
                                errors.email ? "is-invalid" : ""
                              }`}
                              value={formData.email}
                              onChange={handleChange}
                              disabled={loading}
                            />
                            {errors.email && (
                              <div className="invalid-feedback">
                                {errors.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              className="form-control form-control-lg"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-4">
                            <label className="form-label">
                              Subject{" "}
                              <span className="ms-1 text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              name="subject"
                              className={`form-control form-control-lg ${
                                errors.subject ? "is-invalid" : ""
                              }`}
                              value={formData.subject}
                              onChange={handleChange}
                              disabled={loading}
                            />
                            {errors.subject && (
                              <div className="invalid-feedback">
                                {errors.subject}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">
                          Your Message{" "}
                          <span className="ms-1 text-danger">*</span>
                        </label>
                        <textarea
                          name="message"
                          className={`form-control form-control-lg ${
                            errors.message ? "is-invalid" : ""
                          }`}
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {errors.message && (
                          <div className="invalid-feedback">
                            {errors.message}
                          </div>
                        )}
                      </div>
                      <div className="d-grid">
                        <button
                          type="submit"
                          className="btn btn-secondary btn-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Sending...
                            </>
                          ) : (
                            "Send Enquiry"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-map rounded-4 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58276.44676254453!2d50.49462020638499!3d26.066700274631384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e49a4f60a54a9b5%3A0x38f7cfdd2a38c1c3!2sManama%2C%20Bahrain!5e0!3m2!1sen!2sin!4v1739999999999!5m2!1sen!2sin"
              loading="lazy"
              title="Bahrain Map"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
