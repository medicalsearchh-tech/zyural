import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";
import HomeTwo from "../HomePages/home-two/homeTwo";
import HomeThree from "../HomePages/home-three/homeThree";
import HomeFour from "../HomePages/home-four/homeFour";
import HomeFive from "../HomePages/home-five/homeFive";
import HomeSix from "../HomePages/home-six/homeSix";
import CourseGrid from "../Courses/courses-grid/courseGrid";
import CourseList from "../Courses/course-list/courseList";
import CourseCategory from "../Courses/course-category/courseCategory";
import CourseCategoryThree from "../Courses/course-category-three/courseCategoryThree";
import CourseResume from "../Courses/course-resume/courseResume";
import CourseWatch from "../Courses/course-watch/courseWatch";
import CourseCart from "../Courses/course-cart/courseCart";
import CourseCheckout from "../Courses/course-checkout/courseCheckout";


import AdminDashboard from "../admin/admin-dashboard/adminDashboard";
import AdminInstructorsList from "../admin/admin-instructor-management/adminInstructorList";
import AdminInstructorRequests from "../admin/admin-instructor-request/adminInstructorRequest";
import AdminProfile from "../admin/admin-profile/adminProfile";
import AdminCertificate from "../admin/admin-certificate/adminCertificate";
import AdminCourse from "../admin/admin-course/adminCourse";
import AdminCourseGrid from "../admin/admin-course/adminCourseGrid";
import AdminCourseDetails from "../admin/admin-course/adminCourseDetails";
import AdminCategories from "../admin/admin-categories/adminCategories";
import AdminSpecialties from "../admin/admin-categories/adminSpecialties";
import AdminStudentGrid from "../admin/student-grid/studentGrid";
import AdminStudentProgress from "../admin/student-progress/studentProgress";
import AdminStudentList from "../admin/student-list/studentList";
import AdminQuiz from "../admin/admin-quiz/adminQuiz";
import AdminQuizResult from "../admin/admin-quiz-result/adminQuizResult";
import AdminEarning from "../admin/admin-earning/adminEarning";
import AdminStatement from "../admin/admin-statement/adminStatement";
import AdminMessage from "../admin/admin-message/adminMessage";
import AdminProfileSettings from "../admin/admin-settings/admin-profile-settings/adminProfile";
import AdminChangePassoword from "../admin/admin-settings/admin-change-password/adminChangePassoword";
import AdminPlanSettings from "../admin/admin-settings/admin-plans-settings/adminPlanSettings";
import AdminSocialprofileSettings from "../admin/admin-settings/admin-socialprofile-settings/adminSocialprofileSettings";
import AdminLinkedAccounts from "../admin/admin-settings/admin-linked-accounts/adminLinkedAccounts";
import AdminNotification from "../admin/admin-settings/admin-notification/adminNotification";
import AdminIntegrations from "../admin/admin-settings/admin-integrations/adminIntegrations";
import AdminWithdraw from "../admin/admin-settings/admin-withdraw/adminWithdraw";
import AdminCreateNewCourse from "../admin/create-new-course/CourseBasicsData";
import AdminCourseSyllabus from "../admin/create-new-course/CourseSyllabus";
import AdminCourseAccreditation from "../admin/create-new-course/CourseAccreditation";
import AdminCoursePricing from "../admin/create-new-course/CoursePricing";
import AdminCourseReview from "../admin/create-new-course/CourseReviewSubmit";
import AdminCourseSEO from "../admin/create-new-course/CourseSEO";

import CertificateBuilder from "../admin/admin-certificate/certificateBuilder";
import GoogleAuthSuccess from '../../core/common/GoogleAuthSuccess';

import InstructorDashboard from "../Instructor/instructor-dashboard/instructorDashboard";
import InstructorProfile from "../Instructor/instructor-profile/instructorProfile";
import InstructorCourse from "../Instructor/instructor-course/instructorCourse";
import InstructorCourseDetails from "../Instructor/instructor-course/instructorCourseDetails";
import InstructorAnnouncements from "../Instructor/instructor-announcements/instructorAnnouncements";
import InstructorAssignment from "../Instructor/instructor-assignment/instructorAssignment";
import StudentGrid from "../Instructor/student-grid/studentGrid";
import StudentList from "../Instructor/student-list/studentList";
import InstructorQuiz from "../Instructor/instructor-quiz/instructorQuiz";
import InstructorQuizResult from "../Instructor/instructor-quiz-result/instructorQuizResult";
import InstructorEarning from "../Instructor/instructor-earning/instructorEarning";
import InstructorPayout from "../Instructor/instructor-payout/instructorPayout";
import InstructorStatement from "../Instructor/instructor-statement/instructorStatement";
import InstructorMessage from "../Instructor/instructor-message/instructorMessage";
import InstructorTickets from "../Instructor/instructor-tickets/instructorTickets";
import InstructorChangePassoword from "../Instructor/instructor-settings/instructor-change-password/instructorChangePassoword";
import InstructorPlanSettings from "../Instructor/instructor-settings/instructor-plans-settings/instructorPlanSettings";
import InstructorSocialprofileSettings from "../Instructor/instructor-settings/instructor-socialprofile-settings/instructorSocialprofileSettings";
import InstructorLinkedAccounts from "../Instructor/instructor-settings/instructor-linked-accounts/instructorLinkedAccounts";
import InstructorNotification from "../Instructor/instructor-settings/instructor-notification/instructorNotification";
import InstructorIntegrations from "../Instructor/instructor-settings/instructor-integrations/instructorIntegrations";
import InstructorWithdraw from "../Instructor/instructor-settings/instructor-withdraw/instructorWithdraw";
import InstructorCreateNewCourse from "../Instructor/create-new-course/CourseBasicsData";
import InstructorCourseSyllabus from "../Instructor/create-new-course/CourseSyllabus";
import InstructorCoursePricing from "../Instructor/create-new-course/CoursePricing";
import InstructorCourseReview from "../Instructor/create-new-course/CourseReviewSubmit";
import InstructorCourseSEO from "../Instructor/create-new-course/CourseSEO";
import CourseDetails from "../Courses/course-details/courseDetails";
import CourseDetailsTwo from "../Courses/course-details-2/courseDetailsTwo";
import CourseCategoryTwo from "../Courses/course-category-two/courseCategoryTwo";
import StudentDashboard from "../student/dashboard/studentDashboard";
import BlogGrid from "../blog/blog-layouts/blogGrid";
import BlogGrid2 from "../blog/blog-layouts/blogGrid2";
import BlogGrid3 from "../blog/blog-layouts/blogGrid3";
import BlogCarousal from "../blog/blog-layouts/blogCarousal";
import BlogMasonry from "../blog/blog-layouts/blogMasonry";
import BlogLeftSidebar from "../blog/blog-layouts/blogLeftSidebar";
import BlogRightSidebar from "../blog/blog-layouts/blogRightSidebar";
import BlogDetailsLeftSidebar from "../blog/blog-details/blogDetailsLeftSidebar";
import BlogDetailsRightSidebar from "../blog/blog-details/blogDetailsRightSidebar";
import InstructorGrid from "../Pages/instructor/instructor-grid/instructorGrid";
import InstructorList from "../Pages/instructor/instructor-list/instructorList";
import InstructorDetails from "../Pages/instructor/instructor-details/instructor-details";
import VerifyEmail from "../Pages/verify-email/verifyEmail";
import AboutUs from "../Pages/about-us/aboutUs";
import ContactUs from "../Pages/contact-us/contactUs";
import BecomeInstructor from "../Pages/become-instructor/becomeInstructor";
import Testimonials from "../Pages/testimonials/testimonials";
import PricePlanning from "../Pages/price-planning/pricePlanning";
import Faq from "../Pages/faq/faq";
import TermsCondition from "../Pages/terms-condition/termsCondition";
import PrivacyPolicy from "../Pages/privacy-policy/privacyPolicy";
import Login from "../auth/login/login";
import Register from "../auth/register/register";
import ForgortPassword from "../auth/forgot-password/forgortPassword";
import SetPassword from "../auth/set-password/setPassword";
import Otp from "../auth/otp/otp";
import LockScreen from "../auth/lock-screen/lockScreen";
import Error404 from "../auth/error/error-404/error400";
import Error500 from "../auth/error/error-500/error500";
import ComingSoon from "../auth/coming-soon/comingSoon";
import UnderConstruction from "../auth/underconstruction/underConstruction";
import InstructorCourseGrid from "../Instructor/instructor-course/instructorCourseGrid";
import InstructorQuizQuestions from "../Instructor/instructor-quiz-question/instructorQuizQuestions";

import StudentProfile from "../student/student-profile/studentProfile";
import StudentCourse from "../student/student-course/studentCourse";
import StudentCertificates from "../student/student-certificates/student-certificates";
import StudentWishlist from "../student/student-wishlist/studentWishlist";
import StudentReviews from "../student/student-reviews/studentReviews";
import StudentQuiz from "../student/student-quiz/studentQuiz";
import StudentQuizResult from "../student/student-quiz/studentQuizResult";
import StudentOrder from "../student/student-order-history/studentOrder";
import StudentRefferal from "../student/student-refferal/studentRefferal";
import StudentMessage from "../student/student-message/studentMessage";
import StudentsDetails from "../Instructor/student-details/studentsDetails";
import StudentTickets from "../student/student-tickets/studentTickets";
import StudentSettings from "../student/student-settings/studentSettings";
import StudentChangePassword from "../student/student-settings/student-change-password/studentChangePassword";
import StudentSocialProfile from "../student/student-settings/student-social-profile/studentSocialProfile";
import StudentLinkedAccounts from "../student/student-settings/student-linked-accounts/studentLinkedAccounts";
import StudentNotification from "../student/student-settings/student-notifications/studentNotification";
import StudentBillingAddress from "../student/student-settings/student-billing-address/studentBillingAddress";
import StudentQuizQuestion from "../student/student-quiz-question/studentQuizQuestion";
import InstructorProfileSettings from "../Instructor/instructor-settings/instructor-profile-settings/instructorProfile";
import BlogDetails from "../blog/blog-details/blogDetails";
import { CourseLearningPage } from "../learn/components";
import CourseLearningPageDemo from "../admin/admin-course/CourseLearningPageDemo";
import ResumeCourses from "../resume/resumeCourses";
import MessageDetailPage from "../admin/admin-message/adminMessageDetailPage";

const routes = all_routes;

export const publicRoutes = [
  {
    path: "/",
    name: "Root",
    element: <Navigate to="/index" />,
    route: Route,
  },
  {
    path: routes.homeone,
    element: <HomeFive />,
    route: Route,
  },
  {
    path: routes.hometwo,
    element: <HomeTwo />,
    route: Route,
  },
  {
    path: routes.homethree,
    element: <HomeThree />,
    route: Route,
  },
  {
    path: routes.homefour,
    element: <HomeFour />,
    route: Route,
  },
  {
    path: routes.homesix,
    element: <HomeSix />,
    route: Route,
  },
  {
    path: routes.courseGrid,
    element: <CourseGrid />,
    route: Route,
  },
  {
    path: routes.courseList,
    element: <CourseList />,
    route: Route,
  },
  {
    path: routes.courseCategory,
    element: <CourseCategory />,
    route: Route,
  },
  {
    path: routes.courseCategory2,
    element: <CourseCategoryTwo />,
    route: Route,
  },
  {
    path: routes.courseCategory3,
    element: <CourseCategoryThree />,
    route: Route,
  },
  {
    path: routes.courseResume,
    element: <CourseResume />,
    route: Route,
  },
  {
    path: routes.courseWatch,
    element: <CourseWatch />,
    route: Route,
  },
  {
    path: routes.courseCart,
    element: <CourseCart />,
    route: Route,
  },
  {
    path: routes.courseCheckout,
    element: <CourseCheckout />,
    route: Route,
  },
  {
    path: routes.adminDashboard,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.adminInstructorList,
    element: <AdminInstructorsList />,
    route: Route,
  },
  {
    path: routes.adminInstructorRequests,
    element: <AdminInstructorRequests />,
    route: Route,
  },
  {
    path: routes.messageDetailPage,
    element: < MessageDetailPage/>,
    route: Route,
  },
  {
    path: routes.adminProfile,
    element: <AdminProfile />,
    route: Route,
  },
  {
    path: routes.adminCreateNewCourse,
    element: <AdminCreateNewCourse />,
    route: Route,
  },
  {
    path: routes.adminCourseSyllabus,
    element: <AdminCourseSyllabus />,
    route: Route,
  },
  {
    path: routes.adminCourseAccreditation,
    element: <AdminCourseAccreditation />,
    route: Route,
  },
  { 
    path: routes.adminCoursePricing,
    element: <AdminCoursePricing />,
    route: Route,
  },
  {
    path: routes.adminCourseSEO,
    element: <AdminCourseSEO />,
    route: Route,
  },
  {
    path: routes.adminCourseReview,
    element: <AdminCourseReview />,
    route: Route,
  },
  {
    path: routes.adminCourse,
    element: <AdminCourse />,
    route: Route,
  },
  {
    path: routes.adminCourseDetails,
    element: <AdminCourseDetails />,
    route: Route,
  },
  {
    path: routes.adminCourseGrid,
    element: <AdminCourseGrid />,
    route: Route,
  },
    {
    path: routes.adminStudentProgress,
    element: <AdminStudentProgress />,
    route: Route,
  },
  {
    path: routes.adminStudentsGrid,
    element: <AdminStudentGrid />,
    route: Route,
  },
  {
    path: routes.adminCategories,
    element: <AdminCategories />,
    route: Route,
  },
   {
    path: routes.adminSpecialties,
    element: <AdminSpecialties />,
    route: Route,
  },
  {
    path: routes.adminStudentsList,
    element: <AdminStudentList />,
    route: Route,
  },
  {
    path: routes.adminQuiz,
    element: <AdminQuiz />,
    route: Route,
  },
  {
    path: routes.adminQuizResult,
    element: <AdminQuizResult />,
    route: Route,
  },
  {
    path: routes.adminCertificate,
    element: <AdminCertificate />,
    route: Route,
  },
  {
    path: routes.adminCertificateBuilder,
    element: <CertificateBuilder  />,
    route: Route,
  },
  {
    path: routes.adminCertificateBuilderId,
    element: <CertificateBuilder  />,
    route: Route,
  },
  {
    path: routes.adminEarning,
    element: <AdminEarning />,
    route: Route,
  },
  {
    path: routes.adminStatements,
    element: <AdminStatement />,
    route: Route,
  },
  {
    path: routes.adminMessage,
    element: <AdminMessage />,
    route: Route,
  },
    {
    path: routes.adminsettings,
    element: <AdminProfileSettings />,
    route: Route,
  },
  {
    path: routes.adminProfile,
    element: <AdminProfile />,
    route: Route,
  },
  {
    path: routes.adminChangePassword,
    element: <AdminChangePassoword />,
    route: Route,
  },
  {
    path: routes.adminPlan,
    element: <AdminPlanSettings />,
    route: Route,
  },
  {
    path: routes.adminSocialProfiles,
    element: <AdminSocialprofileSettings />,
    route: Route,
  },
  {
    path: routes.adminLinkedAccounts,
    element: <AdminLinkedAccounts />,
    route: Route,
  },
  {
    path: routes.adminNotification,
    element: <AdminNotification />,
    route: Route,
  },
  {
    path: routes.adminIntegrations,
    element: <AdminIntegrations />,
    route: Route,
  },
  {
    path: routes.adminWithdraw,
    element: <AdminWithdraw />,
    route: Route,
  },
  {
    path: routes.instructorDashboard,
    element: <InstructorDashboard />,
    route: Route,
  },
  {
    path: routes.instructorProfile,
    element: <InstructorProfile />,
    route: Route,
  },
  {
    path: routes.instructorCreateNewCourse,
    element: <InstructorCreateNewCourse />,
    route: Route,
  },
  {
    path: routes.instructorCourseSyllabus,
    element: <InstructorCourseSyllabus />,
    route: Route,
  },
  { 
    path: routes.instructorCoursePricing,
    element: <InstructorCoursePricing />,
    route: Route,
  },
  {
    path: routes.instructorCourseSEO,
    element: <InstructorCourseSEO />,
    route: Route,
  },
  {
    path: routes.instructorCourseReview,
    element: <InstructorCourseReview />,
    route: Route,
  },
  {
    path: routes.instructorCourse,
    element: <InstructorCourse />,
    route: Route,
  },
  {
    path: routes.instructorCourseDetails,
    element: <InstructorCourseDetails />,
    route: Route,
  },
  {
    path: routes.instructorAnnouncements,
    element: <InstructorAnnouncements />,
    route: Route,
  },
  {
    path: routes.instructorAssignment,
    element: <InstructorAssignment />,
    route: Route,
  },
  {
    path: routes.studentsGrid,
    element: <StudentGrid />,
    route: Route,
  },
  {
    path: routes.studentsList,
    element: <StudentList />,
    route: Route,
  },
  {
    path: routes.instructorQuiz,
    element: <InstructorQuiz />,
    route: Route,
  },
  {
    path: routes.instructorQuizResult,
    element: <InstructorQuizResult />,
    route: Route,
  },
  {
    path: routes.instructorEarning,
    element: <InstructorEarning />,
    route: Route,
  },
  {
    path: routes.instructorPayout,
    element: <InstructorPayout />,
    route: Route,
  },
  {
    path: routes.instructorStatements,
    element: <InstructorStatement />,
    route: Route,
  },
  {
    path: routes.instructorMessage,
    element: <InstructorMessage />,
    route: Route,
  },
  {
    path: routes.instructorTickets,
    element: <InstructorTickets />,
    route: Route,
  },
  {
    path: routes.instructorProfile,
    element: <InstructorProfile />,
    route: Route,
  },
  {
    path: routes.instructorChangePassword,
    element: <InstructorChangePassoword />,
    route: Route,
  },
  {
    path: routes.instructorPlan,
    element: <InstructorPlanSettings />,
    route: Route,
  },
  {
    path: routes.instructorSocialProfiles,
    element: <InstructorSocialprofileSettings />,
    route: Route,
  },
  {
    path: routes.instructorLinkedAccounts,
    element: <InstructorLinkedAccounts />,
    route: Route,
  },
  {
    path: routes.instructorNotification,
    element: <InstructorNotification />,
    route: Route,
  },
  {
    path: routes.instructorIntegrations,
    element: <InstructorIntegrations />,
    route: Route,
  },
  {
    path: routes.instructorWithdraw,
    element: <InstructorWithdraw />,
    route: Route,
  },
  {
    path: routes.courseDetails,
    element: <CourseDetails />,
    route: Route,
  },
  {
    path: routes.courseDetails2,
    element: <CourseDetailsTwo />,
    route: Route,
  },
  {
    path: routes.studentDashboard,
    element: <StudentDashboard />,
    route: Route,
  },
  {
    path: routes.blogGrid,
    element: <BlogGrid />,
    route: Route,
  },
  {
    path: routes.blogGrid2,
    element: <BlogGrid2 />,
    route: Route,
  },
  {
    path: routes.blogGrid3,
    element: <BlogGrid3 />,
    route: Route,
  },
  {
    path: routes.blogCarousal,
    element: <BlogCarousal />,
    route: Route,
  },
  {
    path: routes.blogMasonry,
    element: <BlogMasonry />,
    route: Route,
  },
  {
    path: routes.blogLeftSidebar,
    element: <BlogLeftSidebar />,
    route: Route,
  },
  {
    path: routes.blogRightSidebar,
    element: <BlogRightSidebar />,
    route: Route,
  },
  {
    path: routes.blogDetailsLeftSidebar,
    element: <BlogDetailsLeftSidebar />,
    route: Route,
  },
  {
    path: routes.blogDetailsRightSidebar,
    element: <BlogDetailsRightSidebar />,
    route: Route,
  },
  {
    path: routes.blogDetails,
    element: <BlogDetails />,
    route: Route,
  },
  {
    path: routes.instructorGrid,
    element: <InstructorGrid />,
    route: Route,
  },
  {
    path: routes.instructorList,
    element: <InstructorList />,
    route: Route,
  },
  {
    path: routes.instructorDetails,
    element: <InstructorDetails />,
    route: Route,
  },
  {
    path: routes.about_us,
    element: <AboutUs />,
    route: Route,
  },
  {
    path: routes.contactUs,
    element: <ContactUs />,
    route: Route,
  },
  {
    path: routes.becomeAnInstructor,
    element: <BecomeInstructor />,
    route: Route,
  },
  {
    path: routes.testimonials,
    element: <Testimonials />,
    route: Route,
  },
  {
    path: routes.pricingPlan,
    element: <PricePlanning />,
    route: Route,
  },
  {
    path: routes.FAQ,
    element: <Faq />,
    route: Route,
  },
  {
    path: routes.termsConditions,
    element: <TermsCondition />,
    route: Route,
  },
  {
    path: routes.privacyPolicy,
    element: <PrivacyPolicy />,
    route: Route,
  },
  {
    path: routes.studentProfile,
    element: <StudentProfile />,
    route: Route,
  },
  {
    path: routes.studentCourses,
    element: <StudentCourse />,
    route: Route,
  },
  {
    path: routes.studentCertificates,
    element: <StudentCertificates />,
    route: Route,
  },
  {
    path: routes.studentWishlist,
    element: <StudentWishlist />,
    route: Route,
  },
  {
    path: routes.studentReviews,
    element: <StudentReviews />,
    route: Route,
  },
  {
    path: routes.studentQuiz,
    element: <StudentQuiz />,
    route: Route,
  },
  {
    path: routes.studentQuizResult,
    element: <StudentQuizResult />,
    route: Route,
  },
  {
    path: routes.studentOrderHistory,
    element: <StudentOrder />,
    route: Route,
  },
  {
    path: routes.studentReferral,
    element: <StudentRefferal />,
    route: Route,
  },
  {
    path: routes.studentMessage,
    element: <StudentMessage />,
    route: Route,
  },
  {
    path: routes.instructorCourseGrid,
    element: <InstructorCourseGrid />,
    route: Route,
  },
  {
    path: routes.studentsDetails,
    element: <StudentsDetails />,
    route: Route,
  },
  {
    path: routes.instructorQA,
    element: <InstructorQuizQuestions />,
    route: Route,
  },
  {
    path: routes.studentTickets,
    element: <StudentTickets />,
    route: Route,
  },
  {
    path: routes.studentSettings,
    element: <StudentSettings />,
    route: Route,
  },
  {
    path: routes.studentChangePassword,
    element: <StudentChangePassword />,
    route: Route,
  },
  {
    path: routes.studentSocialProfile,
    element: <StudentSocialProfile />,
    route: Route,
  },
  {
    path: routes.studentLinkedAccounts,
    element: <StudentLinkedAccounts />,
    route: Route,
  },
  {
    path: routes.studentNotification,
    element: <StudentNotification />,
    route: Route,
  },
  {
    path: routes.studentBillingAddress,
    element: <StudentBillingAddress />,
    route: Route,
  },
  {
    path: routes.studentQuizQuestion,
    element: <StudentQuizQuestion />,
    route: Route,
  },
  {
    path: routes.instructorsettings,
    element: <InstructorProfileSettings />,
    route: Route,
  },
];

export const authRoutes = [
  {
    path: routes.login,
    element: <Login />,
    route: Route,
  },
  {
    path: routes.googlelogin,
    element: <GoogleAuthSuccess />,
    route: Route,
  },
  {
    path: routes.register,
    element: <Register />,
    route: Route,
  },
  {
    path: routes.forgotpassword,
    element: <ForgortPassword />,
    route: Route,
  },
  {
    path: routes.setpassowrd,
    element: <SetPassword />,
    route: Route,
  },
  {
    path: routes.otp,
    element: <Otp />,
    route: Route,
  },
  {
    path: routes.lockscreen,
    element: <LockScreen />,
    route: Route,
  },
  {
    path: routes.verify,
    element: <VerifyEmail />,
    route: Route,
  },
  {
    path: routes.Error404,
    element: <Error404 />,
    route: Route,
  },
  {
    path: routes.Error500,
    element: <Error500 />,
    route: Route,
  },
  {
    path: routes.underconstruction,
    element: <UnderConstruction />,
    route: Route,
  },
  {
    path: routes.comingSoon,
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: routes.courseLearningPage,
    element: <CourseLearningPage />,
    route: Route,
  },
  {
    path: routes.courseDemoPage,
    element: <CourseLearningPageDemo />,
    route: Route,
  },
  {
    path: all_routes.resumeCourses,
    element: <ResumeCourses />
  },
];
