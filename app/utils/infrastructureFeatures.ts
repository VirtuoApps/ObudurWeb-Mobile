export const infrastructureFeatures: {
  [key: string]: { tr: string; en: string; image: string };
} = {
  electric: {
    tr: "Elektrik",
    en: "Electric",
    image: "/electricity.png",
  },
  water: {
    tr: "Su",
    en: "Water",
    image: "/water.png",
  },
  naturalGas: {
    tr: "Doğal Gaz",
    en: "Natural Gas",
    image: "/fire.png",
  },
  telephone: {
    tr: "Telefon",
    en: "Telephone",
    image: "/phone.png",
  },
  sewerage: {
    tr: "Kanalizasyon",
    en: "Sewerage",
    image: "/drain.png",
  },
  treatment: {
    tr: "Arıtma",
    en: "Treatment",
    image: "/treatment.png",
  },
  drillingWell: {
    tr: "Sondaj & Kuyu",
    en: "Drilling & Well",
    image: "/draw-well.png",
  },
  groundSurvey: {
    tr: "Zemin Etüdü",
    en: "Ground Survey",
    image: "/report.png",
  },
  roadOpened: {
    tr: "Yolu Açılmış",
    en: "Road Opened",
    image: "/way.png",
  },
};

export const infrastructureFeaturesAsArray = Object.entries(
  infrastructureFeatures
).map(([key, value]) => ({
  _id: key,
  name: {
    tr: value.tr,
    en: value.en,
  },
  iconUrl: value.image,
  featureType: "infrastructure",
  createdAt: "",
  updatedAt: "",
  __v: 0,
}));
