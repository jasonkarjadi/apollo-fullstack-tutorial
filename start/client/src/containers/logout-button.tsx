import { useApolloClient } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";
import { ReactComponent as ExitIcon } from "../assets/icons/exit.svg";
import { isLoggedInVar } from "../cache";
import { menuItemClassName } from "../components/menu-item";

const LogoutButton: React.FC<any> = () => {
  const client = useApolloClient();
  return (
    <StyledButton
      data-testid="logout-button"
      onClick={() => {
        // Evict and garbage-collect the cached user object
        client.cache.evict({ fieldName: "me" });
        client.cache.gc();
        // Remove user details from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        // Set the logged-in status to false
        isLoggedInVar(false);
      }}
    >
      <ExitIcon />
      Logout
    </StyledButton>
  );
};

export default LogoutButton;

const StyledButton = styled("button")(menuItemClassName, {
  background: "none",
  border: "none",
  padding: 0,
});
