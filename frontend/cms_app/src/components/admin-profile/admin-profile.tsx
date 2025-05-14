import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Switch,
    FormControlLabel,
    CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { supabaseClient } from "../../utility/supabaseClient"; // Update path as needed

interface NodeProfile {
    id: number;
    name: string;
    address: string;
    profile_image_url: string;
    node_type: string;
    established_on: string;
    description: string;
    public_access: boolean;
    admin_contact: string;
    matrix_server_url: string;
    nostr_relay_url: string;
    ipfs_gateway_url: string;
    sync_enabled: boolean;
    is_mirror: boolean;
    capabilities: string[] | null;
}

export const AdminProfile: React.FC = () => {
    const { control, handleSubmit, reset } = useForm<NodeProfile>();
    const [loading, setLoading] = useState(true);
    const [nodeId, setNodeId] = useState<number | null>(null);

    useEffect(() => {
        const fetchNode = async () => {
            const { data, error } = await supabaseClient
                .from("nodes")
                .select("*")
                .eq("is_host", true)
                .single();

            if (error) {
                console.error("Error fetching node:", error);
            } else if (data) {
                setNodeId(data.id);
                reset(data);
            }
            setLoading(false);
        };

        fetchNode();
    }, [reset]);

    const onSubmit = async (formData: NodeProfile) => {
        if (!nodeId) return;
        const { error } = await supabaseClient
            .from("nodes")
            .update(formData)
            .eq("id", nodeId);

        if (error) {
            alert("Error updating node.");
            console.error(error);
        } else {
            alert("Node updated successfully!");
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Node Profile
            </Typography>

            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <TextField fullWidth label="Name" margin="normal" {...field} />
                )}
            />
            <Controller
                name="address"
                control={control}
                render={({ field }) => (
                    <TextField fullWidth label="Address" margin="normal" {...field} />
                )}
            />
            <Controller
                name="node_type"
                control={control}
                render={({ field }) => (
                    <TextField fullWidth label="Node Type" margin="normal" {...field} />
                )}
            />
            <Controller
                name="established_on"
                control={control}
                render={({ field }) => (
                    <TextField
                        fullWidth
                        label="Established On"
                        type="date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        {...field}
                    />
                )}
            />
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        multiline
                        rows={3}
                        {...field}
                    />
                )}
            />
            <Controller
                name="admin_contact"
                control={control}
                render={({ field }) => (
                    <TextField fullWidth label="Admin Contact" margin="normal" {...field} />
                )}
            />
            <Controller
                name="matrix_server_url"
                control={control}
                render={({ field }) => (
                    <TextField fullWidth label="Matrix Server URL" margin="normal" {...field} />
                )}
            />
            <Controller
                name="nostr_relay_url"
                control={control}
                render={({ field }) => (
                    <TextField fullWidth label="Nostr Relay URL" margin="normal" {...field} />
                )}
            />
            <Controller
                name="ipfs_gateway_url"
                control={control}
                render={({ field }) => (
                    <TextField fullWidth label="IPFS Gateway URL" margin="normal" {...field} />
                )}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                <Controller
                    name="public_access"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Public Access"
                        />
                    )}
                />
                <Controller
                    name="sync_enabled"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Sync Enabled"
                        />
                    )}
                />
                <Controller
                    name="is_mirror"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} />}
                            label="Is Mirror"
                        />
                    )}
                />
            </Box>

            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                Save Changes
            </Button>
        </Box>
    );
};
