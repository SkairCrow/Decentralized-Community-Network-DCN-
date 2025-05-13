// Importing necessary hooks and components
import { useForm } from "@refinedev/react-hook-form"; // Hook for form handling
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material"; // Material-UI components
import { Controller } from "react-hook-form"; // React Hook Form's controller for controlled components
import { useState } from "react"; // React state management
import { supabaseClient } from "../../utility/supabaseClient"; // Supabase client for database interactions

// Main component for the Node Setup Form
export const NodeSetupForm = () => {
  // State to manage the uploading status of the profile image
  const [uploading, setUploading] = useState(false);

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

  // Function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (!file) return;

    setUploading(true); // Set uploading state to true
    const filePath = `profile_image/${file.name}`; // Define the file path in the storage bucket

    // Upload the file to Supabase storage
    const { error } = await supabaseClient.storage
      .from("nodes") // Your bucket name
      .upload(filePath, file, {
        cacheControl: "3600", // Cache control settings
        upsert: true, // Overwrite if the file already exists
      });

    if (error) {
      console.error("Upload failed:", error.message); // Log the error if upload fails
    } else {
      setValue("profile_image_url", filePath); // Set the uploaded file path in the form
    }
    setUploading(false); // Set uploading state to false
  };

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
      
      {/* File upload button for the profile image */}
      <Box>
        <Button variant="outlined" component="label" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Profile Image"} {/* Button text changes based on upload state */}
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} /> {/* Hidden file input */}
        </Button>
        {/* Display the uploaded file path if available */}
        {profileImageUrl && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Stored at: <code>{profileImageUrl}</code>
          </Typography>
        )}
      </Box>

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
