import React, { useState } from "react";
import { ReactReader } from "react-reader";



const FileUpload = () => {
    const [epubFile, setEpubFile] = useState<string | null>(null);
    const [location, setLocation] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file && file.type === "application/epub+zip") {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target && typeof event.target.result === "string") {
                    setEpubFile(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid EPUB file.");
        }
    };

    return (
        <div>
            <input type="file" accept=".epub" onChange={handleFileChange} />
            {epubFile &&
                <div style={{ position: "relative", height: "100vh" }}>
                    <ReactReader
                        url={epubFile}
                        locationChanged={(epubcifi: string) => setLocation(epubcifi)}
                        location={location}
                    />
                </div>
            }
        </div>
    );
};

export default FileUpload;
