// Importing necessary hooks and components
import { useForm } from "@refinedev/react-hook-form";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  OutlinedInput,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabaseClient } from "../../utility/supabaseClient";
import { ImageHandler } from "../common/data-capture/image_capture";
import AddressCapture from "../common/data-capture/address_capture";

// Capabilities list
const CAPABILITY_OPTIONS = [
  "housing", "education", "food", "logistics", "technology", "childcare", "emergency shelter"
];

export const NodeSetupForm = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [nodeTypes, setNodeTypes] = useState<{ id: number; node_type: string }[]>([]);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [loadingCapabilities, setLoadingCapabilities] = useState<boolean>(true);
  const [loadingNodeTypes, setLoadingNodeTypes] = useState<boolean>(true);

  type Address = {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  const [address, setAddress] = useState<Address | null>(null); // State to hold the captured address

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleThemeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      profile_image_url: "",
      node_type: "",
      established_on: "",
      description: "",
      public_access: false,
      admin_contact: "",
      matrix_server_url: "",
      nostr_relay_url: "",
      ipfs_gateway_url: "",
      sync_enabled: true,
      capabilities: [],
      is_mirror: false,
    },
  });

  const profileImageUrl = watch("profile_image_url");

  // Fetch node types from the database
  useEffect(() => {
    const fetchNodeTypes = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("node-types")
          .select("id, node_type");

        if (error) {
          throw error;
        }

        setNodeTypes(data || []);
      } catch (err) {
        console.error("Failed to fetch node types:", err);
      } finally {
        setLoadingNodeTypes(false);
      }
    };

    fetchNodeTypes();
  }, []);

  // Fetch capabilities from the database
  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("node-capabilities")
          .select("capability");

        if (error) {
          throw error;
        }

        setCapabilities(data?.map((item) => item.capability) || []);
      } catch (err) {
        console.error("Failed to fetch capabilities:", err);
      } finally {
        setLoadingCapabilities(false);
      }
    };

    fetchCapabilities();
  }, []);

  const onSubmit = async (data: any) => {
    console.log("Submitted node data:", data);

    // Insert the address into the addresses table
    const { data: addressData, error: addressError } = await supabaseClient
      .from("addresses")
      .insert([address])
      .select("id")
      .single();

    if (addressError) {
      console.error("Address insert failed:", addressError.message);
      return;
    }

    // Use the address ID in the node data
    const nodeData = { ...data, address_id: addressData.id };

    // Insert the node into the nodes table
    const { error: nodeError } = await supabaseClient.from("nodes").insert([nodeData]);
    if (nodeError) {
      console.error("Node insert failed:", nodeError.message);
    } else {
      console.log("Node insert successful!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>Node Setup</Typography>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={handleThemeToggle} />}
          label="Dark Mode"
        />
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 600,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 2,
        }}
      >
        <Typography variant="h5">Basic Node Details</Typography>

        <Typography variant="subtitle1">Node Name</Typography>
        <Typography variant="body2" color="textSecondary">
          Enter the name of the node. This is a required field.
        </Typography>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField label="Node Name" {...field} fullWidth required />
          )}
        />

        <Typography variant="subtitle1">Physical Address</Typography>
        <Typography variant="body2" color="textSecondary">
          Provide the physical address of the node.
        </Typography>
        <AddressCapture
          onChange={(capturedAddress) => {
            const completeAddress = {
              ...capturedAddress,
              zip: capturedAddress.postalCode || "", // Map 'postalCode' to 'zip'
            };
            setAddress(completeAddress); // Update the address state
            console.log("Captured address:", completeAddress);
          }}
        />

        <Typography variant="subtitle1">Profile Image</Typography>
        <Typography variant="body2" color="textSecondary">
          Upload an image to represent the node.
        </Typography>
        <ImageHandler
          bucket="nodes"
          initialUrl={profileImageUrl}
          onUpload={(url) => {
            setValue("profile_image_url", url);
            console.log("Image uploaded to:", url);
          }}
        />

        <Typography variant="subtitle1">Node Type</Typography>
        <Typography variant="body2" color="textSecondary">
          Select the type of node from the dropdown.
        </Typography>
        {loadingNodeTypes ? (
          <CircularProgress />
        ) : (
          <Controller
            name="node_type"
            control={control}
            rules={{ required: "Node type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                displayEmpty
                input={<OutlinedInput />}
              >
                <MenuItem value="" disabled>
                  Select a node type
                </MenuItem>
                {nodeTypes.map((nodeType) => (
                  <MenuItem key={nodeType.id} value={nodeType.node_type}>
                    {nodeType.node_type}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        )}

        <Typography variant="subtitle1">Established On</Typography>
        <Typography variant="body2" color="textSecondary">
          Specify the date when the node was established.
        </Typography>
        <Controller
          name="established_on"
          control={control}
          render={({ field }) => (
            <TextField
              label="Established On"
              type="date"
              {...field}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}
        />

        <Typography variant="subtitle1">Node Description</Typography>
        <Typography variant="body2" color="textSecondary">
          Provide a brief description of the node's purpose and activities.
        </Typography>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              label="Node Description"
              {...field}
              multiline
              rows={3}
              fullWidth
            />
          )}
        />

        <Typography variant="subtitle1">Capabilities</Typography>
        <Typography variant="body2" color="textSecondary">
          Select the capabilities offered by the node.
        </Typography>
        {loadingCapabilities ? (
          <CircularProgress />
        ) : (
          <Controller
            name="capabilities"
            control={control}
            render={({ field }) => (
              <Select
                label="Capabilities"
                multiple
                fullWidth
                value={field.value}
                onChange={field.onChange}
                input={<OutlinedInput />}
                renderValue={(selected: string[]) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {capabilities.map((cap) => (
                  <MenuItem key={cap} value={cap}>
                    {cap}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        )}

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1">Public Access</Typography>
            <Typography variant="body2" color="textSecondary">
              Indicate whether the node is open to public access.
            </Typography>
            <Controller
              name="public_access"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Open to public access"
                />
              )}
            />

            <Typography variant="subtitle1">Admin Contact</Typography>
            <Typography variant="body2" color="textSecondary">
              Provide the email or handle of the node's administrator.
            </Typography>
            <Controller
              name="admin_contact"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Admin Contact (email or handle)"
                  {...field}
                  fullWidth
                />
              )}
            />

            <Typography variant="subtitle1">Matrix Server URL</Typography>
            <Typography variant="body2" color="textSecondary">
              Enter the URL of the Matrix server associated with the node.
            </Typography>
            <Controller
              name="matrix_server_url"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Matrix Server URL"
                  {...field}
                  fullWidth
                />
              )}
            />

            <Typography variant="subtitle1">Nostr Relay URL</Typography>
            <Typography variant="body2" color="textSecondary">
              Enter the URL of the Nostr relay associated with the node.
            </Typography>
            <Controller
              name="nostr_relay_url"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Nostr Relay URL"
                  {...field}
                  fullWidth
                />
              )}
            />

            <Typography variant="subtitle1">IPFS Gateway URL</Typography>
            <Typography variant="body2" color="textSecondary">
              Enter the URL of the IPFS gateway associated with the node.
            </Typography>
            <Controller
              name="ipfs_gateway_url"
              control={control}
              render={({ field }) => (
                <TextField
                  label="IPFS Gateway URL"
                  {...field}
                  fullWidth
                />
              )}
            />

            <Typography variant="subtitle1">Sync Enabled</Typography>
            <Typography variant="body2" color="textSecondary">
              Enable or disable synchronization with other nodes.
            </Typography>
            <Controller
              name="sync_enabled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Enable sync with other nodes"
                />
              )}
            />

            <Typography variant="subtitle1">Acts as a Data Mirror</Typography>
            <Typography variant="body2" color="textSecondary">
              Indicate whether the node acts as a data mirror.
            </Typography>
            <Controller
              name="is_mirror"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Acts as a data mirror"
                />
              )}
            />
          </AccordionDetails>
        </Accordion>

        <Box mt={3}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Save Node
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
