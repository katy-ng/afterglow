import PropTypes from 'prop-types';
import { useState } from "react";

Pixel.propTypes = {
    color: PropTypes.string.isRequired,
    pixelColor: PropTypes.string.isRequired,
    onSetColor: PropTypes.func.isRequired,
    isDrawing: PropTypes.bool.isRequired,
    drawMode: PropTypes.bool.isRequired,
    eraseMode: PropTypes.bool.isRequired,
}

// color = the color the user selected
export function Pixel({color, pixelColor, onSetColor, isDrawing, drawMode, eraseMode}){

    const [ isHovered, setIsHovered ] = useState(false);

  

    function applyColor(){
        if(drawMode){
            onSetColor(color);
        } else if(eraseMode){
            onSetColor(null);
        }
        
    }

    // when user hovers over a pixel, that pixel will change to the selected color, but if user doesn't click, pixel stays its old color
    function hoverColor(){
        setIsHovered(true);
        if(isDrawing && drawMode){
            onSetColor(color);
        } else if(isDrawing && eraseMode){
            onSetColor(null); 
        } 
    }
    
    function getDisplayColor(){
        if(isHovered && drawMode && !isDrawing) return color;
        if(isHovered && eraseMode && !isDrawing) return '#D3D3D3';
        return pixelColor ?? '#ffffff';
    }

    return(
        <div 
            className="pixel" style={{backgroundColor: getDisplayColor()}}
            onClick={applyColor}
            onMouseEnter={hoverColor}
            onMouseLeave={()=>{setIsHovered(false)}}
        >
        </div>
    )
}