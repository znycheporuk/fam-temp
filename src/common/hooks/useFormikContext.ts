import { useContext } from 'react';
import { FormikContext } from '~/common/components/Formik';
import type { IFormikContext } from '~/types';


export const useFormikContext = () => useContext<IFormikContext>(FormikContext);
