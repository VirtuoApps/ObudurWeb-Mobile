export const renderFloorPositionText = (
  floorPosition: {
    tr: string;
    en: string;
  },
  language: string
) => {
  if (floorPosition.tr === "Zemin Kat") {
    if (language === "tr") {
      return "Z";
    }

    if (language === "en") {
      return "G";
    }
  }

  if (floorPosition.tr === "Bahçe Katı") {
    if (language === "tr") {
      return "B";
    }

    if (language === "en") {
      return "B";
    }
  }

  if (floorPosition.tr === "Bodrum Katı") {
    if (language === "tr") {
      return "B";
    }

    if (language === "en") {
      return "B";
    }
  }

  if (floorPosition.tr === "Giriş") {
    if (language === "tr") {
      return "G";
    }

    if (language === "en") {
      return "G";
    }
  }

  if (floorPosition.tr === "Yüksek Giriş") {
    if (language === "tr") {
      return "YG";
    }

    if (language === "en") {
      return "YG";
    }
  }

  if (floorPosition.tr === "Villa Tipi") {
    if (language === "tr") {
      return "VT";
    }

    if (language === "en") {
      return "VT";
    }
  }

  if (language === "tr") {
    return `${floorPosition.tr}. Kat`;
  }

  if (language === "en") {
    return `${floorPosition.en}. Floor`;
  }

  return `${floorPosition.tr}. Kat`;
};
