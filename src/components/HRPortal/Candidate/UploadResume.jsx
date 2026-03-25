import React, { useState } from 'react';
import { Upload, FileArchive, X, CheckCircle, FolderArchive, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { api } from '../../../Api/api'; // Ensure this points to your axios instance

const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Get token for authorization
    const { token } = useSelector((state) => state.auth);

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;
        const isZip = selectedFile.type === "application/x-zip-compressed" || 
                      selectedFile.type === "application/zip" || 
                      selectedFile.name.endsWith('.zip');

        if (!isZip) {
            toast.error("Please upload a ZIP file.");
            return;
        }
        setFile(selectedFile);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        validateAndSetFile(e.dataTransfer.files[0]);
    };

   // UploadResume.jsx - Inside handleSubmit
const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    
    // CHANGE THIS LINE: Match the key 'zipFile' defined in your backend router
    formData.append('zipFile', file); 

    setUploading(true);
    const loadingToast = toast.loading("Extracting & analyzing resumes with AI...");

    try {
        const response = await api.post('/admin/resumes/bulk-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.success) {
            toast.success(response.data.message || "Bulk upload successful!", { id: loadingToast });
            setFile(null);
        }
    } catch (error) {
        console.error("Upload error:", error);
        // This will now show the specific error message from your backend if it fails again
        const errorMsg = error.response?.data?.message || "Failed to process resumes.";
        toast.error(errorMsg, { id: loadingToast });
    } finally {
        setUploading(false);
    }
};

    return (
        <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            
            <div className="mb-6 border-b border-gray-50 pb-4">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
                    Upload <span className="text-red-600">Resumes</span>
                </h2>
                <p className="text-gray-400 text-xs tracking-tight font-bold mt-1">
                    Upload candidate resumes in bulk
                </p>
            </div>

            <div className="space-y-6">
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={`relative border-2 border-dashed rounded-xl p-10 transition-all flex flex-col items-center justify-center cursor-pointer
                        ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                >
                    <input
                        type="file"
                        accept=".zip"
                        disabled={uploading}
                        onChange={(e) => validateAndSetFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    
                    <div className="flex items-center gap-3 mb-3">
                        <FolderArchive className={`w-8 h-8 ${isDragging ? 'text-red-600' : 'text-gray-300'}`} />
                        <Upload className={`w-5 h-5 ${isDragging ? 'text-red-600' : 'text-gray-400'}`} />
                    </div>
                    
                    <p className="text-gray-700 text-sm font-semibold">
                        {uploading ? "Processing..." : "Click or drag ZIP file here"}
                    </p>
                </div>

                {file && (
                    <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-600 p-2 rounded-lg">
                                <FileArchive className="text-white" size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 truncate max-w-[250px]">{file.name}</p>
                                <p className="text-xs text-gray-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setFile(null)} 
                            disabled={uploading}
                            className="p-2 hover:bg-red-100 rounded-full text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={!file || uploading}
                        className="w-1/2 sm:w-2/3 py-3 bg-red-600 text-white text-xs rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-md shadow-red-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none active:scale-95 flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <CheckCircle size={16} />
                        )}
                        {uploading ? "Processing..." : "Submit Resumes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadResume;