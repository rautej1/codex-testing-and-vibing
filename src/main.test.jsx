import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App, generatePhrase, scrambleText } from "./main.jsx";

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("oracle helpers", () => {
  it("generates readable oracle phrases", () => {
    const phrase = generatePhrase();

    expect(phrase).toMatch(/[A-Za-z]/);
    expect(phrase.length).toBeGreaterThan(10);
  });

  it("reveals stable characters as scrambling progresses", () => {
    expect(scrambleText("oracle", 99)).toBe("oracle");
    expect(scrambleText("oracle", 0)).toHaveLength(6);
  });
});

describe("App", () => {
  it("increments the invocation count and records signal residue on click", async () => {
    const user = userEvent.setup();

    render(<App />);

    const button = screen.getByRole("button", { name: /collapse the wave/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("invocation-count").textContent).toBe("1");
    });

    expect(screen.queryByText(/No residue yet/i)).toBeNull();
    expect(screen.getByRole("list")).not.toBeNull();
  });

  it("keeps the latest phrase visible after the scramble animation settles", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /collapse the wave/i }));

    await waitFor(() => {
      const phrase = screen.getByTestId("oracle-phrase").textContent;
      expect(phrase).toMatch(/[A-Za-z]/);
      expect(phrase).not.toMatch(/[∆◊◌✦]/);
    }, { timeout: 2500 });
  });
});
