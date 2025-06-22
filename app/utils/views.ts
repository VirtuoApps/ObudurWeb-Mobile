export const views: {
  [key: string]: { tr: string; en: string; image: string };
} = {
  city: {
    tr: "Şehir",
    en: "City",
    image: "/ofice.png",
  },
  sea: {
    tr: "Deniz",
    en: "Sea",
    image: "/sea-view.png",
  },
  lake: {
    tr: "Göl",
    en: "Lake",
    image: "/lake.png",
  },
  landscape: {
    tr: "Doğa",
    en: "Nature",
    image: "/landscape.png",
  },
};

export const viewsAsArray = Object.entries(views).map(([key, value]) => ({
  _id: key,
  name: {
    tr: value.tr,
    en: value.en,
  },
  iconUrl: value.image,
  featureType: "scenery",
  createdAt: "",
  updatedAt: "",
  __v: 0,
}));
