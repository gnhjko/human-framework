const win = window as any;

export const languages = {
  // Data
  "common_app_name": "다이노봇",
};

if (!win.languages) {
  win.languages = {

  };
}

win.languages.ko = languages;