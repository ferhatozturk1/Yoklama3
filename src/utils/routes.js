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
  
  // Course management routes
  DERS_VE_DONEM_ISLEMLERI: "/portal/ders-ve-donem-islemleri",
  DERS_KAYIT: "/portal/ders-kayit",
  DERS_EKLE_BIRAK: "/portal/ders-ekle-birak",
  DERS_GUNCELLE: "/portal/ders-guncelle",
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
    key: "ders-ve-donem-islemleri",
    label: "Ders ve Dönem İşlemleri",
    path: ROUTES.DERS_VE_DONEM_ISLEMLERI,
    icon: "Groups",
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
  if (pathname.includes("/ders-ve-donem-islemleri") || 
      pathname.includes("/ders-kayit") || 
      pathname.includes("/ders-ekle-birak") || 
      pathname.includes("/ders-guncelle")) return "ders-ve-donem-islemleri";
  if (pathname.includes("/derslerim")) return "derslerim";
  if (pathname.includes("/profilim")) return "profilim";
  return "ana-sayfa";
};

export const getSectionTitle = (section) => {
  const item = NAVIGATION_ITEMS.find((item) => item.key === section);
  return item ? item.label : "Ana Sayfa";
};
