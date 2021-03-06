import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { showDeckBodyState } from "../atoms/showDeckBodyState";
import DeckBody from "../components/DeckBody";
import Decks from "../components/Decks";
import Navbar from "../components/Navbar";
import { useMeQuery } from "../generated/graphql";

const Learn = () => {
  const showBodyState = useRecoilValue(showDeckBodyState);

  const router = useRouter();

  const { data, loading } = useMeQuery();


  useEffect(() => {
    if (!loading && !data?.me) {
      router.push("/");
    }
  }, [loading, data?.me]);

  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>
      <Navbar />
      {showBodyState ? <DeckBody /> : <Decks />}
    </Box>
  );
};

export default Learn;
