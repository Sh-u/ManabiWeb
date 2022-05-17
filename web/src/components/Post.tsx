import { Box, Button, Flex, Image, Text, Textarea } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import Dropzone from "./Dropzone";
import Player from "./Player";
import { CloseIcon } from "@chakra-ui/icons";

const Post = () => {
  const [image, setImage] = useState({ url: null, image: null });
  const [audio, setAudio] = useState({url: null})

  const handleImageState = (image, url) => {
    setImage({ url, image });

  };

  const handleAudioState = ( url) => {
    setAudio({ url });
  };

  const renderExitIcon = () => {
    return <CloseIcon w={50} h={50} />;
  };
  const uploadToServer = async (event) => {
    const body = new FormData();
    console.log(`body: `, body);

    body.append("file", image);
    console.log(`body2: `, body);

    const response = await fetch("../pages/api/uploads", {
      method: "POST",
      body,
    });
  };

  return (
    <>
      <Flex
        width={"auto"}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
        bg="gray.700"
        h={"3xl"}
        ml="300px"
        mr="300px"
        mt="5"
        rounded={"lg"}
        wrap="wrap"
      >
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {}}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Box width={"full"} p="5">
              <Form>
                <Textarea placeholder="Sentence" resize={"vertical"} />
                <Textarea placeholder="Word" resize={"vertical"} mt="5" />
                <Flex
                  alignItems={"center"}
                  justifyContent={"center "}
                  flexDirection={"column"}
                >
                  <Box mt="5">
                    <Box>
                      <Dropzone imageState={handleImageState}/>
                    </Box>
                    {image?.url ? (
                      <Flex mt='5'>
                        <Image
                          src={image.url}
                          onMouseEnter={() => renderExitIcon()}
                          _hover={{
                            opacity: "0.5",
                          }}
                        />
                        <CloseIcon
                          margin={"auto"}
                          h={"10"}
                          w={"10"}
                          position="absolute"
                          transform={"auto"}
                          p="2"
                          cursor={"pointer"}
                          onClick={() => setImage(null)}
                        />
                      </Flex>
                    ) : (
                      <></>
                    )}
                  </Box>

                  <Flex
                    cursor={"pointer"}
                    mt="5"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Player
                      url={
                        "https://sounds.soundofgothic.pl/assets/gsounds/INFO_BAU_2_WICHTIGEPERSONEN_15_00.WAV"
                      }
                    />
                    <Text ml="5"> Dictionary audio</Text>
                  </Flex>
                  <Flex
                    cursor={"pointer"}
                    mt="5"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Text ml="5"> Your audio</Text>
                  </Flex>

                  <Flex
                    cursor={"pointer"}
                    mt="155"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Button variant={"solid"}>Cancel</Button>
                    <Button ml="5" variant={"solid"}>
                      Save
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </Box>
          )}
        </Formik>
      </Flex>
    </>
  );
};

export default Post;
