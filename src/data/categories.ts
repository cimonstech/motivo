export const CATEGORY_LABELS: Record<string, string> = {
  "branding":      "Branding",
  "digital":       "Digital",
  "ads-campaigns": "Ads & Campaigns",
  "fabrications":  "Fabrications",
};

export const CATEGORY_COLORS: Record<string, string> = {
  "branding":      "#080808",
  "digital":       "#080808",
  "ads-campaigns": "#080808",
  "fabrications":  "#080808",
};

// For filter tabs on /work page
export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
  key,
  label,
}));
