import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConsentCheckbox } from "./ConsentCheckbox";

describe("ConsentCheckbox", () => {
	it("renders with checkbox input that is unchecked by default", () => {
		render(<ConsentCheckbox checked={false} onChange={() => {}} />);
		expect(screen.getByRole("checkbox")).not.toBeChecked();
	});

	it("renders consent label text containing agreement message", () => {
		render(<ConsentCheckbox checked={false} onChange={() => {}} />);
		expect(
			screen.getByText(/I agree to receive my report/i),
		).toBeInTheDocument();
	});

	it("renders a link to /privacy within the label text", () => {
		render(<ConsentCheckbox checked={false} onChange={() => {}} />);
		const link = screen.getByRole("link", { name: /privacy policy/i });
		expect(link).toHaveAttribute("href", "/privacy");
	});

	it("calls onChange callback when checkbox is toggled", () => {
		const mockFn = vi.fn();
		render(<ConsentCheckbox checked={false} onChange={mockFn} />);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(mockFn).toHaveBeenCalled();
	});

	it("displays error message when error prop is provided", () => {
		render(
			<ConsentCheckbox
				checked={false}
				onChange={() => {}}
				error="You must agree to continue"
			/>,
		);
		expect(
			screen.getByText("You must agree to continue"),
		).toBeInTheDocument();
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("checkbox has id='consent' and name='consent' for form integration", () => {
		render(<ConsentCheckbox checked={false} onChange={() => {}} />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toHaveAttribute("id", "consent");
		expect(checkbox).toHaveAttribute("name", "consent");
	});
});
