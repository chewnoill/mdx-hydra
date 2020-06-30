import React from "react";
import { genReact, defaultWrapper } from "./utils";

interface Props {
  code: string;
  staticMDX: string;
  scope: object;
  components: object;
  Wrapper: any;
}

declare global {
  interface Window {
    requestIdleCallback: any;
  }
}

export const hydrate = ({
  code,
  staticMDX,
  Wrapper = defaultWrapper,
  components = {},
  scope = {},
}: Props) => {
  const hydrated = React.useRef(false);
  const [result, setResult] = React.useState<React.ReactElement>(
    React.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: staticMDX,
      },
    })
  );
  typeof window !== "undefined" &&
    !hydrated.current &&
    "requestIdleCallback" in window &&
    window.requestIdleCallback(() => {
      const hydratedFn = genReact({ code, components, scope, Wrapper });

      hydrated.current = true;
      // in order to match the tree shape when we inserted the static version
      // we wrap the hydrated version in a extra div :frownyface:
      setResult(<div>{hydratedFn}</div>);
    });

  return React.useMemo(() => result, [code, result]);
};
