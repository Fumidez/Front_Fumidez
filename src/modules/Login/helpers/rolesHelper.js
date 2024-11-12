export const comprobarTipoUsuario = () =>{
    const tipoUsuario = localStorage.getItem('userType');

    if(tipoUsuario){
     return tipoUsuario;
    }else{
        return '';
    }
  }