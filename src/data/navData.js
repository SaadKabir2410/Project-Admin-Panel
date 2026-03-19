export const NAV_GROUPS = [
  {
    title: "Main Menu",
    links: [
      { id: "main-dashboard", name: "Dashboard", href: "/" },
      { id: "main-tickets", name: "AMS Tickets", href: "/ams-tickets" },
    ],
  },
  {
    title: "Management",
    links: [
      {
        id: "mgmt-report",
        name: "Reports",
        href: "/reports",
        subMenu: [
          { id: "sub-reports-tickets", name: "AMS Tickets Report", href: "/reports/tickets" },
          { id: "sub-reports-general", name: "General Report", href: "/reports/general" },
          { id: "sub-reports-afterhours", name: "After Working Hours Report", href: "/reports/after-hours" },
          { id: "sub-reports-commission", name: "Ticket Commission Report", href: "/reports/commission" },
        ],
      },
      { id: "mgmt-jobsheets", name: "Jobsheets", href: "/jobsheets" },
      {
        id: "lookup-master",
        name: "Lookups",
        subMenu: [
          { id: "lookup-hours", name: "User Working Hours", href: "/working-hours" },
          { id: "lookup-sites", name: "Sites", href: "/sites" },
          { id: "lookup-countries", name: "Countries", href: "/countries" },
          { id: "lookup-codes", name: "Work Done Codes", href: "/work-codes" },
          { id: "lookup-holidays", name: "Holidays", href: "/holidays" },
          { id: "lookup-codes-new", name: "Codes", href: "/codes", adminOnly: true },
          { id: "lookup-code-details", name: "Code Details", href: "/code-details", adminOnly: true },
          { id: "lookup-task-categories", name: "Task Category Projects", href: "/task-category-projects", adminOnly: true },
        ],
      },
    ],
  },
  {
    title: " Administration",
    links: [
      {
        id: "set-identity",
        name: "Identity Management",
        subMenu: [
          { id: "set-users", name: "Users", href: "/users", permission: "AbpIdentity.Users" },
          { id: "set-roles", name: "Roles", href: "/roles", permission: "AbpIdentity.Roles" },
        ],
      },
    ],
  },
];