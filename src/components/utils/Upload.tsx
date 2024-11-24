import heic2any from "heic2any";
import Image from "next/image";
import { type FC, useCallback ,useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { createThirdwebClient } from "thirdweb";
import { resolveScheme,upload } from "thirdweb/storage";

import { env } from "~/env";
import { api } from "~/utils/api";

interface UploadProps {
  className?: string; // completely override classes
  additionalClasses?: string; // add classes to the default classes
  label?: string;
  hoverLabel?: string;
  onUpload?: ({
    resolvedUrls,
    uris,
  } : { 
    resolvedUrls: string[], uris: string[]
  }) => void;
  onUploadError?: (error: Error) => void;
  initialUrls?: string[];
  height?: string;
  objectCover?: boolean;
  imageClassName?: string;
}

export const Upload: FC<UploadProps> = ({ 
  className,
  onUpload,
  onUploadError,
  additionalClasses,
  initialUrls,
  height,
  objectCover,
  imageClassName,
  label,
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [dropzoneLabel, setDropzoneLabel] = useState<string>("📷 Upload your image!");
  const safetyCheck = api.safety.checkForImageSafety.useMutation();

  useEffect(() => {
    if (initialUrls && initialUrls.length > 0) {
      setUrls(initialUrls);
    } else {
      setUrls([]);
    }
  }, [initialUrls]);

  const conductImageSafetyCheck = useCallback(async (file: File): Promise<boolean> => {
    // convert the file to base64 image
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const base64Image = await new Promise<string>((resolve) => {
      reader.onload = () => {
        console.log({ image: reader.result });
        resolve(reader.result as string);
      };
    });
    const isSafe = await safetyCheck.mutateAsync({
      base64ImageString: base64Image,
    });
    return isSafe;
  }, [safetyCheck]);

  const resizeImageFile = useCallback(async (file: File): Promise<File> => {
    if (typeof window === 'undefined') {
      throw new Error("This function can only be run in the browser");
    }
  
    const maxSize = 0.5 * 1024 * 1024; // .5MB in bytes
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif';
    console.log({ isHeic, file });
  
    let imageFile = file;
  
    if (isHeic) {
      const heicBlob = await heic2any({ blob: file, toType: "image/jpeg" });
      const heicBlobArray = Array.isArray(heicBlob) ? heicBlob : [heicBlob];
      imageFile = new File(heicBlobArray, file.name.replace(/\.(heic|heif)$/, ".jpg"), { type: "image/jpeg" });
    }
  
    if (imageFile.size <= maxSize) return imageFile; // Return original file if it doesn't exceed the limit
  
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const src = URL.createObjectURL(imageFile);
    console.log({ src });
    img.src = src;
  
    await new Promise((resolve) => {
      img.onload = resolve;
    });
  
    let quality = 0.9; // Start with high quality
    let resizedFile = imageFile;
  
    do {
      console.log('resizing at quality: ', quality);
      const ctx = canvas.getContext('2d');
      const width = img.width * quality;
      const height = img.height * quality;
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
  
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/jpeg', quality)
      );
      resizedFile = new File([blob], imageFile.name, { type: 'image/jpeg' });
      quality -= 0.1; // Reduce quality progressively
    } while (resizedFile.size > maxSize && quality > 0.1);
  
    URL.revokeObjectURL(src);

    return resizedFile;
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUrls([]);
    setDropzoneLabel("🖼️ Preparing upload...");

    const resizedFilesPromises = acceptedFiles.map(async (file) => {
      return await resizeImageFile(file);
    });

    const resizedFiles = await Promise.all(resizedFilesPromises);

    if (resizedFiles.length === 0) {
      toast.error("No files to upload");
      onUploadError?.(new Error("No files to upload"));
      setDropzoneLabel(label ?? "📷 Upload your image!");
      return;
    }

    // Check if the image is safe
    setDropzoneLabel("🕵🏻‍♂️ Checking for safety...");
    try {
      const isSafe = await conductImageSafetyCheck(resizedFiles[0]!);
      if (!isSafe) {
        toast.error("Image is not safe to upload");
        onUploadError?.(new Error("Image is not safe to upload"));
        setDropzoneLabel(label ?? "📷 Upload your image!");
        return;
      }
      setDropzoneLabel("✅ Image passed safety check!");
    } catch (e) {
      toast.error("Error checking image safety");
      onUploadError?.(e as Error);
      setDropzoneLabel(label ?? "📷 Upload your image!");
      return;
    }

    try {
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
      });
      setDropzoneLabel("☁️ Uploading...");
      const uris = await upload({
        files: resizedFiles,
        client,
      });
      const resolvedUrls = typeof uris === 'string' ? [resolveScheme({
        uri: uris,
        client,
      })] : await Promise.all(uris.map(uri => (
        resolveScheme({
          uri,
          client,
        })
      )));
      setUrls(resolvedUrls);
      onUpload?.({ resolvedUrls, uris: typeof uris === 'string' ? [uris] : uris });
    } catch (e) {
      toast("Error uploading file", { type: "error" });
      onUploadError?.(e as Error);
    } finally {
      setDropzoneLabel(label ?? "📷 Upload your image!");
    }
  }, [conductImageSafetyCheck, label, onUpload, onUploadError, resizeImageFile]);
  
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { image: ["image/*"] }});

  useEffect(() => {
    if (isDragActive) {
      setDropzoneLabel("👋 Drop here!");
    } else {
      setDropzoneLabel(label ?? "📷 Upload your image!");
    }
  }, [isDragActive, label]);


  const previewImageSrc = (src: string) => {
    if (src.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${src.replace("ipfs://", "")}`;
    }
    return src;
  }

  return (
    <div {...getRootProps()} className={className ?? `bg-base-200 rounded-lg ${height ? height : 'h-64'} w-full grid place-content-center cursor-pointer relative ${additionalClasses ?? ""}`}>
      <input {...getInputProps()} />
      {
        urls.length && urls.length > 0 && urls[0] !== "" ? (
          <div className="absolute inset-0 w-full h-full bg-cover overflow-hidden rounded-lg">
            <Image
              src={previewImageSrc(urls[0]!)}
              alt="uploaded image"
              layout="fill"
              objectFit={objectCover ? "cover" : "contain"}
              className={imageClassName}
            />
          </div>
        ) : (
          <p>{dropzoneLabel}</p>
        )
      }
    </div>
  )
};

export default Upload;