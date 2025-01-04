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
    try {
        // Consulta las fotos asociadas al informe.
        const fotos = await consultarFotosIdInformeFachada(informeId);

        if (!fotos || fotos.length === 0) {
            throw new Error("No se encontraron fotos para este informe.");
        }

        const margin = 20; // Margen en el PDF
        const maxWidth = 150; // Máximo ancho de las fotos
        const maxHeight = 150; // Máximo alto de las fotos
        let x = margin; // Coordenada X inicial
        let y = margin; // Coordenada Y inicial
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
};
