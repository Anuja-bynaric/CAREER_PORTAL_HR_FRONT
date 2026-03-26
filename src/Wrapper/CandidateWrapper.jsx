import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { setApplicationSession, clearApplicationSession } from '../redux/ApplicationSlice';
import { api } from '../Api/api';
import { Loader2 } from 'lucide-react';

const CandidateWrapper = () => {
    const dispatch = useDispatch();
    const { isVerified } = useSelector((state) => state.application);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // If already verified in Redux, no need to check again
            if (isVerified) {
                setLoading(false);
                return;
            }

            try {
                // Call your "me" or "status" endpoint that checks HTTP-only cookies
                const response = await api.get('/user/me'); 
                if (response.data.success) {
                    dispatch(setApplicationSession(response.data.token));
                }
            } catch (error) {
                console.error("Auth check failed", error);
                dispatch(clearApplicationSession());
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch, isVerified]);

    // 1. While checking the API, show a spinner so the user doesn't see a blank screen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
        );
    }

    // 2. If after the check they aren't verified, block access
    if (!isVerified) {
        return <Navigate to="/login" replace />;
    }

    // 3. Otherwise, let them into the Dashboard
    return <Outlet />;
};

export default CandidateWrapper;