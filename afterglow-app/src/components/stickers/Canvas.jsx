import "./Canvas.css";
import PropTypes from 'prop-types';
import { Row } from "./Row";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

Canvas.propTypes = {
    color: PropTypes.string.isRequired,
}

export function Canvas({color}) {

    const [isDrawing, setIsDrawing] = useState(false); // is user actively drawing?
    const [drawMode, setDrawMode] = useState(true); 
    const [eraseMode, setEraseMode] = useState(false);

    const canvasRef = useRef();

    /*  The canvas is a 32x32 2D array of pixels.
        2d arrays don't exist in JS, so we must simulate one by nesting arrays.
        We make an array of Row components that are each an array of Pixel components.
        
        However, in order to change the color of each Pixel (for the clear function), I lifted the pixelColor state up from Pixel to Canvas.
        Now, the pixelColors stores a 32x32 2D array of strings (color hexcodes) each in the same position as the pixel they correspond to in the rows 2D array.
    */

    let height = 32;
    let width = 32;

    /* 
        pixelColors is a 32x32 2D array of strings 
        The first Array object has "height" number of elements representing the rows in the 2D array
        and each element in this array holds another Array object, which has "width" number of elements.
        Each of these arrays holds the color of the pixels in the row.
        Each row is filled with white pixels at first.
    */
    const [pixelColors, setPixelColors] = useState(
        () => Array.from({ length: height }, () => Array(width).fill(null))
    );

    function setPixelColor(row, col, newColor) {
        setPixelColors(prev => {
            const next = prev.map(r => [...r]); // copy the 2D array
            next[row][col] = newColor;
            return next;
        });
    }

    function clearCanvas() {
        setPixelColors(Array.from({ length: height }, () => Array(width).fill(null)));
    }

    /* 
        html2canvas reads the DOM rendered by the pixels <div> (and all child divs like each Pixel and Row component)
        and saves it to a <canvas> element. Then, the canvas is saved as a Data URL (long text string) and stored in the database.
    */
    function saveCanvas(){
        html2canvas(canvasRef.current, {
            backgroundColor: null,
            scale: 1,
        }).then(async(canvas)=>{
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            let name = "sticker";
            const base64 = canvas.toDataURL("image/png").split(",")[1]; //get rid of unwanted prefix by splitting Data URL and taking part w/o prefix
            await window.db.addSticker(name, base64);

            /* download sticker as png to downloads folder
            const link = document.createElement("a"); //creates <a> in memory
            link.download = "sticker.png"; //makes it so clicking <a> triggers a download named sticker.png
            link.href = canvas.toDataURL("image/png"); //links <a> to the canvas
            link.click(); //manually clicks <a> so it downloads the canvas
            */
        });
    }

    // rows holds the actual Row components, which each hold an array of Pixel components
    // also using Row component for passing pixelColors, rowIndex, setPixelColor, isDrawing, drawMode, eraseMode from Canvas through Row to Pixel
    let rows = [];
    for (let i = 0; i < height; i++) {
        rows.push(
            <Row key={i} width={width} color={color} 
                 pixelColors={pixelColors[i]} 
                 rowIndex={i}
                 setPixelColor={setPixelColor} 
                 isDrawing={isDrawing}
                 drawMode={drawMode}
                 eraseMode={eraseMode}
            />
        );
    }

    return(
        <div id="canvas-container">
            <div id="canvas">
                <div 
                    id="pixels"
                    onMouseDown={ () => setIsDrawing(true)}
                    onMouseUp={ () => setIsDrawing(false)}
                    onMouseLeave={ () => setIsDrawing(false)}
                    ref={canvasRef} >
                    {rows}
                </div>
            </div>

            <div id="button-container">
                <button 
                    className="canvas-button"
                    onClick = {() => {
                        if(drawMode){
                            setDrawMode(false);
                            setEraseMode(true);
                        } else if(eraseMode){
                            setEraseMode(false);
                            setDrawMode(true);
                        }
                    }} >
                    {drawMode ? 'Eraser' : 'Pen'}
                </button>

                <button 
                    className="canvas-button"
                    onClick = {clearCanvas} >
                    Clear
                </button>

                <button 
                    className="canvas-button"
                    id="save"
                    onClick = {saveCanvas} >
                    Save
                </button>
            </div>
            
        </div>
        
    );
}