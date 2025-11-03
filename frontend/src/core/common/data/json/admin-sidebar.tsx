import { all_routes } from "../../../../feature-module/router/all_routes";

export const adminSidebarData = [
    {
        title: 'Dashboard',
        icon: 'isax isax-grid-35',
        route: all_routes.adminDashboard,
        type: 'single'
    },
    {
        title: 'Instructor Management',
        icon: 'isax isax-teacher5',
        type: 'group',
        submenus: [
            {
                title: 'All Instructors',
                icon: 'isax isax-profile-2user5',
                route: all_routes.adminInstructorList 
            },
            {
                title: 'Instructor Requests',
                icon: 'isax isax-ticket5',
                route: all_routes.adminInstructorRequests 
            },
            {
                title: 'Instructor Earnings',
                icon: 'isax isax-wallet-add5',
                route: all_routes.adminEarning
            }
        ]
    },
    {
        title: 'Student Management',
        icon: 'isax isax-people5',
        type: 'group',
        submenus: [
            {
                title: 'All Students',
                icon: 'isax isax-profile-2user5',
                route: all_routes.adminStudentsList
            },
            {
                title: 'Student Progress',
                icon: 'isax isax-chart-215',
                route: all_routes.adminStudentProgress 
            }
        ]
    },
    {
        title: 'Course Management',
        icon: 'isax isax-book5',
        type: 'group',
        submenus: [
            {
                title: 'All Courses',
                icon: 'isax isax-teacher5',
                route: all_routes.adminCourse
            },
            {
                title: 'Add New Course',
                icon: 'isax isax-add-circle',
                route: all_routes.adminCreateNewCourse.replace(':courseId', 'new')
            },
            {
                title: 'Course Reviews',
                icon: 'isax isax-star5',
                route: all_routes.adminCourseReviews // You'll need to add this route
            },
            {
                title: 'Categories',
                icon: 'isax isax-category5',
                route: all_routes.adminCategories // You'll need to add this route
            },
            {
                title: 'Specialties',
                icon: 'isax isax-category4',
                route: all_routes.adminSpecialties // You'll need to add this route
            }
        ]
    },
    {
        title: 'Certificate Management',
        icon: 'isax isax-award5',
        type: 'group',
        submenus: [
            {
                title: 'All Certificates',
                icon: 'isax isax-note-215',
                route: all_routes.adminCertificate
            },
            {
                title: 'Quiz Management',
                icon: 'isax isax-clipboard-text5',
                route: all_routes.adminQuiz,
                subRoute: all_routes.adminQA
            },
            // {
            //     title: 'Quiz Results',
            //     icon: 'isax isax-medal-star5',
            //     route: all_routes.adminQuizResult
            // }
        ]
    },
    {
        title: 'Payment Management',
        icon: 'isax isax-wallet5',
        type: 'group',
        submenus: [
            {
                title: 'Transactions',
                icon: 'isax isax-shopping-cart5',
                route: all_routes.adminStatements
            },
            // {
            //     title: 'Payouts',
            //     icon: 'isax isax-money-send5',
            //     route: all_routes.adminPayouts // You'll need to add this route
            // },
            // {
            //     title: 'Revenue Reports',
            //     icon: 'isax isax-chart-square5',
            //     route: all_routes.adminRevenueReports // You'll need to add this route
            // }
        ]
    },
    {
        title: 'Messages',
        icon: 'isax isax-messages-35',
        route: all_routes.adminMessage,
        type: 'single'
    },
    {
        title: 'My Profile',
        icon: 'fa-solid fa-user',
        route: all_routes.adminProfile,
        type: 'single'
    }
];