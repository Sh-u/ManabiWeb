import { SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import useColors from "../hooks/useColors";
import SearchBarInput from "./SearchBarInput";

const SearchBarButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getColor } = useColors();
  const finalRef = useRef(null);
  return (
    <>
      <InputGroup boxShadow={getColor("md", "none")} rounded="lg">
        <InputLeftElement
          pointerEvents="none"
          children={
            <SearchIcon
              color={getColor("gray.600", "gray.400")}
              height="full"
            />
          }
        />
        <Input
          tabIndex={-1}
          readOnly
          onClick={onOpen}
          cursor={"pointer"}
          type={"search"}
          placeholder="Search... "
          textDecor={"none"}
          rounded="lg"
          backgroundColor={getColor("white", "gray.700")}
          color={getColor("gray.400", "gray.200")}
          variant="filled"
          focusBorderColor="pink.400"
          _placeholder={{
            color: getColor("gray.900", "gray.400"),
          }}
          _focus={{ bg: getColor("gray.200", "gray.600") }}
          _hover={{ bg: getColor("gray.200", "gray.600") }}
        />
        <InputRightElement mr="5" children={<Kbd>Ctrl+K</Kbd>} />
      </InputGroup>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
        scrollBehavior={"outside"}
      >
        <ModalOverlay />
        <ModalContent top={15}>
          <SearchBarInput />
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchBarButton;
