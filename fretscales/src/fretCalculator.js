import { useState, useEffect } from 'react';

const FretCalculator = () => {
  // Estados para los parámetros
  const [scaleLength, setScaleLength] = useState(648); // Longitud de escala en mm (estándar para guitarra)
  const [numFrets, setNumFrets] = useState(24);
  const [neckWidth, setNeckWidth] = useState(43); // Ancho del mástil en la cejuela (mm)
  const [bridgeWidth, setBridgeWidth] = useState(56); // Ancho del mástil en el puente (mm)
  const [units, setUnits] = useState('mm');
  const [fretThickness, setFretThickness] = useState(2.0); // Grosor del traste en mm
  const [fretPositions, setFretPositions] = useState([]);
  const [svgData, setSvgData] = useState('');
  
  // Constante para la relación matemática de los trastes (12va raíz de 2)
  const FRET_RATIO = Math.pow(2, 1/12);
  
  // Función para convertir mm a pulgadas
  const mmToInches = (mm) => mm / 25.4;
  
  // Función para convertir pulgadas a mm
  const inchesToMm = (inches) => inches * 25.4;
  
  // Función para formatear números según las unidades
  const formatMeasurement = (value) => {
    if (units === 'inches') {
      return mmToInches(value).toFixed(3) + '"';
    }
    return value.toFixed(1) + 'mm';
  };
  
  // Función para calcular las posiciones de los trastes
  const calculateFretPositions = () => {
    const positions = [];
    let currentLength = scaleLength;
    
    // La posición 0 es la cejuela
    positions.push({
      position: 0,
      distance: 0,
      width: neckWidth
    });
    
    // Calcular cada traste
    for (let i = 1; i <= numFrets; i++) {
      const fretDistance = currentLength / FRET_RATIO;
      const distanceFromNut = scaleLength - fretDistance;
      
      // Calcular el ancho interpolando entre el ancho de la cejuela y el puente
      const widthRatio = distanceFromNut / scaleLength;
      const width = neckWidth + (bridgeWidth - neckWidth) * widthRatio;
      
      positions.push({
        position: i,
        distance: distanceFromNut,
        width: width
      });
      
      currentLength = fretDistance;
    }
    
    // Añadir el puente como último punto
    positions.push({
      position: numFrets + 1,
      distance: scaleLength,
      width: bridgeWidth
    });
    
    return positions;
  };
  
  // Recalcular cuando cambian los parámetros
  useEffect(() => {
    const positions = calculateFretPositions();
    setFretPositions(positions);
  }, [scaleLength, numFrets, neckWidth, bridgeWidth, fretThickness, units]);
  
  // Función para convertir valores cuando cambian las unidades
  const handleUnitChange = (newUnits) => {
    if (newUnits === units) return;
    
    if (newUnits === 'inches') {
      // Convertir mm a pulgadas
      setScaleLength(parseFloat((scaleLength / 25.4).toFixed(3)));
      setNeckWidth(parseFloat((neckWidth / 25.4).toFixed(3)));
      setBridgeWidth(parseFloat((bridgeWidth / 25.4).toFixed(3)));
      setFretThickness(parseFloat((fretThickness / 25.4).toFixed(3)));
    } else {
      // Convertir pulgadas a mm
      setScaleLength(parseFloat((scaleLength * 25.4).toFixed(1)));
      setNeckWidth(parseFloat((neckWidth * 25.4).toFixed(1)));
      setBridgeWidth(parseFloat((bridgeWidth * 25.4).toFixed(1)));
      setFretThickness(parseFloat((fretThickness * 25.4).toFixed(1)));
    }
    
    setUnits(newUnits);
  };
  
  // Función para generar y descargar el SVG
  const handleGenerateSVG = () => {
    // Configurar el documento SVG para escala real (1mm = 1mm en el SVG)
    const padding = 20; // Padding en mm
    const svgWidth = bridgeWidth + padding * 2;
    const svgHeight = scaleLength + padding * 2;
    
    // Crear el elemento SVG
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("xmlns", svgNamespace);
    svg.setAttribute("width", `${svgWidth}mm`);
    svg.setAttribute("height", `${svgHeight}mm`);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    
    // Añadir descripción
    const desc = document.createElementNS(svgNamespace, "desc");
    desc.textContent = `Plantilla de trastes a escala real - Longitud: ${formatMeasurement(scaleLength)}, ${numFrets} trastes`;
    svg.appendChild(desc);
    
    // Crear el grupo principal con transformación
    const g = document.createElementNS(svgNamespace, "g");
    g.setAttribute("transform", `translate(${padding}, ${padding})`);
    
    // Dibujar el contorno del mástil
    const path = document.createElementNS(svgNamespace, "path");
    
    // Definir los puntos del contorno
    let pathData = `M ${(bridgeWidth - neckWidth) / 2} 0 `; // Punto superior izquierdo
    
    // Línea lateral izquierda (interpolando el ancho)
    fretPositions.forEach((fret) => {
      const x = (bridgeWidth - fret.width) / 2;
      const y = fret.distance;
      pathData += `L ${x} ${y} `;
    });
    
    // Línea inferior (puente)
    pathData += `L ${(bridgeWidth + fretPositions[fretPositions.length - 1].width) / 2} ${scaleLength} `;
    
    // Línea lateral derecha (subiendo)
    for (let i = fretPositions.length - 2; i >= 0; i--) {
      const fret = fretPositions[i];
      const x = (bridgeWidth + fret.width) / 2;
      const y = fret.distance;
      pathData += `L ${x} ${y} `;
    }
    
    pathData += 'Z';
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "0.5");
    g.appendChild(path);
    
    // Dibujar líneas para cada traste
    fretPositions.slice(1, -1).forEach((fret) => {
      const y = fret.distance;
      const width = fret.width;
      const x1 = (bridgeWidth - width) / 2;
      const x2 = (bridgeWidth + width) / 2;
      
      // Línea del traste
      const line = document.createElementNS(svgNamespace, "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", fretThickness);
      line.setAttribute("stroke-linecap", "round");
      g.appendChild(line);
      
      // Número del traste
      const text = document.createElementNS(svgNamespace, "text");
      text.setAttribute("x", bridgeWidth + 5);
      text.setAttribute("y", y + 2);
      text.setAttribute("font-family", "Arial");
      text.setAttribute("font-size", "4");
      text.setAttribute("text-anchor", "start");
      text.textContent = fret.position;
      g.appendChild(text);
    });
    
    // Añadir línea de la cejuela
    const nutLine = document.createElementNS(svgNamespace, "line");
    nutLine.setAttribute("x1", (bridgeWidth - neckWidth) / 2);
    nutLine.setAttribute("y1", 0);
    nutLine.setAttribute("x2", (bridgeWidth + neckWidth) / 2);
    nutLine.setAttribute("y2", 0);
    nutLine.setAttribute("stroke", "black");
    nutLine.setAttribute("stroke-width", 3);
    nutLine.setAttribute("stroke-linecap", "round");
    g.appendChild(nutLine);
    
    // Añadir línea del puente
    const bridgeLine = document.createElementNS(svgNamespace, "line");
    bridgeLine.setAttribute("x1", (bridgeWidth - fretPositions[fretPositions.length - 1].width) / 2);
    bridgeLine.setAttribute("y1", scaleLength);
    bridgeLine.setAttribute("x2", (bridgeWidth + fretPositions[fretPositions.length - 1].width) / 2);
    bridgeLine.setAttribute("y2", scaleLength);
    bridgeLine.setAttribute("stroke", "black");
    bridgeLine.setAttribute("stroke-width", 3);
    bridgeLine.setAttribute("stroke-linecap", "round");
    g.appendChild(bridgeLine);
    
    // Información de escala
    const scaleText = document.createElementNS(svgNamespace, "text");
    scaleText.setAttribute("x", bridgeWidth / 2);
    scaleText.setAttribute("y", scaleLength + 10);
    scaleText.setAttribute("font-family", "Arial");
    scaleText.setAttribute("font-size", "5");
    scaleText.setAttribute("text-anchor", "middle");
    scaleText.textContent = `Escala: ${formatMeasurement(scaleLength)} - ${numFrets} trastes`;
    g.appendChild(scaleText);
    
    // Añadir el grupo al SVG
    svg.appendChild(g);
    
    // Convertir el SVG a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    
    // Crear un Blob con el SVG
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = `fret_template_${scaleLength}${units === 'mm' ? 'mm' : 'in'}_${numFrets}frets.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar el objeto URL
    URL.revokeObjectURL(url);
    
    // Actualizar el estado para la vista previa
    setSvgData(svgString);
  };
  
  // Función para generar y descargar un DXF
  const handleGenerateDXF = () => {
    // Encabezado DXF
    let dxf = "0\nSECTION\n2\nHEADER\n";
    dxf += "9\n$ACADVER\n1\nAC1021\n";
    dxf += "9\n$INSUNITS\n70\n4\n"; // 4 = milímetros
    dxf += "0\nENDSEC\n";
    
    // Sección ENTITIES
    dxf += "0\nSECTION\n2\nENTITIES\n";
    
    // Línea para la cejuela
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n${(bridgeWidth - neckWidth) / 2}\n20\n0\n30\n0\n`;
    dxf += `11\n${(bridgeWidth + neckWidth) / 2}\n21\n0\n31\n0\n`;
    
    // Líneas para los trastes
    fretPositions.slice(1, -1).forEach((fret) => {
      const y = fret.distance;
      const width = fret.width;
      const x1 = (bridgeWidth - width) / 2;
      const x2 = (bridgeWidth + width) / 2;
      
      dxf += "0\nLINE\n";
      dxf += "8\n0\n";
      dxf += `10\n${x1}\n20\n${y}\n30\n0\n`;
      dxf += `11\n${x2}\n21\n${y}\n31\n0\n`;
    });
    
    // Línea para el puente
    const lastFret = fretPositions[fretPositions.length - 1];
    dxf += "0\nLINE\n";
    dxf += "8\n0\n";
    dxf += `10\n${(bridgeWidth - lastFret.width) / 2}\n20\n${scaleLength}\n30\n0\n`;
    dxf += `11\n${(bridgeWidth + lastFret.width) / 2}\n21\n${scaleLength}\n31\n0\n`;
    
    // Contorno lateral izquierdo
    let prevX = (bridgeWidth - neckWidth) / 2;
    let prevY = 0;
    
    fretPositions.slice(1).forEach((fret) => {
      const x = (bridgeWidth - fret.width) / 2;
      const y = fret.distance;
      
      dxf += "0\nLINE\n";
      dxf += "8\n0\n";
      dxf += `10\n${prevX}\n20\n${prevY}\n30\n0\n`;
      dxf += `11\n${x}\n21\n${y}\n31\n0\n`;
      
      prevX = x;
      prevY = y;
    });
    
    // Contorno lateral derecho
    prevX = (bridgeWidth + neckWidth) / 2;
    prevY = 0;
    
    fretPositions.slice(1).forEach((fret) => {
      const x = (bridgeWidth + fret.width) / 2;
      const y = fret.distance;
      
      dxf += "0\nLINE\n";
      dxf += "8\n0\n";
      dxf += `10\n${prevX}\n20\n${prevY}\n30\n0\n`;
      dxf += `11\n${x}\n21\n${y}\n31\n0\n`;
      
      prevX = x;
      prevY = y;
    });
    
    // Cerrar el DXF
    dxf += "0\nENDSEC\n0\nEOF";
    
    // Crear un Blob con el DXF
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = `fret_template_${scaleLength}${units === 'mm' ? 'mm' : 'in'}_${numFrets}frets.dxf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  };
  
  // Función para renderizar el SVG para vista previa
  const renderSvgPreview = () => {
    // Configuración básica
    const padding = 20;
    const svgWidth = bridgeWidth + padding * 2;
    const svgHeight = scaleLength + padding * 2;
    
    // Crear un SVG más simple para la vista previa
    return (
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${padding}, ${padding})`}>
          {/* Contorno del mástil */}
          <path 
            d={
              `M ${(bridgeWidth - neckWidth) / 2} 0 ` + 
              fretPositions.map(fret => `L ${(bridgeWidth - fret.width) / 2} ${fret.distance} `).join('') +
              `L ${(bridgeWidth + fretPositions[fretPositions.length - 1].width) / 2} ${scaleLength} ` +
              [...fretPositions].reverse().slice(1).map(fret => `L ${(bridgeWidth + fret.width) / 2} ${fret.distance} `).join('') +
              'Z'
            } 
            fill="none" 
            stroke="black" 
            strokeWidth="0.5"
          />
          
          {/* Líneas de trastes */}
          {fretPositions.slice(1, -1).map((fret, index) => (
            <line 
              key={`fret-${index}`}
              x1={(bridgeWidth - fret.width) / 2} 
              y1={fret.distance} 
              x2={(bridgeWidth + fret.width) / 2} 
              y2={fret.distance}
              stroke="black" 
              strokeWidth={fretThickness} 
              strokeLinecap="round"
            />
          ))}
          
          {/* Cejuela */}
          <line 
            x1={(bridgeWidth - neckWidth) / 2} 
            y1={0} 
            x2={(bridgeWidth + neckWidth) / 2} 
            y2={0}
            stroke="black" 
            strokeWidth={3} 
            strokeLinecap="round"
          />
          
          {/* Puente */}
          <line 
            x1={(bridgeWidth - fretPositions[fretPositions.length - 1].width) / 2} 
            y1={scaleLength} 
            x2={(bridgeWidth + fretPositions[fretPositions.length - 1].width) / 2} 
            y2={scaleLength}
            stroke="black" 
            strokeWidth={3} 
            strokeLinecap="round"
          />
          
          {/* Números de trastes */}
          {fretPositions.slice(1, -1).map((fret, index) => (
            <text 
              key={`text-${index}`}
              x={bridgeWidth + 2} 
              y={fret.distance + 1.5} 
              fontSize="3"
              fill="black" 
              textAnchor="start"
            >
              {fret.position}
            </text>
          ))}
          
          {/* Información de escala */}
          <text 
            x={bridgeWidth / 2} 
            y={scaleLength + 10} 
            fontSize="5"
            fill="black" 
            textAnchor="middle"
          >
            Escala: {formatMeasurement(scaleLength)} - {numFrets} trastes
          </text>
        </g>
      </svg>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6">Calculadora de Trastes para Instrumentos de Cuerda</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de controles */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Parámetros</h2>
          
          {/* Selector de unidades */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Unidades</label>
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded ${units === 'mm' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleUnitChange('mm')}
              >
                Milímetros (mm)
              </button>
              <button 
                className={`px-4 py-2 rounded ${units === 'inches' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleUnitChange('inches')}
              >
                Pulgadas (in)
              </button>
            </div>
          </div>
          
          {/* Longitud de escala */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Longitud de escala ({units})
            </label>
            <input
              type="number"
              step={units === 'mm' ? '1' : '0.01'}
              value={scaleLength}
              onChange={(e) => setScaleLength(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Estándar: Guitarra = {units === 'mm' ? '648mm / 25.5"' : '25.5" / 648mm'}, 
              Bajo = {units === 'mm' ? '864mm / 34"' : '34" / 864mm'}
            </p>
          </div>
          
          {/* Número de trastes */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Número de trastes</label>
            <input
              type="number"
              min="12"
              max="36"
              value={numFrets}
              onChange={(e) => setNumFrets(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Ancho del mástil */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Ancho en la cejuela ({units})
            </label>
            <input
              type="number"
              step={units === 'mm' ? '0.5' : '0.01'}
              value={neckWidth}
              onChange={(e) => setNeckWidth(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Ancho en el puente */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Ancho en el puente ({units})
            </label>
            <input
              type="number"
              step={units === 'mm' ? '0.5' : '0.01'}
              value={bridgeWidth}
              onChange={(e) => setBridgeWidth(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Grosor del traste */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Grosor del traste ({units})
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="3"
              value={fretThickness}
              onChange={(e) => setFretThickness(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Botones de descarga */}
          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={handleGenerateSVG}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Descargar SVG
            </button>
            <button
              onClick={handleGenerateDXF}
              className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Descargar DXF
            </button>
          </div>
        </div>
        
        {/* Vista previa y tabla de valores */}
        <div>
          {/* Vista previa SVG */}
          <div className="bg-white p-4 mb-4 rounded shadow overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">Vista Previa</h2>
            <div className="border p-2 bg-gray-100 flex justify-center" style={{ minHeight: '300px' }}>
              <div className="max-w-full h-full">
                {fretPositions.length > 0 && renderSvgPreview()}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Nota: La vista previa no está a escala real en pantalla. 
              Los archivos descargados sí mantendrán la escala correcta para impresión.
            </p>
          </div>
          
          {/* Tabla de mediciones */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Mediciones de Trastes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Traste</th>
                    <th className="px-4 py-2 text-left">Distancia</th>
                    <th className="px-4 py-2 text-left">Ancho</th>
                  </tr>
                </thead>
                <tbody>
                  {fretPositions.map((fret) => (
                    <tr key={fret.position} className="border-b">
                      <td className="px-4 py-2">
                        {fret.position === 0 ? 'Cejuela' : 
                         fret.position === numFrets + 1 ? 'Puente' : fret.position}
                      </td>
                      <td className="px-4 py-2">{formatMeasurement(fret.distance)}</td>
                      <td className="px-4 py-2">{formatMeasurement(fret.width)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Esta herramienta utiliza la fórmula estándar del temperamento igual (12ª raíz de 2) para calcular las posiciones de los trastes.</p>
        <p>Los archivos SVG generados están configurados a escala real 1:1 para impresión o fabricación.</p>
      </div>
    </div>
  );
};

export default FretCalculator;