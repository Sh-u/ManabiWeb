import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import Head from "next/head";
import { createUploadWidget } from "cloudinary-react";
import CloudinaryContext from "cloudinary-react";
import TransformImage from "./Image";
import Player from "./Player";
import { myInput } from "./Player";
import { FaPlay } from "react-icons/fa";

type myWindow = {
  cloudinary: any;
} & Window &
  typeof globalThis;

const Post = () => {
  const [imagePublicId, setImagePublicId] = useState("");
  const [alt, setAlt] = useState("");
  const [crop, setCrop] = useState("scale");
  const [height, setHeight] = useState(200);
  const [width, setWidth] = useState(500);

  const openWidget = () => {
    // create the widget
    const window2 = window as myWindow;
    const widget = window2.cloudinary.createUploadWidget(
      {
        cloudName: "dwsawrlky",
        uploadPreset: "xhi5wezq",
      },
      (error, result) => {
        if (
          result.event === "success" &&
          result.info.resource_type === "image"
        ) {
          console.log(result.info);
          setImagePublicId(result.info.public_id);
        }
      }
    );
    widget.open(); // open up the widget after creation
  };

  return (
    <>
      <Flex
        width={"auto"}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
        bg="gray.700"
        h={"2xl"}
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
                  <Button mt="5" onClick={() => openWidget()}>
                    Upload Image
                  </Button>
                  <Box mt="5">
                    {imagePublicId ? (
                      <TransformImage
                        crop={crop}
                        image={imagePublicId}
                        width={width}
                        height={height}
                      />
                    ) : (
                      <Box mt="5">Image will appear here</Box>
                    )}
                  </Box>

                  <Flex
                    cursor={"pointer"}
                    mt="5"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    
                      <Player url={"https://sounds.soundofgothic.pl/assets/gsounds/INFO_BAU_2_WICHTIGEPERSONEN_15_00.WAV"} />
                    
                    <Text ml={"5"}>Play sound</Text>
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
