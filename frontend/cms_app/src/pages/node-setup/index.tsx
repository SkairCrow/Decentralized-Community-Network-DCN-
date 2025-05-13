// Importing React for building the component
import React from "react";

// Importing the `Authenticated` component from Refine to handle authentication
import { Authenticated } from "@refinedev/core";

// Importing the custom Node Setup Form component
import { NodeSetupForm } from "../../components/node-setup/node_setup_form";

// Main component for the Node Setup page
export default function NodeSetupPage() {
    return (
        // Wrapping the page in the `Authenticated` component to ensure only authenticated users can access it
        <Authenticated key="authenticated" v3LegacyAuthProviderCompatible={true}>
            {/* Centering the content and adding padding for better layout */}
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
                {/* Page title */}
                <h1>Node Setup</h1>
                {/* Rendering the Node Setup Form */}
                <NodeSetupForm />
            </div>
        </Authenticated>
    );
}
