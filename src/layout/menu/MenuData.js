const menu = [
  {
    icon: "grid",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "growth",
    text: "Plan List",
    link: "/plan-list",
  },
  {
    icon: "users",
    text: "User Manage",
    link: "/user-list",
  },
  // {
  //   icon: "file-docs",
  //   text: "KYC",
  //   link: "/kyc-list",
  // },
  {
    icon: "file-docs",
    text: "KYC",
    link: "/kyclist",
  },
  {
    icon: "coin-eur",
    text: "Payment Method",
    link: "/payment-method",
  },
  {
    icon: "calendar",
    text: "Payout Setting",
    link: "/payout-setting",
  },
  {
    icon: "tranx",
    text: "Transaction",
    // link: "/transaction-history",
    link: "/transaction",
  },
  {
    icon: "tranx",
    text: "Commission",
    // link: "/transaction-history",
    link: "/commission",
  },
  {
    icon: "invest",
    text: "Investment",
    link: "/investment-history",
  },
  {
    icon: "invest",
    text: "F10 Investment",
    link: "/f10-investment",
  },
  // {
  //   icon: "wallet-in",
  //   text: "Deposit",
  //   link: "/deposit-history",
  // },
  {
    icon: "wallet-in",
    text: "Deposit",
    active: false,
    subMenu: [
      {
        text: "deposit request",
        link: "/deposit-request",
      },
      {
        text: "deposit log",
        link: "/deposit-history",
      },
    ],
  },
  // {
  //   icon: "money",
  //   text: "Payout Request",
  //   link: "/payout",
  // },
  {
    icon: "money",
    text: "Payout",
    active: false,
    subMenu: [
      {
        text: "Payout Request",
        link: "/payout-req",
      },
      {
        text: "Payout log",
        link: "/payout-log",
      },
    ],
  },
  {
    icon: "sign-chf-alt",
    text: "Filan Token",
    link: "/filan-token",
  },

  {
    icon: "share",
    text: "Refferal Settings",
    link: "/reffer-list",
  },
  {
    icon: "bell",
    text: "Send Notification",
    link: "/notification",
  },
  {
    icon: "mail",
    text: "Send Mail",
    link: "/email",
  },
  // {
  //   heading: "Misc Pages",
  // },
  // {
  //   icon: "signin",
  //   text: "Auth Pages",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Login / Signin",
  //       link: "/auth-login",
  //       newTab: true,
  //     },
  //     {
  //       text: "Register / Signup",
  //       link: "/auth-register",
  //       newTab: true,
  //     },
  //     {
  //       text: "Forgot Password",
  //       link: "/auth-reset",
  //       newTab: true,
  //     },
  //     {
  //       text: "Success / Confirm",
  //       link: "/auth-success",
  //       newTab: true,
  //     },
  //   ],
  // },
  // {
  //   icon: "files",
  //   text: "Error Pages",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "404 Classic",
  //       link: "/errors/404-classic",
  //       newTab: true,
  //     },
  //     {
  //       text: "504 Classic",
  //       link: "/errors/504-classic",
  //       newTab: true,
  //     },
  //     {
  //       text: "404 Modern",
  //       link: "/errors/404-modern",
  //       newTab: true,
  //     },
  //     {
  //       text: "504 Modern",
  //       link: "/errors/504-modern",
  //       newTab: true,
  //     },
  //   ],
  // },
  // {
  //   icon: "files",
  //   text: "Other Pages",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Blank / Startup",
  //       link: "/_blank",
  //     },
  //     {
  //       text: "Faqs / Help",
  //       link: "/pages/faq",
  //     },
  //     {
  //       text: "Terms / Policy",
  //       link: "/pages/terms-policy",
  //     },
  //     {
  //       text: "Regular Page - v1",
  //       link: "/pages/regular-v1",
  //     },
  //     {
  //       text: "Regular Page - v2",
  //       link: "/pages/regular-v2",
  //     },
  //   ],
  // },
  // {
  //   heading: "Components",
  // },
  // {
  //   icon: "layers",
  //   text: "Ui Elements",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Alerts",
  //       link: "/components/alerts",
  //     },
  //     {
  //       text: "Accordions",
  //       link: "/components/accordions",
  //     },
  //     {
  //       text: "Avatar",
  //       link: "/components/avatar",
  //     },
  //     {
  //       text: "Badges",
  //       link: "/components/badges",
  //     },
  //     {
  //       text: "Buttons",
  //       link: "/components/buttons",
  //     },
  //     {
  //       text: "Button Group",
  //       link: "/components/button-group",
  //     },
  //     {
  //       text: "Breadcrumbs",
  //       link: "/components/breadcrumbs",
  //     },
  //     {
  //       text: "Cards",
  //       link: "/components/cards",
  //     },
  //     {
  //       text: "Carousel",
  //       link: "/components/carousel",
  //     },
  //     {
  //       text: "Dropdowns",
  //       link: "/components/dropdowns",
  //     },
  //     {
  //       text: "Modals",
  //       link: "/components/modals",
  //     },
  //     {
  //       text: "Pagination",
  //       link: "/components/pagination",
  //     },
  //     {
  //       text: "Popovers",
  //       link: "/components/popovers",
  //     },
  //     {
  //       text: "Progress",
  //       link: "/components/progress",
  //     },
  //     {
  //       text: "Spinner",
  //       link: "/components/spinner",
  //     },
  //     {
  //       text: "Tabs",
  //       link: "/components/tabs",
  //     },
  //     {
  //       text: "Toast",
  //       link: "/components/toast",
  //     },
  //     {
  //       text: "Typography",
  //       link: "/components/typography",
  //     },
  //     {
  //       text: "Tooltips",
  //       link: "/components/tooltips",
  //     },
  //     {
  //       text: "Utilities",
  //       active: false,
  //       subMenu: [
  //         {
  //           text: "Borders",
  //           link: "/components/util-border",
  //         },
  //         {
  //           text: "Colors",
  //           link: "/components/util-colors",
  //         },
  //         {
  //           text: "Display",
  //           link: "/components/util-display",
  //         },
  //         {
  //           text: "Embeded",
  //           link: "/components/util-embeded",
  //         },
  //         {
  //           text: "Flex",
  //           link: "/components/util-flex",
  //         },
  //         {
  //           text: "Text",
  //           link: "/components/util-text",
  //         },
  //         {
  //           text: "Sizing",
  //           link: "/components/util-sizing",
  //         },
  //         {
  //           text: "Spacing",
  //           link: "/components/util-spacing",
  //         },
  //         {
  //           text: "Others",
  //           link: "/components/util-others",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   icon: "dot-box",
  //   text: "Crafted Icons",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "SVG Icon-Exclusive",
  //       link: "/svg-icons",
  //     },
  //     {
  //       text: "Nioicon - HandCrafted",
  //       link: "/nioicon",
  //     },
  //   ],
  // },
  // {
  //   icon: "table-view",
  //   text: "Tables",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Basic Tables",
  //       link: "/table-basic",
  //     },
  //     {
  //       text: "Special Tables",
  //       link: "/table-special",
  //     },
  //     {
  //       text: "DataTables",
  //       link: "/table-datatable",
  //     },
  //   ],
  // },
  // {
  //   icon: "card-view",
  //   text: "Forms",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Form Elements",
  //       link: "/components/form-elements",
  //     },
  //     {
  //       text: "Checkbox Radio",
  //       link: "/components/checkbox-radio",
  //     },
  //     {
  //       text: "Advanced Controls",
  //       link: "/components/advanced-control",
  //     },
  //     {
  //       text: "Input Group",
  //       link: "/components/input-group",
  //     },
  //     {
  //       text: "Form Upload",
  //       link: "/components/form-upload",
  //     },
  //     {
  //       text: "Date Time Picker",
  //       link: "/components/datetime-picker",
  //     },
  //     {
  //       text: "Number Spinner",
  //       link: "/components/number-spinner",
  //     },
  //     {
  //       text: "noUiSlider",
  //       link: "/components/nouislider",
  //     },
  //     {
  //       text: "Form Layouts",
  //       link: "/components/form-layouts",
  //     },
  //     {
  //       text: "Form Validation",
  //       link: "/components/form-validation",
  //     },
  //     {
  //       text: "Wizard Basic",
  //       link: "/components/wizard-basic",
  //     },
  //     {
  //       text: "Rich Editor",
  //       active: false,
  //       subMenu: [
  //         {
  //           text: "Quill",
  //           link: "/components/quill",
  //         },
  //         {
  //           text: "Tinymce",
  //           link: "/components/tinymce",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   icon: "pie",
  //   text: "Charts",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "Chart Js",
  //       link: "/charts/chartjs",
  //     },
  //     {
  //       text: "Knobs",
  //       link: "/charts/knobs",
  //     },
  //   ],
  // },
  // {
  //   icon: "puzzle",
  //   text: "Widgets",
  //   subMenu: [
  //     {
  //       text: "Card Widgets",
  //       link: "/components/widgets/cards",
  //     },
  //     {
  //       text: "Chart Widgets",
  //       link: "/components/widgets/charts",
  //     },
  //     {
  //       text: "Rating Widgets",
  //       link: "/components/widgets/rating",
  //     },
  //   ],
  // },
  // {
  //   icon: "block-over",
  //   text: "Miscellaneous",
  //   subMenu: [
  //     {
  //       text: "Slick Sliders",
  //       link: "/components/misc/slick-slider",
  //     },
  //     {
  //       text: "JsTree",
  //       link: "/components/misc/jsTree",
  //     },
  //     {
  //       text: "React Toastify",
  //       link: "/components/misc/toastify",
  //     },
  //     {
  //       text: "Sweet Alert",
  //       link: "/components/misc/sweet-alert",
  //     },
  //     {
  //       text: "React DualListBox",
  //       link: "/components/misc/dual-list",
  //     },
  //     {
  //       text: "React Beautiful Dnd",
  //       link: "/components/misc/beautiful-dnd",
  //     },
  //     {
  //       text: "Google Map",
  //       link: "/components/misc/map",
  //     },
  //   ],
  // },
  // {
  //   icon: "text-rich",
  //   text: "Email Template",
  //   link: "/email-template",
  //   active: "false",
  // },
];
export default menu;
