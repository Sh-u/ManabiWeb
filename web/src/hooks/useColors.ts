import { useColorMode } from "@chakra-ui/react";

const useColors = (): { getColor: (light: string, dark: string) => string } => {
    const { colorMode } = useColorMode()

    const getColor = (light, dark): string => {
        if (colorMode === 'light'){
          return light
        }
        else {
          return dark;
        }
      }

      
    return { getColor }
  };

  export default useColors