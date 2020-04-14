import React from "react";
import ProfilePic from "./profilepic";
import { render } from "@testing-library/react";

test("renders img with src set to url prop", () => {
    const { container } = render(< ProfilePic url="/dog.png" />);

    expect(
        container.querySelector("img").getAttribute("src")
    ).toBe("/dog.png");
});