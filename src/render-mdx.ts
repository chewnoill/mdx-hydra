import { transform } from "buble-jsx-only";
import mdx from "@mdx-js/mdx";
import { genReact } from "./utils";

interface Props {
  scope?: object;
  components?: object;
  remarkPlugins?: Array<any>;
  rehypePlugins?: Array<any>;
  source: string;
}

export const renderMdx = ({
  scope = {},
  components = {},
  remarkPlugins = [],
  rehypePlugins = [],
  source, // MDX Source
}: Props) => {
  // Compile MDX source into jsx components
  const jsx = mdx
    .sync(source, {
      remarkPlugins,
      rehypePlugins,
      skipExport: true,
    })
    .trim();

  // Run some additional babel transformations
  const code = transform(jsx, {
    objectAssign: "Object.assign",
  }).code;
  return { code, component: genReact({ code, components, scope }) };
};
