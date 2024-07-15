import { styled } from "@mui/material";
import { Link } from "react-router-dom";
import { grayColor } from "../../constants/color";

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
