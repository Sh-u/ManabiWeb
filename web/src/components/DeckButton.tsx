import { SettingsIcon, DeleteIcon } from '@chakra-ui/icons';
import {Text, Flex, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import React from 'react'
import { FaPen, FaShare } from 'react-icons/fa';

export const DeckButton = ({ deck, handleShowDeckBody, handleShowCurrentDeckInfo}) => {
  return (
    <Flex
    flexDir={"column"}
    alignItems="center"
    key={deck.createdAt + 500}
  >
    <Flex mt="5" align="center" justify={"center"}>
      <Button
        onClick={() => {
            handleShowDeckBody();
          handleShowCurrentDeckInfo(deck._id);
        }}
        cursor={"pointer"}
        textAlign={"center"}
        maxW="full"
        key={deck.createdAt + 100}
      >
        <Text>{deck.title}</Text>
      </Button>
      <Menu >
        <MenuButton cursor={'pointer'} ml='5' as={SettingsIcon}/>
         
        <MenuList>
          <MenuItem icon={<FaPen/>}>Rename</MenuItem>
          <MenuItem icon={<FaShare/>}>Share</MenuItem>
          <MenuItem icon={<DeleteIcon/>} >Delete</ MenuItem >
        </MenuList>
      </Menu>
    
    </Flex>
  </Flex>
  )
}
