import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        body,
        html {
          background-color: #d0bfff;
        }

        #__next,
        body,
        html {
          min-height: 100vh;
          margin: 0;
          padding: 0;
          display: "flex",
          flexDirection: "row",
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
