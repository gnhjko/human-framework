const win = window as any;

export const languages = {
   // Data
   "common_app_name": "ダイノボット",

};

if (!win.languages) {
   win.languages = {

   };
}

win.languages.jp = languages;