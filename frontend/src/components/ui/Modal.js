import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {

    useEffect(() => {
        if (!isOpen) return
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4" onClick={onClose}>
            <div className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}>
                {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
                {children}
            </div>
        </div>

    )
}