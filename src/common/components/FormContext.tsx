import { createContext, Reducer, useEffect, useReducer } from "react";
import type { Schema } from "yup";
import { getValidationErrors } from "~/common/utils";
import type { IFormContext, IFormInitialData } from "~/types";


export const FormContext = createContext(undefined as any);

const initialData = {
	errors: {},
	touched: {},
	forceDisplay: false,
};


const formReducer: Reducer<IFormInitialData, any> = (state, action) => {
	switch (action.type) {
		case "SET_VALUE":
			return {...state, values: {...state.values, ...action.payload}};
		case "SET_TOUCHED":
			return {...state, touched: {...state.touched, [action.payload]: true}};
		case "SET_ERROR":
			return {...state, errors: {...state.errors, ...action.payload}};
		case "SET_ERRORS":
			return {...state, ...action.payload};
		case "CLEAR_ERRORS":
			return {...state, errors: {}};
		case "RESET":
			return action.payload;
		default:
			return state;
	}
};

interface IProps {
	children: any;
	validationSchema: Schema<any>;
	errors?: Record<string, string>;
	initialValues?: Record<string, any>;
}

export const FormContextWrapper = ({children, errors = {}, validationSchema, initialValues = {}}: IProps) => {
	const [state, dispatch] = useReducer(formReducer, {...initialData, values: initialValues});

	const setValue = async (name: string, value: any) => {
		dispatch({type: "SET_VALUE", payload: {[name]: value}});
		try {
			await validationSchema.validate({...state.values, [name]: value}, {strict: true, abortEarly: false});
			if (Object.keys(state.errors).length) {
				dispatch({type: "CLEAR_ERRORS"});
			}
		} catch (e: any) {
			dispatch({type: "SET_ERRORS", payload: {errors: getValidationErrors(e)}});
		}
	};

	const setTouched = async (name: string) => {
		try {
			dispatch({type: "SET_TOUCHED", payload: name});
			await validationSchema.validateAt(name, state.values, {strict: true});
		} catch (e: any) {
			dispatch({type: "SET_ERROR", payload: {[name]: e.message}});
		}
	};

	const reset = () => {
		dispatch({type: "RESET", payload: {...initialData, values: initialValues}});
	};

	const getFieldMeta = (name: string) => ({
		value: state.values[name],
		error: state.errors[name],
		touched: state.touched[name],
		forceDisplay: state.forceDisplay,
		defaultValue: initialValues[name],
	});

	useEffect(() => {
		if (errors && Object.values(errors).length) {
			dispatch({type: "SET_ERRORS", payload: {errors, forceDisplay: true}});
		}
	}, [errors]);

	const isValid = Object.values(state.errors).length === 0;

	const context: IFormContext = {...state, isValid, setValue, setTouched, getFieldMeta, reset};
	return (
		<FormContext.Provider value={context}>
			{typeof children === "function"
				? children(context)
				: children
			}
		</FormContext.Provider>
	);
};
