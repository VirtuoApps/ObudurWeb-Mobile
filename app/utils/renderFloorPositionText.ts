export const renderFloorPositionText = (
  floorPosition: {
    tr: string;
    en: string;
  },
  language: string
) => {
  if (language === "en" && floorPosition.en === "Level 1 Basement") {
    return "B1";
  }

  if (language === "en" && floorPosition.en === "Level 2 Basement") {
    return "B2";
  }

  if (language === "en" && floorPosition.en === "Level 3 Basement") {
    return "B3";
  }

  if (language === "en" && floorPosition.en === "Level 4 Basement") {
    return "B4";
  }

  if (floorPosition.tr === "Zemin Kat") {
    if (language === "tr") {
      return "Zemin K.";
    }

    if (language === "en") {
      return "GF";
    }
  }

  if (floorPosition.tr === "Bahçe Katı") {
    if (language === "tr") {
      return "Bahçe K.";
    }

    if (language === "en") {
      return "GF";
    }
  }

  if (floorPosition.tr === "Bodrum Katı") {
    if (language === "tr") {
      return "Bodrum K.";
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
      return "Y. Giriş";
    }

    if (language === "en") {
      return "EGF";
    }
  }

  if (floorPosition.tr === "Villa Tipi") {
    if (language === "tr") {
      return "Villa T.";
    }

    if (language === "en") {
      return "Villa";
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
