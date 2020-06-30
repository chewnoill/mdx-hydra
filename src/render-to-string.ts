import { transform } from "buble-jsx-only";
import mdx from "@mdx-js/mdx";
import ReactDOMServer from "react-dom/server";
import { renderMdx } from "./render-mdx";

interface Props {
  scope?: object;
  components?: object;
  remarkPlugins?: Array<any>;
  rehypePlugins?: Array<any>;
  Wrapper: any;
  source: string;
}

interface Result {
  code: string;
  staticMDX: string;
  scope: object;
}

export const renderToString = (props: Props): Result => {
  // We need to return the code used to generate the
  // static markup, we'll use this to hydrate the
  // component later.
  const { code, component } = renderMdx(props);
  return {
    code,
    staticMDX: ReactDOMServer.renderToString(component),
    scope: props.scope || {},
  };
};
