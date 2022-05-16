import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";
import _ from "lodash";
import React, { InputHTMLAttributes } from "react";
type MyInputProps = InputHTMLAttributes< HTMLInputElement> & {
  name: string;
  label: string;
  type?: string;
 
};

const InputField  = ({label, size: _, ...props} : MyInputProps) => {
  const [field, { error }] = useField(props);



  return (
    <FormControl mt={'15px'} isInvalid={!!error}>
      <FormLabel
        htmlFor={field.name}
        textAlign={"center"}
        placeholder={field.name}
      >
        {label}
      </FormLabel>
      <Input
        
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
        
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage>  : null}
      
    </FormControl>
  );
};

export default InputField;
