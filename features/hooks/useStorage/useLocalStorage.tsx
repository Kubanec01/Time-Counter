'use client'

export const useLocalStorage = () => {

    function setLocalStorage <T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
    }

    function getLocalStorage <T>(key: string, defaultValue: T) {
        if (typeof window === "undefined")
            return defaultValue;

        const data = localStorage.getItem(key)

        if(!data) {
            setLocalStorage(key, defaultValue)
            return defaultValue
        }

        return JSON.parse(data)
    }

    return {getLocalStorage, setLocalStorage}
}
