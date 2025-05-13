import React from "react";
import DetailCmp from "../ui/DetailCmp";

const Detail = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  return (
    <div>
      <DetailCmp id={id} />
    </div>
  );
};

export default Detail;
