import { useState, useEffect, useCallback } from 'react';
import { mockData } from '../data';

export const useData = (dataKey, options = {}) => {
    const {
        useMockData = true,
        endpoint = dataKey,
        params = {},
        autoFetch = true,
    } = options;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            await new Promise(resolve => setTimeout(resolve, 500));

            let result = mockData[dataKey];

            // Handle different data structures
            if (dataKey === 'users') {
                // Convert users object to array
                if (result && typeof result === 'object' && !Array.isArray(result)) {
                    result = Object.values(result);
                }
            } else if (dataKey === 'accounts') {
                // Keep accounts as object with nested arrays (real, demo, archived)
                // Don't convert to array!
                if (!result) {
                    result = { real: [], demo: [], archived: [] };
                }
            } else {
                // For other data types, convert object to array if needed
                if (result && typeof result === 'object' && !Array.isArray(result)) {
                    result = Object.values(result);
                }
            }

            setData(result || []);
        } catch (err) {
            setError(err.message);
            setData(dataKey === 'accounts' ? { real: [], demo: [], archived: [] } : []);
        } finally {
            setLoading(false);
        }
    }, [dataKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateItem = useCallback(async (itemId, updatedData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (dataKey === 'accounts') {
                // Update account in the correct nested array
                setData(prevData => {
                    const newData = { ...prevData };
                    ['real', 'demo', 'archived'].forEach(type => {
                        if (newData[type]) {
                            newData[type] = newData[type].map(item =>
                                item.id === itemId
                                    ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
                                    : item
                            );
                        }
                    });
                    return newData;
                });
            } else {
                // Update for array data (users, etc)
                setData(prevData =>
                    prevData.map(item =>
                        item.id === itemId
                            ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
                            : item
                    )
                );
            }
            return { success: true, data: { ...updatedData, id: itemId } };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, [dataKey]);

    const deleteItem = useCallback(async (itemId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (dataKey === 'accounts') {
                // Delete account from the correct nested array
                setData(prevData => {
                    const newData = { ...prevData };
                    ['real', 'demo', 'archived'].forEach(type => {
                        if (newData[type]) {
                            newData[type] = newData[type].filter(item => item.id !== itemId);
                        }
                    });
                    return newData;
                });
            } else {
                // Delete for array data (users, etc)
                setData(prevData => prevData.filter(item => item.id !== itemId));
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, [dataKey]);

    const addItem = useCallback(async (newItem) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const itemWithMeta = {
                ...newItem,
                id: `${dataKey}_${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (dataKey === 'accounts') {
                // Add account to the correct nested array
                const accountType = newItem.accountType?.toLowerCase() || 'real';
                setData(prevData => ({
                    ...prevData,
                    [accountType]: [...(prevData[accountType] || []), itemWithMeta]
                }));
            } else {
                // Add for array data (users, etc)
                setData(prevData => [...prevData, itemWithMeta]);
            }

            return { success: true, data: itemWithMeta };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, [dataKey]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        updateItem,
        deleteItem,
        addItem,
    };
};
