import { Search2Icon } from "@chakra-ui/icons";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  InputRightElement,
  Kbd,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import SearchBarInput from "./SearchBarInput";

const SearchBarButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={
            <Search2Icon color={useColorModeValue("gray.600", "gray.200")} />
          }
        />
        <Input
        tabIndex={-1}
        readOnly
          onClick={onOpen}
          cursor={"pointer"}
          type={"search"}
          placeholder="Search... "
        textDecor={'none'}
          rounded="lg"
          backgroundColor={useColorModeValue("gray.100", "gray.700")}
          color={useColorModeValue("gray.400", "gray.200")}
          variant="filled"
          boxShadow={useColorModeValue("sm", "none")}
          focusBorderColor="pink.400"
          _placeholder={{
            opacity: 0.7,
            color: useColorModeValue("gray.900", "gray.200"),
          }}
          _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
          _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
        />
        <InputRightElement mr="3" children={<Kbd>Ctrl+K</Kbd>} />
      </InputGroup>

      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent top={15}>
          <SearchBarInput/>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchBarButton;
