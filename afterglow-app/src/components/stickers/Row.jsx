import { Pixel } from "./Pixel";
import PropTypes from 'prop-types';

Row.propTypes = {
    width: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    pixelColors: PropTypes.array.isRequired,
    rowIndex: PropTypes.number.isRequired,
    setPixelColor: PropTypes.func.isRequired,
    isDrawing: PropTypes.bool.isRequired,
    drawMode: PropTypes.bool.isRequired,
    eraseMode: PropTypes.bool.isRequired,
}

export function Row({width, color, pixelColors, rowIndex, setPixelColor, isDrawing, drawMode, eraseMode}){
    //passing pixelColors, rowIndex, setPixelColor, and isDrawing from Canvas through Row to Pixel
    
    let pixels = [];

    for(let i=0; i<width; i++){
        pixels.push(<Pixel 
            key={i} 
            color={color}
            pixelColor={pixelColors[i]}
            onSetColor={(newColor) => setPixelColor(rowIndex, i, newColor)}
            isDrawing={isDrawing}
            drawMode={drawMode}
            eraseMode={eraseMode}
        />)
    }

    return <div className="row">{pixels}</div>
}

