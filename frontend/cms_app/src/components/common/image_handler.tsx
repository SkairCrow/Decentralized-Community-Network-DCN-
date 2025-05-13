import React, { useState, ChangeEvent } from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { supabaseClient } from "../../utility/supabaseClient";
import { v4 as uuidv4 } from "uuid";

interface ImageHandlerProps {
    bucket: string;
    initialUrl?: string;
    onUpload?: (publicUrl: string) => void;
}

export const ImageHandler: React.FC<ImageHandlerProps> = ({
    bucket,
    initialUrl = "",
    onUpload,
}) => {
    const [imageUrl, setImageUrl] = useState<string>(initialUrl);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        // Generate a unique file name
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `/avatars/${fileName}`;

        try {
            // Cache the file locally in the public directory
            const localUrl = URL.createObjectURL(file);
            setImageUrl(localUrl);

            // Upload the file to Supabase storage
            const { error: uploadError } = await supabaseClient.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                console.error("Upload error:", uploadError.message);
                setUploading(false);
                return;
            }

            // Get the public URL of the uploaded file
            const { data: publicData } = supabaseClient.storage
                .from(bucket)
                .getPublicUrl(filePath);

            if (publicData?.publicUrl) {
                setImageUrl(publicData.publicUrl);
                onUpload?.(publicData.publicUrl);
            }
        } catch (error) {
            console.error("Error handling file upload:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{ border: "1px solid #ccc", borderRadius: 2, p: 3 }}
        >
            <Avatar
                src={imageUrl || "/placeholder.png"}
                alt="Uploaded image"
                sx={{ width: 150, height: 150 }}
                variant="rounded"
            />
            <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Image"}
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
            {!imageUrl && (
                <Typography variant="body2" color="text.secondary">
                    No image uploaded
                </Typography>
            )}
        </Box>
    );
};
