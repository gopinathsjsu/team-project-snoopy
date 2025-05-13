import React from "react";
import CreateCmp from "@/app/restaurant/ui/CreateCmp";

const Update = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  return (
    <div>
      <CreateCmp id={id} />
    </div>
  );
};

export default Update;
