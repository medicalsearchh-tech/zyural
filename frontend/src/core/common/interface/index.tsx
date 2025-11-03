export interface DatatableProps {
    columns: any[]; // You can replace `any[]` with the specific type of columns you expect
    dataSource: any[]; // You can replace `any[]` with the specific type of dataSource you expect
    Selection?: boolean | undefined;
  }

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ExtendedDatatableProps extends DatatableProps {
  pagination?: PaginationInfo;
  onPageChange?: (page: number, pageSize?: number) => void;
  onSearch?: (value: string) => void;
  pageSize?: number;
  currentPage?: number;
}


export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  backgroundImageUrl: string | null;
  previewImageUrl: string | null;
  courseId: string | null;
  course?: {
    id: string;
    title: string;
    instructor?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  designConfig: {
    canvas: {
      width: number;
      height: number;
      backgroundColor: string;
      backgroundImage: string | null;
    };
    elements: CertificateElement[];
  };
  dynamicFields: {
    studentName: { enabled: boolean; required: boolean; label: string };
    courseTitle: { enabled: boolean; required: boolean; label: string };
    completionDate: { enabled: boolean; required: boolean; label: string };
    certificateNumber: { enabled: boolean; required: boolean; label: string };
    instructorName: { enabled: boolean; required: boolean; label: string };
    creditHours: { enabled: boolean; required: boolean; label: string };
    creditType: { enabled: boolean; required: boolean; label: string };
    accreditationBody: { enabled: boolean; required: boolean; label: string };
    customFields: any[];
  };
  status: 'draft' | 'active' | 'archived';
  isGlobal: boolean;
  createdBy: string;
  issuedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'dynamic-field';
  position: { x: number; y: number };
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    textBaseline?: 'top' | 'middle' | 'bottom';
    maxWidth?: number;
    lineHeight?: number;
    opacity?: number;
    rotation?: number;
  };
  content?: string;
  fieldType?: 'studentName' | 'courseTitle' | 'completionDate' | 'certificateNumber' | 
               'instructorName' | 'creditHours' | 'creditType' | 'accreditationBody' | 'issueDate';
  zIndex?: number;
}

export interface IssuedCertificate {
  id: string;
  certificateId: string;
  studentId: string;
  courseId: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  issueDate: string;
  certificateUrl: string | null;
  status: 'pending' | 'issued' | 'revoked';
  isValid: boolean;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
  };
  template?: CertificateTemplate;
}

export interface CertificateStats {
  totalCertificates: number;
  activeCertificates: number;
  draftCertificates: number;
  archivedCertificates: number;
  certificatesWithIssued: number;
  certificatesWithoutIssued: number;
  totalIssuedCertificates: number;
  activeIssuedCertificates: number;
  revokedCertificates: number;
}