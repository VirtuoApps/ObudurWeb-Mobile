import React from "react";

const DirectionMapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.69088 4.7219L15.358 17.0885M2.69088 4.7219C3.16217 4.18384 3.8661 3.84227 4.65256 3.84227H8.93473M2.69088 4.7219C2.31182 5.15464 2.08325 5.71448 2.08325 6.32593V15.4327C2.08325 16.8044 3.23357 17.9163 4.65256 17.9163H14.0733C15.4923 17.9163 16.6426 16.8044 16.6426 15.4327V11.7072M8.93473 11.7072L3.3679 17.0885M15.0047 4.89782V4.84491M17.9166 4.83663C17.9166 6.67238 15.0047 9.12004 15.0047 9.12004C15.0047 9.12004 12.0928 6.67238 12.0928 4.83663C12.0928 3.31585 13.3965 2.08301 15.0047 2.08301C16.6129 2.08301 17.9166 3.31585 17.9166 4.83663Z"
      stroke={props.stroke || "#FCFCFC"}
      strokeWidth={1.2}
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

export default DirectionMapIcon; 