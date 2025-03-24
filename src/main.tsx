import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router"
import "./index.css"
import { JazzProvider } from "jazz-react"
import { JazzAccount } from "./schema"


// Also provide a fallback for immediate execution in case DOMContentLoaded already fired
if (document.readyState === "complete" || document.readyState === "interactive") {
  const rootElement = document.getElementById("root") || document.createElement("div")

  if (!document.getElementById("root")) {
    rootElement.id = "root"
    document.body.appendChild(rootElement)
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <JazzProvider sync={{ peer: "wss://cloud.jazz.tools/?key=tabletop-manager" }} AccountSchema={JazzAccount}>
        <RouterProvider router={router} />
      </JazzProvider>
    </React.StrictMode>,
  )
}

// Register the Account schema so `useAccount` returns our custom `JazzAccount`
declare module "jazz-react" {
  interface Register {
    Account: JazzAccount
  }
}

