import jsPDF from 'jspdf';
import JsPDFAutotable from 'jspdf-autotable'
import { consultarDesratizacionFachadaPorIdInforme } from '../helpers/desratizacionHelper';
import {
    consultarInformePorIdFachada


} from './InformeHelper';

export const generatePDFInformeFachada = async (informe) => {
    return await generatePDFData(informe)
}

export const InformeFachada = async (informe, doc) => {
    await generatePDF(informe, doc)
}

const generatePDFData = async (informe) => {
    const doc = new jsPDF('portrait', 'pt', 'a4');
    await generatePDF(informe, doc)
    doc.save(`informe_${informe.numFactura}.pdf`);
}

const generatePDF = async (informe, doc) => {
    //const doc = new jsPDF("portrait", "pt", "a4"); // Orientación vertical

    const headerHeight = 65;
    const footerHeight = 65;
    const pageWidth = doc.internal.pageSize.width;

    // Función para generar un degradado simulado entre dos colores
    const drawGradient = (
        doc,
        x,
        y,
        width,
        height,
        color1,
        color2,
        steps
    ) => {
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            const r = Math.floor(color1.r * (1 - ratio) + color2.r * ratio);
            const g = Math.floor(color1.g * (1 - ratio) + color2.g * ratio);
            const b = Math.floor(color1.b * (1 - ratio) + color2.b * ratio);

            doc.setFillColor(r, g, b);
            doc.rect(x + i * (width / steps), y, width / steps, height, "F");
        }
    };

    // Colores
    const white = { r: 255, g: 255, b: 255 };
    const blue = { r: 69, g: 150, b: 217 };
    // Anchos de las secciones del degradado
    const sectionWidth = pageWidth / 10; // Ancho de cada sección (10 partes)

    // Crear degradado en el encabezado
    drawGradient(doc, 0, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco
    drawGradient(
        doc,
        sectionWidth * 2,
        0,
        sectionWidth * 2.9,
        headerHeight,
        white,
        blue,
        50
    ); // 29% blanco a azul
    drawGradient(
        doc,
        sectionWidth * 4.9,
        0,
        sectionWidth * 0.2,
        headerHeight,
        blue,
        blue,
        50
    ); // 2% azul
    drawGradient(
        doc,
        sectionWidth * 5.1,
        0,
        sectionWidth * 2.9,
        headerHeight,
        blue,
        white,
        50
    ); // 29% azul a blanco
    drawGradient(
        doc,
        sectionWidth * 8,
        0,
        sectionWidth * 2,
        headerHeight,
        white,
        white,
        50
    ); // 20% blanco
    // Logo (ajusta la posición y tamaño según sea necesario)
    const logo = "src/assets/fumidez_logo.png"; // Reemplaza con la ruta de tu logo
    doc.addImage(logo, "PNG", 10, 14, 125, 40); // X, Y, Width, Height

    // Texto en el encabezado
    doc.setFont("cambria", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 0, 0);
    doc.text("INFORME I.P.M", pageWidth - 25, 30, null, null, "right");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255);
    doc.text(
        "MANEJO INTEGRADO DE PLAGAS",
        pageWidth - 25,
        50,
        null,
        null,
        "right"
    );

    doc.setDrawColor(32, 76, 130); // Color para la línea divisoria

    // División vertical
    doc.setLineWidth(0.75); // Cambia el valor para ajustar el grosor (2 es más grueso que el valor predeterminado)
    const divisionX = pageWidth / 5;
    doc.line(
        divisionX,
        headerHeight,
        divisionX,
        doc.internal.pageSize.height - footerHeight
    );

    // Imágenes en el lado izquierdo (ajustar rutas y posiciones)
    const image1 = "src/assets/CamaraComercio.png";
    const image2 = "src/assets/RegistroSanitario.png";
    const image3 = "src/assets/SAQ.png";
    const image4 = "src/assets/seal.png";
    const image5 = "src/assets/oms.png";

    doc.setTextColor(37, 123, 205);
    doc.setFont("cambria", "bold");
    doc.setFontSize(8);

    // Añadir imágenes con pie de imagen
    doc.addImage(image1, "PNG", 10, headerHeight + 40, 100, 40);
    doc.text("REG. MERCANTIL 18392", 10, headerHeight + 90);

    doc.addImage(image2, "PNG", -5, headerHeight + 135, 130, 80);
    doc.text("ARCSA-2020-12.3-0000320", 12, headerHeight + 215);

    doc.addImage(image3, "PNG", 10, headerHeight + 360, 100, 40);
    doc.text("MAEE-RA-2020-364760", 20, headerHeight + 410);

    doc.addImage(image4, "PNG", 28, headerHeight + 458, 60, 60);

    doc.addImage(image5, "PNG", 30, headerHeight + 573, 60, 60);

    doc.setFontSize(7);
    doc.text("UTILIZAMOS QUÍMICOS \nAPROBADOS POR \nEPA Y OMS", 20, 350);

    doc.setFontSize(8);
    doc.setFont("cambria", "normal");

    // Lado derecho de la división
    doc.text(
        `CLIENTE: ${informe.ordenDto.cliente.nombre}`,
        divisionX + 10,
        headerHeight + 20
    );
    doc.text(
        `FACTURA Nº: ${informe.numFactura}`,
        divisionX + 10,
        headerHeight + 40
    );
    doc.text(
        `AREA TRATADA: ${informe.ordenDto.area}`,
        divisionX + 10,
        headerHeight + 60
    );
    doc.text(
        `FECHA: ${informe.ordenDto.fecha.split("T")[0]}`,
        divisionX + 10,
        headerHeight + 80
    );
    // Definir posiciones y dimensiones
    const cuadroX = divisionX + 10; // Margen a la derecha de la línea divisoria
    const cuadroY = headerHeight + 90; // Posición Y ajustada hacia arriba
    const cuadroWidth = (pageWidth - divisionX) * 0.45; // Aproximadamente 45% del ancho restante
    const cuadroHeight = 130; // Altura ligeramente reducida
    const tablaWidth = pageWidth - cuadroX - 250; // Ancho definido para el cuadro

    // --- Agregar Cuadro "Tipo de servicio" ---

    let serviciosY = headerHeight + 30;
    let cabeceraTipoServicio = [
        { title: "TIPO DE SERVICIO", dataKey: "servicio" },
    ];
    let distanciaDerecha = cuadroX + 228;

    // Tabla para la cabecera (se mantiene en su posición)
    doc.autoTable({
        head: [cabeceraTipoServicio.map((col) => col.title)], // Título de la cabecera
        startY: serviciosY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "center", // Alineación a la izquierda
            fontSize: 12, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
            cellWidth: tablaWidth,
        },
        styles: {
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });

    const seleccion = informe.frecuencia;

    let datosTabla = [
        [
            seleccion === "MENSUAL" ? "X" : " ", // Marca si es MENSUAL
            seleccion === "BIMENSUAL" ? "X" : " ", // Marca si es BIMENSUAL
            seleccion === "TRIMESTRAL" ? "X" : " ", // Marca si es TRIMESTRAL
            seleccion === "OCASIONAL" ? "X" : " ", // Marca si es OCASIONAL
            " ", // Última celda vacía
        ],
        ["MENSUAL", "BIMENSUAL", "TRIMESTRAL", "OCASIONAL", "____"], // Segunda fila
    ];

    serviciosY = serviciosY + 20;

    doc.autoTable({
        body: datosTabla,
        startY: serviciosY,
        margin: { left: distanciaDerecha },
        theme: "grid",

        bodyStyles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 6,
            cellPadding: 3,
            halign: "center",
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.2 }, // Ancho de la primera columna (título de las áreas)
            1: { cellWidth: tablaWidth * 0.2 }, // Ancho de las columnas de calificación
            2: { cellWidth: tablaWidth * 0.2 },
            3: { cellWidth: tablaWidth * 0.2 },
            4: { cellWidth: tablaWidth * 0.2 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    // --- Agregar Cuadro "PLAGAS" ---
    let cabeceraPlagas = [
        { title: "Plagas", dataKey: "plagas" },
        { title: "Producto", dataKey: "producto" },
        { title: "Cantidad", dataKey: "cantidad" },
        { title: "Tiempo", dataKey: "tiempo" },
    ];

    let filasPlagas = [];
    if (Array.isArray(informe.plagaDtos)) {
        informe.plagaDtos.forEach((plaga) => {
            if (Array.isArray(plaga.cantidadProductoPlaga)) {
                let firstRow = true; // Para controlar cuándo escribir el nombre de la plaga
                plaga.cantidadProductoPlaga.forEach((producto) => {
                    filasPlagas.push([
                        firstRow ? plaga.tipoPlaga : "", // Solo poner el nombre de la plaga en la primera fila
                        producto.productoDto.nombre,
                        producto.cantidadProducto,
                        informe.tiempo,
                    ]);
                    firstRow = false; // Para las siguientes filas, dejar el campo vacío
                });
            }
        });
    }

    serviciosY = serviciosY + 40;

    doc.autoTable({
        head: [cabeceraPlagas.map((col) => col.title)], // Título de la cabecera
        body: filasPlagas,
        startY: serviciosY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "center", // Alineación a la izquierda
            fontSize: 10, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
            cellWidth: tablaWidth * 0.25,
        },
        bodyStyles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.25 },
            1: { cellWidth: tablaWidth * 0.25 },
            2: { cellWidth: tablaWidth * 0.25 },
            3: { cellWidth: tablaWidth * 0.25 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    let formularioY = serviciosY + filasPlagas.length * 15 + 30;
    let cabeceraFormulario = [
        {
            title: "IDENTIFICACIÓN Y RELACIÓN DEL CONTROL DE ROEDORES",
            dataKey: "servicio",
        },
    ];

    doc.autoTable({
        head: [cabeceraFormulario.map((col) => col.title)], // Título de la cabecera
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "center", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
            cellWidth: tablaWidth,
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    let formulariosIPM = await consultarDesratizacionFachadaPorIdInforme(informe.id);
    const datosFormulario = {
        ubicacion: "Formulario IPM",
        conSi: 0,
        conNo: 0,
        totalCeb: 0,
        rodentP: "",
        rodentC: "",
    };
    const datosFormularioCordon = {
        ubicacion: "Formulario Cordon",
        conSi: 0,
        conNo: 0,
        totalCeb: 0,
        rodentP: "",
        rodentC: "",
    };
    if (Array.isArray(formulariosIPM)) {
        formulariosIPM.forEach((formulario) => {
            if (formulario.tipoIdentificadorCordon) {
                if (formulario.consumo == "SI") {
                    datosFormulario.conSi += 1;
                } else {
                    datosFormulario.conNo += 1;
                }
                if (formulario.reemplazoPegaCebo == true) {
                    datosFormulario.rodentP = "X";
                } else {
                    datosFormulario.rodentC = "X";
                }
                datosFormulario.totalCeb += 1;
            } else {
                if (formulario.consumo == "SI") {
                    datosFormularioCordon.conSi += 1;
                } else {
                    datosFormularioCordon.conNo += 1;
                }
                if (formulario.reemplazoPegaCebo == true) {
                    datosFormularioCordon.rodentP = "X";
                } else {
                    datosFormularioCordon.rodentC = "X";
                }
                datosFormularioCordon.totalCeb += 1;
            }
        });
    }

    formularioY = formularioY + 25;

    doc.autoTable({
        head: [
            [
                "UBICACIÓN",
                "CON. SI",
                "CON. NO",
                "TOTAL CEB",
                "RODENT. PEGA",
                "RODENT. CB",
            ],
        ],
        body: [
            [
                datosFormulario.ubicacion,
                datosFormulario.conSi,
                datosFormulario.conNo,
                datosFormulario.totalCeb,
                datosFormulario.rodentP,
                datosFormulario.rodentC,
            ],
        ],
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "center", // Alineación a la izquierda
            fontSize: 5, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
        },
        bodyStyles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.3 },
            1: { cellWidth: tablaWidth * 0.14 },
            2: { cellWidth: tablaWidth * 0.14 },
            3: { cellWidth: tablaWidth * 0.14 },
            4: { cellWidth: tablaWidth * 0.14 },
            5: { cellWidth: tablaWidth * 0.14 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    cabeceraFormulario = [
        { title: "CORDON SANITARIO ESTRUCTURAL", dataKey: "servicio" },
    ];
    formularioY = formularioY + 34;

    doc.autoTable({
        head: [cabeceraFormulario.map((col) => col.title)], // Título de la cabecera
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "center", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
            cellWidth: tablaWidth,
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    formularioY = formularioY + 17;

    doc.autoTable({
        head: [
            [
                "UBICACIÓN",
                "CON. SI",
                "CON. NO",
                "TOTAL CEB",
                "RODENT. PEGA",
                "RODENT. CB",
            ],
        ],
        body: [
            [
                "GUARDIANÍA",
                datosFormularioCordon.conSi,
                datosFormularioCordon.conNo,
                datosFormularioCordon.totalCeb,
                datosFormularioCordon.rodentP,
                datosFormularioCordon.rodentC,
            ],
            [
                "GRAN TOTAL:",
                datosFormularioCordon.conSi + datosFormulario.conSi,
                datosFormularioCordon.conNo + datosFormulario.conNo,
                datosFormularioCordon.totalCeb + datosFormulario.totalCeb,
                "",
                "",
            ],
        ],
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "center", // Alineación a la izquierda
            fontSize: 5, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
        },
        bodyStyles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.3 },
            1: { cellWidth: tablaWidth * 0.14 },
            2: { cellWidth: tablaWidth * 0.14 },
            3: { cellWidth: tablaWidth * 0.14 },
            4: { cellWidth: tablaWidth * 0.14 },
            5: { cellWidth: tablaWidth * 0.14 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    formularioY = formularioY + 60;
    let cant_si = datosFormularioCordon.conSi + datosFormulario.conSi;
    let cant_total = datosFormularioCordon.totalCeb + datosFormulario.totalCeb;
    let porcentaje = 0; // Valor por defecto si `cant_total` es 0
    if (cant_total !== 0) {
        porcentaje = (cant_si * 100) / cant_total;
    }

    doc.autoTable({
        head: [
            [
                "INDICADOR DEL RIESGO",
                "BAJO 0 al 14%",
                "MEDIO 15 al 30%",
                "ALTO sup al 30%",
            ],
        ],
        body: [["TOTAL SI X 100 \n___________\n TOTAL CEB. ",
            porcentaje != 0 && porcentaje < 14 ? "X" : "",
            porcentaje >= 15 && porcentaje < 30 ? "X" : "",
            porcentaje > 30 ? "X" : ""]],
        startY: formularioY, // Posición Y donde empieza la tabla
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "center", // Alineación a la izquierda
            fontSize: 5, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
        },
        bodyStyles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5, // Ancho de las líneas
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.52 },
            1: { cellWidth: tablaWidth * 0.16 },
            2: { cellWidth: tablaWidth * 0.16 },
            3: { cellWidth: tablaWidth * 0.16 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });
    // --- Agregar Cuadro "Recomendaciones" ---

    // Definir posiciones y dimensiones para el nuevo cuadro "Recomendaciones"
    const cabecera = [
        { title: "RECOMENDACIONES:", dataKey: "recomendacion" },
    ];
    const text = [{ recomendacion: informe.recomendaciones }];
    doc.autoTable({
        head: [cabecera.map((col) => col.title)], // Título de la cabecera
        body: text.map((item) => [item.recomendacion]), // Datos del cuerpo de la tabla
        startY: formularioY + 60,
        margin: { left: distanciaDerecha },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "left",
            fontSize: 10, // Tamaño de la fuente para la cabecera
        },
        styles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 7, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
        },
        columnStyles: {
            0: {
                // Define las propiedades de la primera columna
                cellWidth: tablaWidth, // Limita el ancho de la columna
                lineColor: [37, 123, 205],
                lineWidth: 0.5
            },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    // --- Agregar Cuadro "SANITIZACION CONFIDENCIAL" ---

    doc.autoTable({
        head: [["SANITIZACION CONFIDENCIAL"]], // Título principal
        body: [["1. EXCELENTE  2. BUENO  3. REGULAR  4. CRÍTICO"]],
        startY: cuadroY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255], // Color de la cabecera
            textColor: [37, 123, 205],
            halign: "center",
            fontSize: 10, // Tamaño de la fuente para la cabecera
            lineColor: [37, 123, 205],
        },
        bodyStyles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
            lineColor: [37, 123, 205],
        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5
        },
        columnStyles: {
            0: { cellWidth: tablaWidth }, // Ancho de la primera columna (título de las áreas)
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });

    datosTabla = [
        ["AREAS INTERNAS", informe.sanitizacionConfidencialDto.areaInterna == 1 ? "X" : "1" ,
            informe.sanitizacionConfidencialDto.areaInterna == 2 ? "X" : "2",
            informe.sanitizacionConfidencialDto.areaInterna == 3 ? "X" : "3",
            informe.sanitizacionConfidencialDto.areaInterna == 4 ? "X" : "4"], // Primera fila
        ["AREAS EXTERNAS",  informe.sanitizacionConfidencialDto.areaExterna == 1 ? "X" : "1" ,
            informe.sanitizacionConfidencialDto.areaExterna == 2 ? "X" : "2",
            informe.sanitizacionConfidencialDto.areaExterna == 3 ? "X" : "3",
            informe.sanitizacionConfidencialDto.areaExterna == 4 ? "X" : "4"], // Segunda fila
        [
            informe.sanitizacionConfidencialDto.areaNombreOpc1
                ? informe.sanitizacionConfidencialDto.areaNombreOpc1
                : "AREA",
                informe.sanitizacionConfidencialDto.areaOpc1 == 1 ? "X" : "1" ,
                informe.sanitizacionConfidencialDto.areaOpc1 == 2 ? "X" : "2",
                informe.sanitizacionConfidencialDto.areaOpc1 == 3 ? "X" : "3",
                informe.sanitizacionConfidencialDto.areaOpc1 == 4 ? "X" : "4"], // Tercera fila
        [
            informe.sanitizacionConfidencialDto.areaNombreOpc2
                ? informe.sanitizacionConfidencialDto.areaNombreOpc2
                : "AREA", informe.sanitizacionConfidencialDto.areaOpc2 == 1 ? "X" : "1" ,
                informe.sanitizacionConfidencialDto.areaOpc2 == 2 ? "X" : "2",
                informe.sanitizacionConfidencialDto.areaOpc2 == 3 ? "X" : "3",
                informe.sanitizacionConfidencialDto.areaOpc2 == 4 ? "X" : "4"], // Cuarta fila
    ];

    doc.autoTable({
        body: datosTabla,
        startY: cuadroY + 32, // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: "grid",

        bodyStyles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 6, // Tamaño de la fuente para el contenido
            cellPadding: 3, // Espacio interno de las celdas
            halign: "center", // Alineación horizontal del contenido
            lineColor: [37, 123, 205],

        },
        styles: {
            cellWidth: "wrap", // Ajusta el ancho de las celdas al contenido
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [37, 123, 205],
            lineWidth: 0.5
        },
        columnStyles: {
            0: { cellWidth: tablaWidth * 0.6, halign: "left" }, // Ancho de la primera columna (título de las áreas)
            1: { cellWidth: tablaWidth * 0.1 }, // Ancho de las columnas de calificación
            2: { cellWidth: tablaWidth * 0.1 },
            3: { cellWidth: tablaWidth * 0.1 },
            4: { cellWidth: tablaWidth * 0.1 },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });
 // --- Agregar Cuadro "Observaciones" ---

// Definir posiciones y dimensiones para el nuevo cuadro
const observacionesY = cuadroY + 95; // Posición Y donde empieza el cuadro
const observacionesHeight = 130; // Altura fija para el cuadro de observaciones
doc.setDrawColor(37, 123, 205); // Color de la línea (RGB)
doc.setLineWidth(0.5);
// Dibuja el cuadro principal
doc.rect(cuadroX, observacionesY, tablaWidth, observacionesHeight); // Cuadro externo

// Añade el texto dentro del cuadro
const cabeceraObservacion = [
    { title: "OBSERVACIONES", dataKey: "observacion" },
];
const textObservacion = [{ observacion: informe.observacion || "" }]; // Asegúrate de que siempre haya un valor

doc.autoTable({
    head: [cabeceraObservacion.map((col) => col.title)], // Título de la cabecera
    body: textObservacion.map((item) => [item.observacion]), // Datos del cuerpo de la tabla
    startY: observacionesY + 5, // Añade un margen de 5 debajo del cuadro principal
    margin: { left: cuadroX + 2 }, // Margen izquierdo ajustado
    theme: "plain", // Tema sin bordes internos
    headStyles: {
        font: "Cambria",
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [37, 123, 205], // Color del texto
        halign: "center", // Alineación central del texto
        fontSize: 10, // Tamaño de la fuente
        cellPadding: 0, // Sin relleno interno para evitar sobreposición
    },
    styles: {
        textColor: [37, 123, 205],
        font: "Cambria",
        fontSize: 8, // Tamaño de la fuente del contenido
        cellPadding: 3, // Espaciado interno para el contenido
        overflow: "linebreak", // Permitir saltos de línea
    },
    columnStyles: {
        0: {
            cellWidth: tablaWidth - 4, // Ajusta el ancho para evitar bordes
            valign: "top", // Alineación superior
        },
    },
    tableWidth: tablaWidth - 4, // Mantener dentro del cuadro principal
});


    // --- Agregar Cuadro "Procedimientos" ---

    // Definir posiciones y dimensiones para el cuadro "Procedimientos"
    let procedimientosY = observacionesY + observacionesHeight + 10; // 10 puntos de margen debajo del cuadro de observaciones
    const procedimientosHeight = 180; // Altura ajustada para acomodar las categorías y procedimientos

    // Añade la tabla dentro del cuadro
    let cabeceraProcedimiento = [
        { title: "PROCEDIMIENTOS:", dataKey: "procedimiento" },
    ];
    const textProcedimiento = [{ procedimiento: informe.procedimientos }];
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera

        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "left",
            cellWidth: tablaWidth,
            fontSize: 10, // Tamaño de la fuente para la cabecera
        },
        styles: {
            fontSize: 5, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
        },

        tableWidth: "wrap", // Ajusta la tabla al contenido
    });
    procedimientosY = procedimientosY + 17;
    cabeceraProcedimiento = [
        { title: "DESINSECTACION / FUMIGACION", dataKey: "procedimiento" },
    ];
    // Tabla para la cabecera (se mantiene en su posición)
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "left", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
        },
        styles: {
            lineColor: [0, 0, 0, 0], // Bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: tablaWidth }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });
    procedimientosY = doc.lastAutoTable.finalY; // Ajustamos la posición Y después de la cabecera



    const datosProcedimientos = {
        nebulizador: "",
        aspersor: "",
        uvl: "",
        mecanico: "",
        lamparas: "",
        biomonitores: "",
        estaciones: "",
        cordon: "",
        nUvl: "",
        nMEc: "",
        sanitizacion: "",
    };

    if (Array.isArray(informe.procedimientoDtos)) {
        informe.procedimientoDtos.forEach((informe) => {
            if (informe.tipoProcedimiento == 0) {
                datosProcedimientos.nebulizador = "X";
            }
            if (informe.tipoProcedimiento == 1) {
                datosProcedimientos.aspersor = "X";
            }
            if (informe.tipoProcedimiento == 2) {
                datosProcedimientos.uvl = "X";
            }
            if (informe.tipoprocedimiento == 3) {
                datosProcedimientos.mecanico = "X";
            }
            if (informe.tipoProcedimiento == 4) {
                datosProcedimientos.lamparas = "X";
            }
            if (informe.tipoProcedimiento == 5) {
                datosProcedimientos.biomonitores = "X";
            }
            if (informe.tipoProcedimiento == 6) {
                datosProcedimientos.estaciones = "X";
            }
            if (informe.tipoProcedimiento == 7) {
                datosProcedimientos.cordon = "X";
            }
            if (informe.tipoProcedimiento == 8) {
                datosProcedimientos.nUvl = "X";
            }
            if (informe.tipoProcedimiento == 9) {
                datosProcedimientos.nMEc = "X";
            }
            if (informe.tipoprocedimiento == 10) {
                datosProcedimientos.sanitizacion = "X";
            }
        });
    }
    // Tabla para el contenido (cuerpo)
    doc.autoTable({
        body: [
            [datosProcedimientos.nebulizador, "NEBULIZADOR TÉRMICO"], // Primera fila
            [datosProcedimientos.aspersor, "ASPERSOR MANUAL"], // Segunda fila
            [datosProcedimientos.uvl, "NEBULIZADOR UVL ELÉCTRICO DIINA FOG"], // Tercera fila
            [datosProcedimientos.mecanico, "NEBULIZADOR MECÁNICO"], // Cuarta fila
            [
                datosProcedimientos.lamparas,
                "LÁMPARAS ELECTROCUTADORAS/ATRAPADORAS",
            ], // Quinta fila
        ],
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 }, // Mueve el cuerpo 20 unidades más a la derecha
        theme: "grid",
        styles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 5, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 0, 0, 0], // Hace los bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: 15 }, // Ancho para la primera columna
            1: { cellWidth: tablaWidth - 45 }, // Ancho ajustado para la segunda columna
        },
        tableWidth: "wrap",
    });

    procedimientosY = procedimientosY + 80;
    cabeceraProcedimiento = [
        { title: "DESRATIZACIÓN", dataKey: "procedimiento" },
    ];
    // Tabla para la cabecera (se mantiene en su posición original)
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "left", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
        },
        styles: {
            lineColor: [0, 0, 0, 0], // Bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: tablaWidth - 30 }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });

    // Ajustamos el valor Y para el contenido y agregamos más margen a la izquierda para el cuerpo
    procedimientosY = doc.lastAutoTable.finalY; // Ajustamos la posición Y después de la cabecera

    // Tabla para el contenido (cuerpo)
    doc.autoTable({
        body: [
            [datosProcedimientos.biomonitores, "BIOMONITORES PEGABLES"], // Sexta fila
            [datosProcedimientos.estaciones, "ESTACIONES DE CEBADO"], // Séptima fila
            [datosProcedimientos.cordon, "CORDÓN SANITARIO PERIMETRAL"], // Octava fila
        ],
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 }, // Mueve el cuerpo 20 unidades más a la derecha
        theme: "grid",
        styles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 5, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 0, 0, 0], // Hace los bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: 15 }, // Ancho para la primera columna
            1: { cellWidth: tablaWidth - 45 }, // Mantiene el ancho del cuerpo
        },
        tableWidth: "wrap",
    });

    procedimientosY = procedimientosY + 45;
    cabeceraProcedimiento = [
        { title: "DESINFECCIÓN", dataKey: "procedimiento" },
    ];
    // Tabla para la cabecera (se mantiene en su posición original)
    doc.autoTable({
        head: [cabeceraProcedimiento.map((col) => col.title)], // Título de la cabecera
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX }, // La cabecera se queda en la posición original
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "left", // Alineación a la izquierda
            fontSize: 8, // Tamaño de la fuente para la cabecera
        },
        styles: {
            lineColor: [0, 0, 0, 0], // Bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: tablaWidth - 30 }, // Mantiene el ancho de la cabecera
        },
        tableWidth: "wrap",
    });

    // Ajustamos el valor Y para el contenido y agregamos más margen a la izquierda para el cuerpo
    procedimientosY = doc.lastAutoTable.finalY; // Ajustamos la posición Y después de la cabecera

    // Tabla para el contenido (cuerpo)
    doc.autoTable({
        body: [
            [datosProcedimientos.nUvl, "NEBULIZADOR UVL ELECTRICO"], // Novena fila
            [datosProcedimientos.nMEc, "NEBULIZADOR MECÁNICO"], // Décima fila
            [datosProcedimientos.sanitizacion, "SANITIZACIÓN"], // Undécima fila
        ],
        startY: procedimientosY, // Posición Y donde empieza la tabla
        margin: { left: cuadroX + 30 }, // Mueve el cuerpo 20 unidades más a la derecha
        theme: "grid",
        styles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 5, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
            lineColor: [0, 0, 0, 0], // Hace los bordes transparentes
        },
        columnStyles: {
            0: { cellWidth: 15 }, // Ancho para la primera columna
            1: { cellWidth: tablaWidth - 45 }, // Mantiene el ancho del cuerpo
        },
        tableWidth: "wrap",
    });

    // --- Agregar Cuadro "Recomendaciones" ---

    // Definir posiciones y dimensiones para el nuevo cuadro "Recomendaciones"
    const recomendacionesY = procedimientosY + 40; // 10 puntos de margen debajo del cuadro de procedimientos
    const recomendacionesHeight = 60; // Altura del nuevo cuadro

   /* const cabecera = [
        { title: "RECOMENDACIONES:", dataKey: "recomendacion" },
    ];
    const text = [{ recomendacion: informe.recomendaciones }];
    doc.autoTable({
        head: [cabecera.map((col) => col.title)], // Título de la cabecera
        body: text.map((item) => [item.recomendacion]), // Datos del cuerpo de la tabla
        startY: recomendacionesY + 10,
        margin: { left: cuadroX },
        theme: "grid",
        headStyles: {
            font: "Cambria",
            fillColor: [255, 255, 255],
            textColor: [37, 123, 205],
            halign: "left",
            fontSize: 10, // Tamaño de la fuente para la cabecera
        },
        styles: {
            textColor: [37, 123, 205],
            font: "Cambria",
            fontSize: 7, // Tamaño de la fuente para el contenido
            cellPadding: 5,
            overflow: "linebreak", // Permitir saltos de línea en las celdas
        },
        columnStyles: {
            0: {
                // Define las propiedades de la primera columna
                cellWidth: pageWidth - cuadroX - 20, // Limita el ancho de la columna
                lineColor: [37, 123, 205],
                lineWidth: 0.5
            },
        },
        tableWidth: "wrap", // Ajusta la tabla al contenido
    });
*/
    // --- Agregar Sección "Firma Supervisor" ---

    // Definir posiciones y dimensiones para la firma
    const firmaY = recomendacionesY + recomendacionesHeight + 60; // 20 puntos de margen debajo del cuadro de recomendaciones
    const firmaLineWidth = 170; // Ancho de la línea de firma
    const firmaLineX = (pageWidth - firmaLineWidth) / 2; // Centrar la línea horizontalmente
    const firmaLineY = firmaY; // Posición Y de la línea

    // Dibujar la línea para la firma
    doc.setLineWidth(1);
    doc.line(
        firmaLineX ,
        firmaLineY,
        firmaLineX + firmaLineWidth,
        firmaLineY
    ); // Línea horizontal

    // Agregar el texto "Firma Supervisor" debajo de la línea
    doc.setFont("cambria", "normal");
    doc.setFontSize(12);
    doc.text("Firma Supervisor", pageWidth / 2, firmaLineY + 15, {
        align: "center",
    });

    // --- Pie de página con degradado (blanco -> azul -> blanco) ---
    drawGradient(
        doc,
        0,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
    ); // 20% blanco
    drawGradient(
        doc,
        sectionWidth * 2,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        white,
        blue,
        50
    ); // 29% blanco a azul
    drawGradient(
        doc,
        sectionWidth * 4.9,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 0.2,
        footerHeight,
        blue,
        blue,
        50
    ); // 2% azul
    drawGradient(
        doc,
        sectionWidth * 5.1,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        blue,
        white,
        50
    ); // 29% azul a blanco
    drawGradient(
        doc,
        sectionWidth * 8,
        doc.internal.pageSize.height - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
    ); // 20% blanco
    const webIcon = "src/assets/web.png"; // Ruta al icono del sitio web
    const emailIcon = "src/assets/mail.png"; // Ruta al icono de correo
    const locationIcon = "src/assets/home.png"; // Ruta al icono de ubicación
    const phoneIcon = "src/assets/phone.png"; // Ruta al icono de teléfono
    const whatsappIcon = "src/assets/whatsapp.png"; // Ruta al icono de WhatsApp

    // Añadir textos con iconos
    const footerY = doc.internal.pageSize.height - footerHeight + 20;

    // Sitio web
    doc.addImage(webIcon, "PNG", 30, footerY - 5, 10, 10); // Ajusta el tamaño y posición
    doc.text("www.fumidez.com", 50, footerY);

    // Correo electrónico
    doc.addImage(emailIcon, "PNG", 30, footerY + 15 - 5, 10, 10);
    doc.text("fumidezplagas@gmail.com", 50, footerY + 15);

    // Dirección
    doc.addImage(locationIcon, "PNG", 30, footerY + 30 - 5, 10, 10);
    doc.text(
        "Matriz Quito: Urb. Caminos del Sur. Pasaje 6 Casa Oe 10-23 y Julián Estrella",
        50,
        footerY + 30
    );

    // Teléfonos
    doc.addImage(
        phoneIcon,
        "PNG",
        doc.internal.pageSize.width - 80 - 15,
        footerY - 5,
        10,
        10
    );
    doc.text("02 262 0298", doc.internal.pageSize.width - 80, footerY);

    // WhatsApp
    doc.addImage(
        whatsappIcon,
        "PNG",
        doc.internal.pageSize.width - 80 - 15,
        footerY + 15 - 5,
        10,
        10
    );
    doc.text("099 995 4079", doc.internal.pageSize.width - 80, footerY + 15);

    // Guardar PDF
    //doc.save(`informe_${informe.numFactura}.pdf`);
}