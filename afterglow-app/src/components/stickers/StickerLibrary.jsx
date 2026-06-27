import "./StickerLibrary.css";
import { useState, useEffect } from "react";

export function StickerLibrary({refreshLibrary}){
    const [stickers, setStickers] = useState([]);

    useEffect(() => {
        window.db.getAllStickers().then(all => setStickers(all));
    }, [refreshLibrary]); //useEffect reruns when refreshLibrary is triggered (whenever user saves a sticker)

    return (
        <div className="sticker-library">
            {stickers.map((sticker) => (
                <img
                    className="sticker-image"
                    key={sticker.id}
                    src={`localfile://${sticker.image_path}`}
                    alt={sticker.name}
                    title={sticker.name}
                />
            ))}
        </div>
    );
}
