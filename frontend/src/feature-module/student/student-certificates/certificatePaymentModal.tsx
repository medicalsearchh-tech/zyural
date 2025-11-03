import { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { studentCertificateApi } from "../../../core/utils/api";
import { toast } from "react-toastify";
import { config } from "../../../config/config";

const stripePromise = loadStripe(config.stripe.publishableKey);

interface PaymentFormProps {
  courseId: string;
  courseTitle: string;
  certificatePrice: number;
  templateId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ courseId, courseTitle, certificatePrice, templateId, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validation before payment processing
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Card element not found');
      return;
    }

    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setPaymentError(error.message || 'Please complete all card information');
      setProcessing(false);
      return;
    }

    if (!token) {
      setPaymentError('Card validation failed');
      setProcessing(false);
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const response = await studentCertificateApi.createPaymentIntent(courseId, templateId);
      
      if (!response.success || !response.data) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = response.data;
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Student', // You can get this from user context
          },
        }
      });

      if (result.error) {
        setPaymentError(result.error.message || 'Payment failed');
      } else {
        // Payment succeeded, confirm with backend
        const confirmResponse = await studentCertificateApi.confirmPayment(result.paymentIntent.id);
        
        if (confirmResponse.success) {
          toast.success('Certificate purchased successfully!');
          onSuccess();
        } else {
          throw new Error('Failed to confirm payment');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment processing failed');
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <h6>Purchase Certificate</h6>
        <div className="bg-light p-3 rounded mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{courseTitle}</strong>
              <div className="small text-muted">Certificate of Completion</div>
            </div>
            <div className="text-end">
              <div className="h5 mb-0">${certificatePrice}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Card Information</label>
        <div className="form-control" style={{ padding: '12px' }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {paymentError}
        </div>
      )}

      <div className="d-flex justify-content-between gap-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-credit-card me-2" />
              Pay ${certificatePrice}
            </>
          )}
        </button>
      </div>

      <div className="text-center mt-3">
        <small className="text-muted">
          <i className="fas fa-lock me-1"></i>
          Your payment information is secure and encrypted
        </small>
      </div>
    </form>
  );
};

interface CertificatePaymentModalProps {
  isOpen: boolean;
  courseId: string;
  courseTitle: string;
  certificatePrice: number;
  templateId: string; 
  onSuccess: () => void;
  onClose: () => void;
}

const CertificatePaymentModal = ({
  isOpen,
  courseId,
  courseTitle,
  certificatePrice,
  templateId,
  onSuccess,
  onClose
}: CertificatePaymentModalProps) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-certificate text-success me-2"></i>
              Purchase Certificate
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body p-0">
            <Elements stripe={stripePromise}>
              <PaymentForm
                courseId={courseId}
                courseTitle={courseTitle}
                certificatePrice={certificatePrice}
                templateId={templateId}
                onSuccess={handleSuccess}
                onCancel={onClose}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePaymentModal;