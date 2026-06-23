import "./StickerEditor.css";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { Canvas } from "./Canvas"

export function StickerEditor(){
    //pixel data stored as a 2D array, update canvas when user draws a pixel
    //const [canvas, setCanvas] = useState();
    const [color, setColor] = useState("#000000")

    function changeColor(color){
        setColor(color.hex);
    }

    return(
        <div className="editor-component">
            <SketchPicker 
                color = { color }
                onChangeComplete = { changeColor }
                disableAlpha = { true }
            /> 

            <Canvas color={color} />

            {/* make button to see previous stickers? */}
        </div>
    );

}