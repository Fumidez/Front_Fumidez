import jsPDF from 'jspdf';
import JsPDFAutotable from 'jspdf-autotable'
import { consultarFotosIdInformeFachada } from './fotosHelper';


export const generateFachadaFotosPDF = async (informeId, doc) => {
    await generateFotos(informeId, doc)
}

export const generateFotosPDFData = async (informeId) => {
    const doc = new jsPDF('portrait', 'pt', 'a4'); // Orientación vertical
    await generateFotos(informeId, doc)
    doc.save(`Formulario_IPM_${informeId}.pdf`);

}

const generateFotos = async (informeId, doc) => {
   
   
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

    try {
        // Consulta las fotos asociadas al informe.
        const fotos = await consultarFotosIdInformeFachada(informeId);

        if (!fotos || fotos.length === 0) {
            throw new Error("No se encontraron fotos para este informe.");
        }

        const margin = 20; // Margen en el PDF
        const maxWidth = 175; // Máximo ancho de las fotos
        const maxHeight = 175; // Máximo alto de las fotos
        let x = margin + 15; // Coordenada X inicial
        let y = headerHeight +20; // Coordenada Y inicial
        const spacing = 20; // Espacio entre fotos

        fotos.forEach((foto, index) => {
            const base64Foto = foto.fotoBase64;

            if (x + maxWidth + margin > doc.internal.pageSize.width) {
                x = margin;
                y += maxHeight + spacing;
            }

            if (y + maxHeight + margin > doc.internal.pageSize.height) {
                doc.addPage();
                x = margin;
                y = margin;
            }
            const imageData = `data:image/jpeg;base64,${base64Foto}`;
            doc.addImage(base64Foto, 'JPEG', x, y, maxWidth, maxHeight);

            x += maxWidth + spacing;
        });


    } catch (error) {
        console.error("Error al generar las fotos para el PDF:", error);
    }
    doc.setFont("cambria", "normal");
    doc.setFontSize(12);
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
};
