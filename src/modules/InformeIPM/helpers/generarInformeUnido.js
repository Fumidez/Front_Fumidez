import jsPDF from 'jspdf';
import JsPDFAutotable from 'jspdf-autotable'
import { InformeFachada } from "./generarInforme";
import { formularioIPMFachada } from './generarInformeIPM';
import { generateFachadaFotosPDF } from './formatoFotos';

//Se debe mandar el informe dtto, no el normal
export const generateFormularioCompletoFachada = async (informe) => {
    return await generateFormularioCompleto(informe)
}

const generateFormularioCompleto = async (informe) => {
  const doc = new jsPDF('portrait', 'pt', 'a4'); 
  await InformeFachada(informe, doc)
  doc.addPage();
  await generateFachadaFotosPDF(informe.id, doc)
  doc.addPage();
  await formularioIPMFachada(informe, doc)
  doc.save(`Informe_IPM_Final_${informe.numFactura}.pdf`);
}
