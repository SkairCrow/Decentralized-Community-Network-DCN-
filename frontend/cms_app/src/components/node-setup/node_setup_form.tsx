// Importing necessary hooks and components
import { useForm } from "@refinedev/react-hook-form"; // Hook for form handling
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material"; // Material-UI components
import { Controller } from "react-hook-form"; // React Hook Form's controller for controlled components
import { useState } from "react"; // React state management
import { supabaseClient } from "../../utility/supabaseClient"; // Supabase client for database interactions
import { ImageHandler } from "../common/image_handler"; // Import the ImageHandler component

// Main component for the Node Setup Form
export const NodeSetupForm = () => {
  // Initializing the form with default values and extracting necessary methods
  const {
    handleSubmit, // Handles form submission
    control, // Controls form fields
    setValue, // Sets the value of a specific field
    watch, // Watches the value of a specific field
    formState: { isSubmitting }, // Tracks the form's submission state
  } = useForm({
    defaultValues: {
      name: "", // Default value for the "name" field
      address: "", // Default value for the "address" field
      profile_image_url: "", // Default value for the "profile_image_url" field
      node_type: "", // Default value for the "node_type" field
      established_on: "", // Default value for the "established_on" field
    },
  });

  // Watching the value of the "profile_image_url" field
  const profileImageUrl = watch("profile_image_url");

  // Function to handle form submission
  const onSubmit = async (data: any) => {
    console.log("Submitted node data:", data);

    const { error } = await supabaseClient
      .from("nodes") // Specify the table name here
      .insert([data]); // Insert the form data as a new row

    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      console.log("Insert successful!");
    }
  };

  return (
    // Form container with styling
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)} // Attach the form submission handler
      sx={{ maxWidth: 600, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }} // Styling for layout
    >
      {/* Field for the "name" input */}
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }} // Validation rule
        render={({ field }) => (
          <TextField label="Name" {...field} fullWidth required />
        )}
      />

      {/* Field for the "address" input */}
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField label="Address" {...field} fullWidth />
        )}
      />

      {/* ImageHandler for profile image upload */}
      <ImageHandler
        bucket="nodes"
        initialUrl={profileImageUrl}
        onUpload={(url) => {
          setValue("profile_image_url", url); // Update the form state with the uploaded image URL
          console.log("Image uploaded to:", url);
        }}
      />

      {/* Dropdown for selecting the node type */}
      <Controller
        name="node_type"
        control={control}
        render={({ field }) => (
          <TextField select label="Node Type" {...field} fullWidth>
            <MenuItem value="">Select a type</MenuItem>
            <MenuItem value="community">Community</MenuItem>
            <MenuItem value="farm">Farm</MenuItem>
            <MenuItem value="maker">Maker Space</MenuItem>
          </TextField>
        )}
      />

      {/* Date picker for the "established_on" field */}
      <Controller
        name="established_on"
        control={control}
        render={({ field }) => (
          <TextField
            label="Established On"
            type="date"
            {...field}
            InputLabelProps={{ shrink: true }} // Ensures the label doesn't overlap the date picker
            fullWidth
          />
        )}
      />

      {/* Submit button */}
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        Save Node
      </Button>
    </Box>
  );
};
