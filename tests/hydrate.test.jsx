/** @jest-environment jsdom */
import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import styled from "@emotion/styled";
import { act } from "react-dom/test-utils";
import { requestIdleCallback } from "@shopify/jest-dom-mocks";
import { ThemeProvider } from "emotion-theming";
Enzyme.configure({ adapter: new Adapter() });

const { renderMdx } = require("../build/render-mdx");
const { hydrate } = require("../build/hydrate");
const { renderToString } = require("../build/render-to-string");

const Wrapper = (props) => (
  <ThemeProvider theme={{ colors: { primary: "yellow" } }} {...props} />
);

beforeEach(() => {
  requestIdleCallback.mock();
});

afterEach(() => {
  requestIdleCallback.restore();
});

const components = {
  h1: styled.h3(
    ({ theme }) => `
font-size:22px;
color: ${theme.colors.primary};
`
  ),
  T: () => {
    const [c, setC] = React.useState(0);
    return <button onClick={() => setC(c + 1)}>Counter: {c}</button>;
  },
};

describe("hydration functionality", () => {
  it("hydrates components correctly", () => {
    const ExampleMDX = `
# This is a test

of the MDX system

<T />

<div>This is also a test</div>
`;

    const renderedString = renderToString({
      source: ExampleMDX,
      components,
      Wrapper,
    });
    const Hydrate = hydrate;
    const tree = Enzyme.mount(
      <Hydrate {...renderedString} components={components} Wrapper={Wrapper} />
    );
    expect(tree.find("button").length).toEqual(0);
    expect(tree.render()).toMatchSnapshot();
    act(() => {
      requestIdleCallback.runIdleCallbacks();
      tree.setProps({});
    });
    expect(tree.render()).toMatchSnapshot();
    const button = tree.find("button");
    expect(button.length).toEqual(1);
    button.simulate("click");
    expect(tree.render()).toMatchSnapshot();
    const ExampleUpdatedMDX = `
# This is a updated Test!!!
<T />
`;

    const updatedString = renderToString({
      source: ExampleUpdatedMDX,
      components,
      Wrapper,
    });
    tree.setProps({ ...updatedString, components, Wrapper });
    expect(tree.render()).toMatchSnapshot();
    act(() => {
      requestIdleCallback.runIdleCallbacks();
      tree.setProps({});
    });
    expect(tree.render()).toMatchSnapshot();
    const updatedbutton = tree.find("button");
    expect(updatedbutton.length).toEqual(1);
    updatedbutton.simulate("click");
    expect(tree.render()).toMatchSnapshot();
  });
});
