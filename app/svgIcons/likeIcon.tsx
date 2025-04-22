import React from "react";

type LikeIconProps = {
  fill?: string;
  fillOpacity?: string;
};

export default function LikeIcon({
  fill = "#362C75",
  fillOpacity = "0.2",
}: LikeIconProps) {
  return (
    <svg
      width="37"
      height="36"
      viewBox="0 0 37 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.70009 10.6928C9.73992 9.65329 11.15 9.06932 12.6204 9.06932C14.0907 9.06932 15.5008 9.65329 16.5407 10.6928L18.1653 12.3161L19.79 10.6928C20.3015 10.1632 20.9134 9.74078 21.5899 9.45018C22.2664 9.15957 22.994 9.00661 23.7302 9.00021C24.4665 8.99381 25.1966 9.13411 25.8781 9.41291C26.5596 9.69172 27.1787 10.1034 27.6993 10.6241C28.2199 11.1447 28.6317 11.7638 28.9105 12.4453C29.1893 13.1267 29.3296 13.8569 29.3232 14.5931C29.3168 15.3294 29.1638 16.057 28.8732 16.7335C28.5826 17.41 28.1602 18.0219 27.6306 18.5334L18.1653 28L8.70009 18.5334C7.66057 17.4935 7.0766 16.0834 7.0766 14.6131C7.0766 13.1428 7.66057 11.7326 8.70009 10.6928Z"
        fill={fill}
        fillOpacity={fillOpacity}
        stroke="#FCFCFC"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
