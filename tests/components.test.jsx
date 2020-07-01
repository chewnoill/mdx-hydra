/** @jest-environment node */
import React from "react";
import styled from "@emotion/styled";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

const { renderMdx } = require("../build/render-mdx");
const { hydrate } = require("../build/hydrate");
const { renderToString } = require("../build/render-to-string");

const ExampleMDX = `
# This is a test

of the MDX system

<div>This is also a test</div>
`;

const components = {
  h1: styled.h3(`font-size:22px;color: tomato;`),
};

describe("base functionality", () => {
  it("renders MDX correctly", () => {
    const tree = Enzyme.render(
      renderMdx({ source: ExampleMDX, components }).component
    );
    expect(tree).toMatchSnapshot();
  });

  const renderedString = renderToString({ source: ExampleMDX, components });
  it("creates static markup correctly", () => {
    expect(renderedString.staticMDX).toMatchSnapshot();
  });
  const Hydrate = hydrate;
  it("hydrates components correctly", () => {
    const tree = Enzyme.render(
      <Hydrate {...renderedString} components={components} />
    );
    expect(tree).toMatchSnapshot();
  });
});
