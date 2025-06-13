const win = window as any;

export const languages = {
    // Data

    "common_app_name": "DINOBOT",


};

if (!win.languages) {
    win.languages = {

    };
}

win.languages.en = languages;