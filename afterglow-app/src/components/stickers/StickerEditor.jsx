import "./StickerEditor.css";
import { useState,  } from "react";
import { SketchPicker } from "react-color";
import { Canvas } from "./Canvas";
import { StickerLibrary } from "./StickerLibrary";


export function StickerEditor(){


    //pixel data stored as a 2D array, update canvas when user draws a pixel
    //const [canvas, setCanvas] = useState();
    const [color, setColor] = useState("#000000");


    function changeColor(color){
        setColor(color.hex);
    }


    //refresh key for sticker library
    const [refreshLibrary, setRefreshLibrary] = useState(0);
    //when the user saves, this refresh key increments, triggering the sticker library to refresh
    function handleSaveSticker(){
        setRefreshLibrary(prev => prev + 1);
    }


    return(
        <div className="editor-component">
            <div id="drawing-section">
                <SketchPicker
                    color = { color }
                    onChangeComplete = { changeColor }
                    disableAlpha = { true }
                />


                <Canvas color={color} handleSaveSticker={handleSaveSticker}/>
            </div>
           
            <StickerLibrary refreshLibrary={refreshLibrary} />


        </div>
    );


}
