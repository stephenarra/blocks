import { vi, expect, it, describe, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import MyPage from "@/pages/index";
import userEvent from "@testing-library/user-event";

vi.mock("next/router", () => require("next-router-mock"));

import { useSession, signIn, signOut } from "next-auth/react";
vi.mock("next-auth/react");
const mockUseSession = useSession as Mock;
(signIn as Mock).mockImplementation(() => vi.fn());
(signOut as Mock).mockImplementation(() => vi.fn());

describe("Landing Page", () => {
  it("renders login when logged out", async () => {
    const user = userEvent.setup();

    mockUseSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(<MyPage />);
    const signInButton = screen.queryByRole("button", {
      name: "Login",
    });

    expect(signInButton).toBeInTheDocument();

    await user.click(signInButton as HTMLElement);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith("google");
  });

  it("renders user dropdown when logged in", async () => {
    mockUseSession.mockReturnValue({
      status: "authenticated",
      data: { user: { id: "1", name: "Sam" } },
    });

    render(<MyPage />);

    expect(
      screen.queryByRole("button", { name: "Login" })
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("user-dropdown")).toBeInTheDocument();
  });
});
