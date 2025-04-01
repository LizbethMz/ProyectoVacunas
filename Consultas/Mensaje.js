import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Mensaje = ({ tipo, texto }) => {
  if (!texto) return null;

  const estiloContenedor = [
    styles.contenedorMensaje,
    tipo === 'error' ? styles.mensajeError : styles.mensajeExito
  ];

  const estiloTexto = [
    styles.textoMensaje,
    tipo === 'error' ? styles.textoError : styles.textoExito
  ];

  return (
    <View style={estiloContenedor}>
      <Text style={estiloTexto}>{texto}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorMensaje: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    borderLeftWidth: 4,
  },
  mensajeError: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#C62828',
  },
  mensajeExito: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#2E7D32',
  },
  textoMensaje: {
    fontSize: 16,
    textAlign: 'center',
  },
  textoError: {
    color: '#C62828',
  },
  textoExito: {
    color: '#2E7D32',
  },
});

export default Mensaje;