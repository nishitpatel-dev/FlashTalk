import { styled } from "@mui/material";
import { Link } from "react-router-dom";

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