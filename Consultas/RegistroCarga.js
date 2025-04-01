import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getRegistrosCarga, createRegistroCarga } from '../api/RegistroCargaApi';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Mensaje from './Mensaje';

const RegistroCarga = () => {
  const [registrosData, setRegistrosData] = useState([]);
  const [registrando, setRegistrando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    carga_util: '',
    cod_camion: '',
    num_envio: '',
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Mostrar mensaje con temporizador
  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
  };

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await getRegistrosCarga();
      setRegistrosData(data);
      setCargando(false);
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      mostrarMensaje('No se pudieron cargar los registros', 'error');
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarRegistro = async () => {
    try {
      // Validar campos vacíos
      if (!nuevoRegistro.carga_util.trim() || !nuevoRegistro.cod_camion.trim() || !nuevoRegistro.num_envio.trim()) {
        mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
      }

      // Convertir y validar valores numéricos
      const cargaUtil = parseFloat(nuevoRegistro.carga_util);
      const codCamion = parseInt(nuevoRegistro.cod_camion);
      const numEnvio = parseInt(nuevoRegistro.num_envio);

      if (isNaN(cargaUtil)) {
        mostrarMensaje('La carga útil debe ser un número válido (ej. 1500.50)', 'error');
        return;
      }

      if (isNaN(codCamion)) {
        mostrarMensaje('El código de camión debe ser un número entero válido', 'error');
        return;
      }

      if (isNaN(numEnvio)) {
        mostrarMensaje('El número de envío debe ser un número entero válido', 'error');
        return;
      }

      // Validar valores positivos
      if (cargaUtil <= 0) {
        mostrarMensaje('La carga útil debe ser mayor que cero', 'error');
        return;
      }

      if (codCamion <= 0) {
        mostrarMensaje('El código de camión debe ser mayor que cero', 'error');
        return;
      }

      if (numEnvio <= 0) {
        mostrarMensaje('El número de envío debe ser mayor que cero', 'error');
        return;
      }

      // Crear registro
      const response = await createRegistroCarga({
        carga_util: cargaUtil,
        cod_camion: codCamion,
        num_envio: numEnvio
      });

      if (response.success) {
        mostrarMensaje('Registro creado exitosamente', 'exito');
        setNuevoRegistro({ carga_util: '', cod_camion: '', num_envio: '' });
        cargarDatos();
        setRegistrando(false);
      } else {
        mostrarMensaje(response.error || 'Error al crear el registro', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje(error.message || 'Ocurrió un error al procesar la solicitud', 'error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Registros de Carga</Text>

      {/* Mostrar mensaje en pantalla */}
      <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

      <View style={styles.contenedorBotones}>
        <TouchableOpacity
          style={styles.botonPrimario}
          onPress={() => {
            cargarDatos();
            setRegistrando(false);
          }}
        >
          <Icon name="search" size={20} color="#fff" style={styles.iconoBoton} />
          <Text style={styles.textoBotonPrimario}>Consultar Registros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonPrimario}
          onPress={() => {
            setRegistrando(true);
            setNuevoRegistro({ carga_util: '', cod_camion: '', num_envio: '' });
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" style={styles.iconoBoton} />
          <Text style={styles.textoBotonPrimario}>Nuevo Registro</Text>
        </TouchableOpacity>
      </View>

      {registrando ? (
        <View style={styles.formulario}>
          <Text style={styles.subtitulo}>Nuevo Registro de Carga</Text>
          
          <TextInput
            style={styles.entrada}
            placeholder="Carga Útil (kg)"
            value={nuevoRegistro.carga_util}
            onChangeText={(texto) => setNuevoRegistro({ ...nuevoRegistro, carga_util: texto })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.entrada}
            placeholder="Código Camión"
            value={nuevoRegistro.cod_camion}
            onChangeText={(texto) => setNuevoRegistro({ ...nuevoRegistro, cod_camion: texto })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.entrada}
            placeholder="Número de Envío"
            value={nuevoRegistro.num_envio}
            onChangeText={(texto) => setNuevoRegistro({ ...nuevoRegistro, num_envio: texto })}
            keyboardType="numeric"
          />
          
          <TouchableOpacity 
            style={styles.botonPrimario} 
            onPress={manejarRegistro}
          >
            <Text style={styles.textoBotonPrimario}>Guardar Registro</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botonSecundario} 
            onPress={() => setRegistrando(false)}
          >
            <Text style={styles.textoBotonSecundario}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contenedorInfo}>
          {cargando ? (
            <View style={styles.contenedorCarga}>
              <Text style={styles.textoCarga}>Cargando registros...</Text>
            </View>
          ) : registrosData.length === 0 ? (
            <Text style={styles.textoSinDatos}>No hay registros de carga disponibles</Text>
          ) : (
            registrosData.map((registro, index) => (
              <View key={index} style={styles.tarjeta}>
                <View style={styles.encabezadoTarjeta}>
                  <Icon name="box" size={24} color="#005398" />
                  <Text style={styles.tituloTarjeta}>Registro #{registro.codigo}</Text>
                </View>
                
                <View style={styles.cuerpoTarjeta}>
                  <Text style={styles.textoTarjeta}>
                    <Text style={styles.etiqueta}>Carga Útil:</Text> {registro.carga_util} kg
                  </Text>
                  <Text style={styles.textoTarjeta}>
                    <Text style={styles.etiqueta}>Camión:</Text> {registro.cod_camion} ({registro.matricula || 'Sin matrícula'})
                  </Text>
                  <Text style={styles.textoTarjeta}>
                    <Text style={styles.etiqueta}>Envío:</Text> {registro.num_envio}
                  </Text>
                  <Text style={styles.textoTarjeta}>
                    <Text style={styles.etiqueta}>Fecha:</Text> {new Date(registro.fecha_registro).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
    textAlign: 'center',
  },
  contenedorBotones: {
    width: '100%',
    marginBottom: 20,
  },
  botonPrimario: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textoBotonPrimario: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonSecundario: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textoBotonSecundario: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconoBoton: {
    marginRight: 10,
  },
  tarjeta: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  encabezadoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D6EAF8',
    paddingBottom: 10,
  },
  tituloTarjeta: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
    marginLeft: 10,
  },
  cuerpoTarjeta: {
    marginBottom: 10,
  },
  textoTarjeta: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 5,
  },
  etiqueta: {
    fontWeight: 'bold',
    color: '#005398',
  },
  formulario: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  entrada: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6EAF8',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  contenedorCarga: {
    padding: 20,
    alignItems: 'center',
  },
  textoCarga: {
    fontSize: 16,
    color: '#005398',
  },
  textoSinDatos: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    padding: 20,
  },
  contenedorInfo: {
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default RegistroCarga;