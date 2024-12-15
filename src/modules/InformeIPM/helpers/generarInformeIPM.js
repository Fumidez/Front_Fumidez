import jsPDF from 'jspdf';
import JsPDFAutotable from 'jspdf-autotable'

export const generateFormularioIPMFachada = async (informe) => {
    return await generateFormularioIPM(informe)
}

const generateFormularioIPM = async (informe) => {
    const doc = new jsPDF('portrait', 'pt', 'a4'); // Orientación vertical

    const headerHeight = 65;
    const footerHeight = 65;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Función para generar un degradado simulado entre dos colores
    const drawGradient = (doc, x, y, width, height, color1, color2, steps) => {
      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const r = Math.floor(color1.r * (1 - ratio) + color2.r * ratio);
        const g = Math.floor(color1.g * (1 - ratio) + color2.g * ratio);
        const b = Math.floor(color1.b * (1 - ratio) + color2.b * ratio);

        doc.setFillColor(r, g, b);
        doc.rect(x + (i * (width / steps)), y, width / steps, height, 'F');
      }
    };

    // Colores
    const white = { r: 255, g: 255, b: 255 };
    const blue = { r: 69, g: 150, b: 217 };
    // Anchos de las secciones del degradado
    const sectionWidth = pageWidth / 10; // Ancho de cada sección (10 partes)

    // --- Encabezado ---
    // Crear degradado en el encabezado
    drawGradient(doc, 0, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco
    drawGradient(doc, sectionWidth * 2, 0, sectionWidth * 2.9, headerHeight, white, blue, 50); // 29% blanco a azul
    drawGradient(doc, sectionWidth * 4.9, 0, sectionWidth * 0.2, headerHeight, blue, blue, 50); // 2% azul
    drawGradient(doc, sectionWidth * 5.1, 0, sectionWidth * 2.9, headerHeight, blue, white, 50); // 29% azul a blanco
    drawGradient(doc, sectionWidth * 8, 0, sectionWidth * 2, headerHeight, white, white, 50); // 20% blanco

    // Logo (ajusta la posición y tamaño según sea necesario)
    const logo = 'src/assets/fumidez_logo.png'; // Reemplaza con la ruta de tu logo
    // Asegúrate de que las imágenes estén en base64 o accesibles
    // Puedes usar una promesa para cargar imágenes si es necesario
    doc.addImage(logo, 'PNG', 10, 14, 125, 40); // X, Y, Width, Height

    // Texto en el encabezado
    doc.setFont('cambria', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 0, 0);
    doc.text('FORMULARIO I.P.M', pageWidth - 25, 30, null, null, 'right');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255);

    doc.setDrawColor(32, 76, 130); // Color para la línea divisoria


    // Títulos centrados
    doc.setFont('cambria', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Color negro
    const titulo1 = 'FORMULARIO IPM';
    doc.setFontSize(10);
    const titulo2 = 'MANEJO DE ROEDORES';
    const tituloY = headerHeight + 40;

    doc.text(titulo1, pageWidth / 2, tituloY, { align: 'center' });
    doc.text(titulo2, pageWidth / 2, tituloY + 30, { align: 'center' });

    // --- Información del Cliente ---
    doc.setFont('cambria', 'normal');
    doc.setFontSize(8);
    const infoYStart = tituloY + 60;
    const infoX = 50; // Margen izquierdo

    doc.text(`Cliente: ${informe.ordenDto.cliente.nombre}`, infoX, infoYStart);
    doc.text(`FECHA DE TRABAJO REALIZADO: ${informe.ordenDto.fecha}`, infoX, infoYStart + 20);
    doc.text(`AREA TRATADA: ${informe.ordenDto.area}`, infoX, infoYStart + 40);


    let formulariosIPM = await this.cargarInformesPorId(informe.id);
    console.log("Formularios IPM cargados:", formulariosIPM);

    if (Array.isArray(formulariosIPM)) {
      // Crear el array 'body' para almacenar las filas de la tabla
      const bodyData = formulariosIPM.map((formulario) => {
        let datosFormulario = {
          consumoDaño: formulario.consumo === 'DAÑO' ? 'X' : '', // Aquí añadimos consumoDaño
          consumoSi: formulario.consumo === 'SI' ? 'X' : '',
          consumoNo: formulario.consumo !== 'SI' ? 'X' : '',
          reemplazoP: formulario.reemplazoPegaCebo ? 'X' : '',
          reemplazoCB: !formulario.reemplazoPegaCebo ? 'X' : '',
          cspS: formulario.csp === 'SUMIDERO' ? 'X' : '',
          cspCR: formulario.csp === 'CAJA DE REVISION' ? 'X' : '',
          cspDE: formulario.csp !== 'SUMIDERO' && formulario.csp !== 'CAJA DE REVISION' ? 'X' : ''
        };

        // Retornar la fila con los datos correspondientes
        return [
          formulario.id,
          datosFormulario.consumoDaño || '', // Daño
          datosFormulario.consumoSi,       // SI
          datosFormulario.consumoNo,       // NO
          formulario.ubicacion || '',      // Ubicación
          formulario.observaciones || '',  // Observaciones
          datosFormulario.reemplazoP,      // P
          datosFormulario.reemplazoCB,     // CB
          datosFormulario.cspS,            // S
          datosFormulario.cspCR,           // CR
          datosFormulario.cspDE            // DE
        ];
      });
      let formularioY1 = tituloY + 120;
      doc.autoTable({
        head: [
          [
            { content: 'N° EST. DE CEBADO', rowSpan: 2 },
            { content: 'CONSUMO', colSpan: 3, styles: { halign: 'center' } },
            { content: 'UBICACIÓN', rowSpan: 2, fontSize: 10 },
            { content: 'OBSERVACIONES', rowSpan: 2 },
            { content: 'REEMPLAZO', colSpan: 2, styles: { halign: 'center' } },
            { content: 'C.S.P', colSpan: 3, styles: { halign: 'center' } }
          ],
          [
            'DAÑO', 'SI', 'NO', 'P', 'CB', 'S', 'CR', 'DE'
          ]
        ],
        body: bodyData, // Aquí se pasa el array de datos
        startY: formularioY1,
        margin: { left: 40, right: 10 }, // Márgenes para ajustar la tabla al ancho de la página
        theme: 'grid',
        headStyles: {
          font: 'Cambria',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          halign: 'center',
          fontSize: 5,
          lineColor: [0, 0, 0]
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          font: 'Cambria',
          fontSize: 6,
          cellPadding: 3,
          halign: 'center'
        },
        styles: {
          cellWidth: 'auto',
          overflow: 'linebreak',
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        tableWidth: 'wrap', // Ajustar la tabla para que se ajuste al ancho de la página
        columnStyles: {
          0: { cellWidth: 12 + 20 },  // Ajuste del ancho para la columna de Nº
          1: { cellWidth: 5 + 20 },  // Ajuste del ancho para EST. DE CEBADO
          2: { cellWidth: 5 + 20 },  // Ajuste del ancho para CONSUMO DAÑO
          3: { cellWidth: 5 + 20 },  // Ajuste del ancho para CONSUMO SI
          4: { cellWidth: 100 + 20 },  // Ajuste del ancho para CONSUMO NO
          5: { cellWidth: 110 + 20 },  // Ajuste del ancho para UBICACIÓN
          6: { cellWidth: 5 + 20 },  // Ajuste del ancho para OBSERVACIONES
          7: { cellWidth: 5 + 20 },  // Ajuste del ancho para REEMPLAZO P
          8: { cellWidth: 5 + 20 },  // Ajuste del ancho para REEMPLAZO CB
          9: { cellWidth: 5 + 20 },  // Ajuste del ancho para REEMPLAZO S
          10: { cellWidth: 5 + 20 }, // Ajuste del ancho para REEMPLAZO C.R
          11: { cellWidth: 5 + 20 }, // Ajuste del ancho para REEMPLAZO D.E
          12: { cellWidth: 5 + 20 }, // Ajuste del ancho para C.S.P
          13: { cellWidth: 5 + 20 }, // Ajuste del ancho para C.S.P CB
          14: { cellWidth: 5 + 20 }, // Ajuste del ancho para C.S.P S
        }
      });

      // --- Pie de página ---
      // Crear degradado en el pie de página
      drawGradient(
        doc,
        0,
        pageHeight - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
      ); // 20% blanco
      drawGradient(
        doc,
        sectionWidth * 2,
        pageHeight - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        white,
        blue,
        50
      ); // 29% blanco a azul
      drawGradient(
        doc,
        sectionWidth * 4.9,
        pageHeight - footerHeight,
        sectionWidth * 0.2,
        footerHeight,
        blue,
        blue,
        50
      ); // 2% azul
      drawGradient(
        doc,
        sectionWidth * 5.1,
        pageHeight - footerHeight,
        sectionWidth * 2.9,
        footerHeight,
        blue,
        white,
        50
      ); // 29% azul a blanco
      drawGradient(
        doc,
        sectionWidth * 8,
        pageHeight - footerHeight,
        sectionWidth * 2,
        footerHeight,
        white,
        white,
        50
      ); // 20% blanco

      const webIcon = 'src/assets/web.png'; // Ruta al icono del sitio web
      const emailIcon = 'src/assets/mail.png'; // Ruta al icono de correo
      const locationIcon = 'src/assets/home.png'; // Ruta al icono de ubicación
      const phoneIcon = 'src/assets/phone.png'; // Ruta al icono de teléfono
      const whatsappIcon = 'src/assets/whatsapp.png'; // Ruta al icono de WhatsApp

      // Añadir textos con iconos
      const footerY = pageHeight - footerHeight + 20;

      // Sitio web
      doc.addImage(webIcon, 'PNG', 30, footerY - 5, 10, 10); // Ajusta el tamaño y posición
      doc.text('www.fumidez.com', 50, footerY);

      // Correo electrónico
      doc.addImage(emailIcon, 'PNG', 30, footerY + 15 - 5, 10, 10);
      doc.text('fumidezplagas@gmail.com', 50, footerY + 15);

      // Dirección
      doc.addImage(locationIcon, 'PNG', 30, footerY + 30 - 5, 10, 10);
      doc.text(
        'Matriz Quito: Urb. Caminos del Sur. Pasaje 6 Casa Oe 10-23 y Julián Estrella',
        50,
        footerY + 30
      );

      // Teléfonos
      doc.addImage(phoneIcon, 'PNG', pageWidth - 80 - 15, footerY - 5, 10, 10);
      doc.text('02 262 0298', pageWidth - 80, footerY);

      // WhatsApp
      doc.addImage(whatsappIcon, 'PNG', pageWidth - 80 - 15, footerY + 15 - 5, 10, 10);
      doc.text('099 995 4079', pageWidth - 80, footerY + 15);

      // --- Guardar PDF ---
      doc.save(`Formulario_IPM_${informe.numFactura}.pdf`);
    }

  }