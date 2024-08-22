import { keyframes, Skeleton, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { grayColor, matblack } from "../../constants/color";

export const VisuallyHiddenInput = styled("input")({
  height: 1,
  width: 1,
});

export const LinkComponent = styled(Link)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const InputBox = styled("input")({
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  padding: "1.4rem 3rem",
  borderRadius: "1.5rem",
  backgroundColor: `${grayColor}`,
});

export const SearchField = styled("input")({
  padding: "1rem 2rem",
  width: "20vmax",
  border: "none",
  outline: "none",
  borderRadius: "1.5rem",
  backgroundColor: "#f1f1f1",
  fontSize: "1.1rem",
});

export const CurveButton = styled("button")({
  borderRadius: "1.5rem",
  padding: "1rem 2rem",
  border: "none",
  outline: "none",
  cursor: "pointer",
  backgroundColor: matblack,
  color: "white",
  fontSize: "1.1rem",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.8)",
  },
});

const bounceAnimation = keyframes`
  0% {transform: scale(1); }
  50% {transform: scale(1.5);}
  100% {transform: scale(1);}
`

export const BouncingSkeleton = styled(Skeleton)(({
  animation: `${bounceAnimation} 1s infinite`,
}))
