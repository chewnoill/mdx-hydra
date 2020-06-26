import React from "react";
import { MDXProvider, mdx } from "@mdx-js/react";

export const genReact = ({
  code,
  scope,
  components,
}: {
  code: string;
  scope: object;
  components: object;
}) => {
  const fullScope = {
    mdx,
    MDXProvider,
    components,
    ...scope,
  };

  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);

  const fn = new Function(
    "React",
    ...keys,
    `${code}
return React.createElement(MDXProvider, { components },
    React.createElement(MDXContent, {})
)
`
  );

  return fn(React, ...values);
};


