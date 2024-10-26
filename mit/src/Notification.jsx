import React, { useEffect, useState } from 'react';

const Notification = ({ productos }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (productos.length > 0) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [productos]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 right-5 bg-yellow-400 text-black p-4 rounded shadow-lg transition-opacity duration-300">
            <span>
                ¡Atención! Los siguientes productos están cerca de agotarse: {productos.join(', ')}
            </span>
        </div>
    );
};

export default Notification;