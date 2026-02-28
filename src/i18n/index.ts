import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        title: 'QR INFO SYSTEM',
        subtitle: 'Project Information Encoder',
      },
      form: {
        title: 'Generate QR Code',
        subtitle: 'Encode project information',
        project_label: 'Project Name',
        project_placeholder: 'Enter project name',
        manager_label: 'Manager',
        manager_placeholder: 'Enter manager name',
        description_label: 'Description',
        description_placeholder: 'Enter project description',
        required: 'This field is required',
        chars: 'chars',
        qr_section: 'QR code will appear here',
        qr_hint: 'Scan to read encoded data or copy payload text',
        payload_label: 'Encoded payload',
        status_ready: 'READY',
        status_encoding: 'ENCODING',
        status_complete: 'COMPLETE',
        generate_btn: 'Generate QR',
        reset_btn: 'Reset',
        download_btn: 'Download',
        copy_link_btn: 'Copy Data',
        copied: 'Copied',
      },
      view: {
        title: 'Project Information',
        subtitle: 'Decoded data',
        status: 'VERIFIED',
        timestamp: 'Timestamp',
        project: 'Project',
        manager: 'Manager',
        description: 'Description',
        back_btn: 'Back to Form',
        error_title: 'DECODE ERROR',
        error_msg: 'Invalid or corrupted data',
        error_back: 'Back',
      },
      footer: {
        protocol: 'PROTOCOL v1.0',
        signal: 'HOLO LINK',
      },
    },
  },
  es: {
    translation: {
      header: {
        title: 'SISTEMA QR INFO',
        subtitle: 'Codificador de Información de Proyectos',
      },
      form: {
        title: 'Generar Código QR',
        subtitle: 'Codificar información del proyecto',
        project_label: 'Nombre del Proyecto',
        project_placeholder: 'Ingrese el nombre del proyecto',
        manager_label: 'Gestor',
        manager_placeholder: 'Ingrese el nombre del gestor',
        description_label: 'Descripción',
        description_placeholder: 'Ingrese la descripción del proyecto',
        required: 'Este campo es obligatorio',
        chars: 'caracteres',
        qr_section: 'El código QR aparecerá aquí',
        qr_hint: 'Escanea para leer datos codificados o copia el texto del payload',
        payload_label: 'Payload codificado',
        status_ready: 'LISTO',
        status_encoding: 'CODIFICANDO',
        status_complete: 'COMPLETO',
        generate_btn: 'Generar QR',
        reset_btn: 'Reiniciar',
        download_btn: 'Descargar',
        copy_link_btn: 'Copiar Datos',
        copied: 'Copiado',
      },
      view: {
        title: 'Información del Proyecto',
        subtitle: 'Datos decodificados',
        status: 'VERIFICADO',
        timestamp: 'Marca de tiempo',
        project: 'Proyecto',
        manager: 'Gestor',
        description: 'Descripción',
        back_btn: 'Volver al Formulario',
        error_title: 'ERROR DE DECODIFICACIÓN',
        error_msg: 'Datos inválidos o corruptos',
        error_back: 'Volver',
      },
      footer: {
        protocol: 'PROTOCOLO v1.0',
        signal: 'NEXO HOLO',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('qr-info-lang') || 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
