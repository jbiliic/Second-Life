import { useRef, useState } from 'react';
import styles from './FileUpload.module.css';

interface FileUploadProps {
    title: string;
    subtitle: string;
    accept?: string;
    icon: React.ReactNode;
    onChange: (file: File) => void;
}

export default function FileUpload({
    title,
    subtitle,
    accept = 'image/*',
    icon,
    onChange,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onChange(file);
        }
    };

    return (
        <>
            <button
                type="button"
                className={styles.uploadRow}
                onClick={() => inputRef.current?.click()}
            >
                <div className={styles.uploadInfo}>
                    <span className={styles.uploadTitle}>{title}</span>
                    <span className={styles.uploadSubtitle}>{fileName ?? subtitle}</span>
                </div>
                <div className={styles.uploadIcon}>{icon}</div>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                style={{ display: 'none' }}
                onChange={handleChange}
            />
        </>
    );
}
