import { all_routes } from "../../../../feature-module/router/all_routes";

export const instructorSidebarData = [
    {
        title:'Dashboard',
        icon:'isax isax-grid-35',
        route: all_routes.instructorDashboard
    },
    {
        title:'My Profile',
        icon:'fa-solid fa-user',
        route: all_routes.instructorProfile
    },
    {
        title:'Add New Course',
        icon:'isax isax-add-circle',  // Circle with plus sign
        route: all_routes.instructorCreateNewCourse.replace(':courseId', 'new')
    },
    {
        title:'My Courses',
        icon:'isax isax-teacher5',
        route: all_routes.instructorCourse
    },
    // {
    //     title:'Announcements',
    //     icon:'isax isax-volume-high5',
    //     route: all_routes.instructorAnnouncements
    // },
    // {
    //     title:'Assignments',
    //     icon:'isax isax-clipboard-text5',
    //     route: all_routes.instructorAssignment
    // },
    {
        title:'Students',
        icon:'isax isax-profile-2user5',
        route: all_routes.studentsList
    },
    {
        title:'Quiz',
        icon:'isax isax-award5',
        route: all_routes.instructorQuiz,
        subRoute: all_routes.instructorQA
    },
    // {
    //     title:'Quiz Results',
    //     icon:'isax isax-medal-star5',
    //     route: all_routes.instructorQuizResult
    // },
    // {
    //     title:'Certificates',
    //     icon:'isax isax-note-215',
    //     route: all_routes.instructorCertificate
    // },
    {
        title:'Earnings',
        icon:'isax isax-wallet-add5',
        route: all_routes.instructorEarning
    },
    // {
    //     title:'Payout',
    //     icon:'isax isax-coin-15',
    //     route: all_routes.instructorPayout
    // },
    // {
    //     title:'Statements',
    //     icon:'isax isax-shopping-cart5',
    //     route: all_routes.instructorStatements
    // },
    {
        title:'Messages',
        icon:'isax isax-messages-35',
        route: all_routes.instructorMessage
    },
    // {
    //     title:'Support Tickets',
    //     icon:'isax isax-ticket5',
    //     route: all_routes.instructorTickets
    // },
    
    
]