import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { supabaseClient } from "../../../utility/supabaseClient";
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

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);

      const { error: uploadError } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        setImageUrl(data.publicUrl);
        onUpload?.(data.publicUrl);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 360,
        mx: "auto",
        textAlign: "center",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Upload an Image
      </Typography>

      <Avatar
        src={imageUrl || "/placeholder.png"}
        alt="Uploaded"
        sx={{ width: 150, height: 150, mx: "auto", mb: 2 }}
        variant="rounded"
      />

      <Box>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          disabled={uploading}
        >
          {uploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Choose File"
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </Box>

      {!imageUrl && !uploading && (
        <Typography variant="body2" color="text.secondary" mt={2}>
          No image uploaded yet.
        </Typography>
      )}
    </Paper>
  );
};
