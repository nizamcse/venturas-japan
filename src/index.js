import React from "react"
import { createRoot } from "react-dom/client"
import { StyledEngineProvider } from "@mui/material/styles"
import "./index.css"
import App from "./App"

function AppWithCallbackAfterRender() {
  return (
    <StyledEngineProvider injectFirst>
      <App tab="home" />
    </StyledEngineProvider>
  )
}

const container = document.getElementById("root")
const root = createRoot(container)
root.render(<AppWithCallbackAfterRender />)
