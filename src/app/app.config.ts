import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface FirebaseConfig {
	apiKey: string,
	authDomain: string,
	databaseURL: string,
	projectId: string,
	storageBucket: string,
	messagingSenderId: string,
	webApplicationId: string
}

export interface AppConfig {
    availableLanguages: Array<{ code: string, name: string }>;
    appName: string;
	apiBase: string;
	googleApiKey: string;
	stripeKey: string;
	oneSignalAppId: string;
	oneSignalGPSenderId: string;
	firebaseConfig: FirebaseConfig;
}

export const BaseAppConfig: AppConfig = {
    appName: "br.app.mymed.medico",
	apiBase: "https://mymed.app.br/",
	googleApiKey: "",
	stripeKey: "",
	oneSignalAppId: "88870638-57c2-4717-82a7-2e5c89034003",
	oneSignalGPSenderId: "306391894224",
    availableLanguages: [{
        code: 'en',
        name: 'English'
    }, {
        code: 'ar',
        name: 'Arabic'
    }, {
        code: 'es',
        name: 'Spanish'
    }, {
        code: 'fr',
        name: 'French'
    }, {
        code: 'id',
        name: 'Indonesian'
    }, {
        code: 'pt',
        name: 'Portuguese'
    }],
    firebaseConfig: {
		apiKey: "AIzaSyDIVNAjRhfx4ZB2_J4uFKDQqTkeJ_Hz_Bs",
		authDomain: "MyMedProfissional",
		databaseURL: "https://mymed-cdc2e.firebaseio.com",
		projectId: "mymed-cdc2e",
		storageBucket: "", //Não será necessário
		messagingSenderId: "",// Não é necessário
		webApplicationId: "1:306391894224:android:99a64e96e2ee874b25b6d5"
	}
};
