// Importing core Refine components for building the app
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// Importing Material-UI components and Refine's Material-UI integrations
import {
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline"; // Resets CSS for consistent styling
import GlobalStyles from "@mui/material/GlobalStyles"; // Adds global CSS styles

// Importing router bindings and utilities from Refine and React Router
import routerBindings, {
  DocumentTitleHandler, // Handles dynamic document titles
  UnsavedChangesNotifier, // Warns users about unsaved changes
} from "@refinedev/react-router";

// Importing data and live providers for Supabase integration
import { dataProvider, liveProvider } from "@refinedev/supabase";

// Importing React Router components for routing
import { BrowserRouter, Route, Routes, Navigate } from "react-router";

// Importing custom authentication provider
import authProvider from "./authProvider";

// Importing custom context for managing color mode (e.g., light/dark mode)
import { ColorModeContextProvider } from "./contexts/color-mode";

// Importing Supabase client for database interactions
import { supabaseClient } from "./utility";

// Importing a custom component for the "Node Setup" form
import { NodeSetupForm } from "./components/node-setup/node_setup_form";

// Main App component
function App() {
  return (
    // Wrapping the app in a BrowserRouter for routing
    <BrowserRouter>
      {/* Provides keyboard shortcuts (Kbar) functionality */}
      <RefineKbarProvider>
        {/* Provides context for managing color mode */}
        <ColorModeContextProvider>
          {/* Resets CSS and applies global styles */}
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />

          {/* Provides notifications/snackbars for user feedback */}
          <RefineSnackbarProvider>
            {/* Main Refine component that integrates all providers and configurations */}
            <Refine
              dataProvider={dataProvider(supabaseClient)} // Configures data provider for Supabase
              liveProvider={liveProvider(supabaseClient)} // Configures live provider for real-time updates
              authProvider={authProvider} // Configures authentication provider
              routerProvider={routerBindings} // Configures router bindings
              notificationProvider={useNotificationProvider} // Configures notification provider
              options={{
                syncWithLocation: true, // Syncs state with the browser's location
                warnWhenUnsavedChanges: true, // Warns users about unsaved changes
                useNewQueryKeys: true, // Enables new query key behavior
                projectId: "ImPN75-BMshzR-a87krm", // Project ID for Refine
              }}
            >
              {/* Defines application routes */}
              <Routes>
                {/* Redirect the root path to the "Node Setup" form */}
                <Route path="/" element={<Navigate to="node-setup" replace />} />
                {/* Route for the "Node Setup" form */}
                <Route path="node-setup" element={<NodeSetupForm />} />
              </Routes>

              {/* Adds keyboard shortcuts (Kbar) UI */}
              <RefineKbar />

              {/* Warns users about unsaved changes */}
              <UnsavedChangesNotifier />

              {/* Dynamically updates the document title */}
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

// Exports the App component as the default export
export default App;
