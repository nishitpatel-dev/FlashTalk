import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({
  title = "FlashTalk",
  description = "A Web-Based Real-Time Chat Platform",
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="Description" content={description} />
      </Helmet>
    </>
  );
};

export default Title;
