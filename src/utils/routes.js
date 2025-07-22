// Route constants for the application
export const ROUTES = {
  // Authentication routes
  LOGIN: "/",
  REGISTER: "/ogretmen-kayit",

  // Portal routes
  PORTAL: "/portal",
  ANA_SAYFA: "/portal/ana-sayfa",

  DERSLERIM: "/portal/derslerim",
  YOKLAMA: "/portal/yoklama",
  PROFILIM: "/portal/profilim",
};

// Navigation items configuration
export const NAVIGATION_ITEMS = [
  {
    key: "ana-sayfa",
    label: "Ana Sayfa",
    path: ROUTES.ANA_SAYFA,
    icon: "Home",
  },

  {
    key: "derslerim",
    label: "Derslerim",
    path: ROUTES.DERSLERIM,
    icon: "Class",
  },
  {
    key: "profilim",
    label: "Profilim",
    path: ROUTES.PROFILIM,
    icon: "Person",
  },
];

// Navigation utilities
export const getActiveSection = (pathname) => {
  if (pathname.includes("/derslerim")) return "derslerim";
  if (pathname.includes("/profilim")) return "profilim";
  return "ana-sayfa";
};

export const getSectionTitle = (section) => {
  const item = NAVIGATION_ITEMS.find((item) => item.key === section);
  return item ? item.label : "Ana Sayfa";
};
