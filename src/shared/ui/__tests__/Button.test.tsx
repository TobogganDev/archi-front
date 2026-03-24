import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
	it("renders children correctly", () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole("button", { name: "Click me" }),
		).toBeInTheDocument();
	});

	it("is disabled when isLoading is true", () => {
		render(<Button isLoading>Submit</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("calls onClick handler when clicked", async () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click</Button>);
		await userEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledOnce();
	});

	it("does not call onClick when disabled", async () => {
		const handleClick = vi.fn();
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>,
		);
		await userEvent.click(screen.getByRole("button"));
		expect(handleClick).not.toHaveBeenCalled();
	});
});
