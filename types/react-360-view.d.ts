declare module "react-360-view" {
  interface ThreeSixtyProps {
    amount: number;
    imagePath: string;
    fileName: string;
    spinReverse?: boolean;
    autoplay?: number;
    loop?: number;
    boxShadow?: boolean;
    buttonClass?: string;
    paddingIndex?: boolean;
    width?: number;
    height?: number;
  }

  export default function ThreeSixty(props: ThreeSixtyProps): JSX.Element;
}
