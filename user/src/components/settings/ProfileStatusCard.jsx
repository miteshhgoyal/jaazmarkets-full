import React from "react";

const ProfileStatusCard = ({ data }) => {
  return (
    <div className="p-4 rounded-lg border border-gray-300 bg-white flex flex-col gap-0 w-full">
      <p className="text-xs text-gray-500">{data.heading}</p>
      <p
        className={`text-2xl text-gray-900 font-bold ${
          data.value == "Verified" ? "text-green-600" : "text-yelow-600"
        }`}
      >
        {data.value}
      </p>
      <p className="text-xs text-gray-400">{data.subheading}</p>
    </div>
  );
};

export default ProfileStatusCard;
