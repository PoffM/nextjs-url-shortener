import { trpc } from "~/utils/trpc";
import { NextPageWithLayout } from "./_app";

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();

  return <></>;
};

export default IndexPage;
