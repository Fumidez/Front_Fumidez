import jsPDF from 'jspdf';
import JsPDFAutotable from 'jspdf-autotable'
import { InformeFachada } from "./generarInforme";
import { formularioIPMFachada } from './generarInformeIPM';


//Se debe mandar el informe dtto, no el normal
export const generateFormularioCompletoFachada = async (informe) => {
    return await generateFormularioCompleto(informe)
}

const generateFormularioCompleto = async (informe) => {
  const doc = new jsPDF('portrait', 'pt', 'a4'); 
  await InformeFachada(informe, doc)
  doc.addPage();
  await formularioIPMFachada(informe, doc)
  doc.save(`Formulario_IPM_${informe.numFactura}.pdf`);
}
