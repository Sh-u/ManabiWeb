import { useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

function ForceDarkMode(props: { children: JSX.Element }) {
    const { colorMode, toggleColorMode } = useColorMode();
  
    useEffect(() => {

      if (colorMode === "light") {
        toggleColorMode();
      }
      
    }, []);
    
    return props.children;
  }

  export default ForceDarkMode