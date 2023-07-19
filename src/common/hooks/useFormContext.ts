import { useContext } from "react";
import { FormContext } from "~/common/components/FormContext";
import type { IFormContext } from "~/types";


export const useFormContext = () => useContext<IFormContext>(FormContext);
