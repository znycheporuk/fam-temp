import { useReducer } from 'react';
import type { ISettings, TSettingsAction, TTheme } from '~/types';


export const settings = {
	setTheme: (theme: TTheme) => ({
		type: 'theme',
		payload: {theme},
	} as const),
};


const defaultValues: ISettings = {
	theme: '',
};

const settingsReducer = (state: ISettings, action: TSettingsAction) => {
	switch (action.type) {
		case 'theme':
			return {...state, ...action.payload};
		default: {
			throw new Error(`Unhandled action: ${action}`);
		}
	}
};

export const useSettingsReducer = (values: Partial<ISettings>) => useReducer(settingsReducer, {...defaultValues, ...values});



