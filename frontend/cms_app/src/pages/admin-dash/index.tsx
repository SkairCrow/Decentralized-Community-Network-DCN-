import React from "react";
import { Typography, Box } from "@mui/material";
import { ThemedLayoutV2 } from "@refinedev/mui";
import { Header } from "../../components/header";
import { AdminProfile } from "../../components/admin-profile/admin-profile";

const AdminDashPage: React.FC = () => {
    return (
        <ThemedLayoutV2 Header={Header}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Typography gutterBottom>
                    Welcome to the Admin Dashboard. Here you can manage your node and configuration.
                </Typography>
                <AdminProfile />
            </Box>
        </ThemedLayoutV2>
    );
};

export default AdminDashPage;
