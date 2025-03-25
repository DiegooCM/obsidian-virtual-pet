export interface UserStats {
	actualFileWordCount: number;
	filesCount: number;
}

// Esto no lo voy a usar, es simplemente una guía de las variables q quiero guardar
// Tendré dos constantes una con las stats actuales y otra con las iniciales
export interface FinalUserStats {
	// Esto lo podría hacer simplemente viendo si se borran o añaden archivos, aunque creo q esta forma es más correcta
	initialFilesCount: number;
	actualFilesCount: number;

	initialWordCount: number;
	actualWordCount: number;

	lastFileUpdate: Date;

	exp: number;
	level: number;
}

export interface UserInfo {
	exp: number;
}
