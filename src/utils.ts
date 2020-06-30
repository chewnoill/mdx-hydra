import React from "react";
import { MDXProvider, mdx } from "@mdx-js/react";

export const defaultWrapper = React.Fragment;

export const genReact = ({
  code,
  scope,
  components,
  Wrapper = defaultWrapper,
}: {
  code: string;
  scope: object;
  components: object;
  Wrapper?: any;
}) => {
  const fullScope = {
    mdx,
    MDXProvider,
    Wrapper,
    components,
    ...scope,
  };

  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);

  const fn = new Function(
    "React",
    ...keys,
    `${code}
return React.createElement(Wrapper, {},
  React.createElement(MDXProvider, { components },
    React.createElement(MDXContent, {})
))
`
  );

  return fn(React, ...values);
};


