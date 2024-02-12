// Super Admin Menu Items
export const navbarData = [
    {
        routeLink: '/dashboard',
        icon: 'bi bi-grid-fill',
        label: 'Dashboard'
    },
    {
        routeLink: 'human-resources/employees',
        icon: 'bi bi-person-vcard-fill',
        label: 'Human Resources',
        subMenu: [
            {
                routeLink: 'human-resources/employees',
                icon: 'bi bi-people-fill',
                label: 'Employees',
            },
            {
                routeLink: 'human-resources/payroll',
                icon: 'bi bi-layers-fill',
                label: 'Payroll',
            },
            // {
            //     routeLink: 'human-resources/self-service',
            //     icon: 'bi bi-person-workspace',
            //     label: 'Self-Service'
            // },
            {
                routeLink: 'human-resources/leave-management',
                icon: 'bi bi-calendar2-x-fill',
                label: 'Leave Management'
            },
            {
                routeLink: 'human-resources/expense-management',
                icon: 'bi bi-credit-card-fill',
                label: 'Expense Management',
            },
            {
                routeLink: 'human-resources/appraisals',
                icon: 'bi bi-award-fill',
                label: 'Appraisal Management'
            },
            {
                routeLink: 'human-resources/recruitment',
                icon: 'bi bi-briefcase-fill',
                label: 'Recruitment',
            },
            {
                routeLink: 'human-resources/document-management',
                icon: 'bi bi-file-earmark-text-fill',
                label: 'Attendance'
            },
            {
                routeLink: 'human-resources/visitors-log',
                icon: 'bi bi-person-workspace',
                label: 'Visitors Log'
            }
        ]
    },
    {
        routeLink: 'accounting',
        icon: 'bi bi-calculator-fill',
        label: 'Accounting'
    },
    {
        routeLink: 'project-management',
        icon: 'bi bi-folder-fill',
        label: 'Projects'
    },
    {
        routeLink: 'customer-relationship-management',
        icon: 'bi bi-microsoft-teams',
        label: 'CRM'
    },
    {
        routeLink: 'supply-chain',
        icon: 'bi bi-ubuntu',
        label: 'Supply Chain'
    },
    {
        routeLink: 'settings',
        icon: 'bi bi-gear-fill',
        label: 'Settings',
        subMenu: [
            {
                routeLink: 'settings/general-settings',
                icon: 'bi bi-box-fill',
                label: 'General',
            },
            {
                routeLink: 'settings/human-resources-settings',
                icon: 'bi bi-people-fill',
                label: 'Human Resources',
            },
            {
                routeLink: 'settings/accounting',
                icon: 'bi bi-calculator-fill',
                label: 'Accounting'
            },
            {
                routeLink: 'settings/project-management',
                icon: 'bi bi-folder-fill',
                label: 'Projects'
            },
            {
                routeLink: 'settings/customer-relationship-management',
                icon: 'bi bi-microsoft-teams',
                label: 'CRM'
            },
            {
                routeLink: 'settings/supply-chain',
                icon: 'bi bi-ubuntu',
                label: 'Supply Chain'
            },
        ]
    }

]

// Employee Menu Items
export const navbarDataReg = [
    {
        routeLink: '/dashboard',
        icon: 'bi bi-grid-fill',
        label: 'Dashboard'
    },
    {
        routeLink: 'human-resources/self-service/overview',
        icon: 'bi bi-person-fill',
        label: 'Profile',
    },
    {
        routeLink: 'human-resources/self-service/payroll',
        icon: 'bi bi-layers-fill',
        label: 'Payroll',
    },
    {
        routeLink: 'human-resources/self-service/leave-requests',
        icon: 'bi bi-person-fill',
        label: 'Leave Requests',
    },
    {
        routeLink: 'human-resources/self-service/reimbursement',
        icon: 'bi bi-person-fill',
        label: 'Expense Requests',
    },
    {
        routeLink: 'human-resources/self-service/appraisals',
        icon: 'bi bi-journal-x',
        label: 'Appraisal Requests',
    },
    {
        routeLink: 'human-resources/visitors-log',
        icon: 'bi bi-stickies-fill',
        label: 'Visitors Log'
    },
    {
        routeLink: 'human-resources/self-service/induction',
        icon: 'bi bi-person-workspace',
        label: 'Induction'
    }
]

// Manager Menu Items
export const navbarDataManager = [
    {
        routeLink: '/dashboard',
        icon: 'bi bi-grid-fill',
        label: 'Dashboard'
    },
    {
        routeLink: 'human-resources/self-service/overview',
        icon: 'bi bi-person-fill',
        label: 'Profile',
    },
    {
        routeLink: 'human-resources/self-service/payroll',
        icon: 'bi bi-layers-fill',
        label: 'Payroll',
    },
    {
        routeLink: 'human-resources/self-service/leave-requests',
        icon: 'bi bi-calendar2-x-fill',
        label: 'Leave Requests',
    },
    {
        routeLink: 'human-resources/leave-management',
        icon: 'bi bi-calendar2-check-fill',
        label: 'Leave Management'
    },
    {
        routeLink: 'human-resources/self-service/reimbursement',
        icon: 'bi bi-credit-card-fill',
        label: 'Expense Requests',
    },
    {
        routeLink: 'human-resources/expense-management',
        icon: 'bi bi-credit-card-2-front-fill',
        label: 'Expense Management',
    },
    {
        routeLink: 'human-resources/self-service/appraisals',
        icon: 'bi bi-journal-x',
        label: 'Appraisal Requests',
    },
    {
        routeLink: 'human-resources/appraisals',
        icon: 'bi bi-journal-check',
        label: 'Appraisal Management',
    },
    {
        routeLink: 'human-resources/visitors-log',
        icon: 'bi bi-stickies-fill',
        label: 'Visitors Log'
    },
    {
        routeLink: 'human-resources/self-service/induction',
        icon: 'bi bi-person-workspace',
        label: 'Induction'
    }
]

export interface INavbarData {
    routeLink: string;
    icon?: string;
    label: string;
}