import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getEnvios, crearEnvio, actualizarEnvio, eliminarEnvio } from '../api/EnviosApi';
import { getEstadosEnvio, subscribeToEstadoChanges } from '../api/EnvioEstadoApi';
import { getCamionesDisponibles } from '../api/CamionConductorApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Envios = () => {
  const [envios, setEnvios] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConsulta, setMostrarConsulta] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({
    numero: '',
    fecha_progr: '',
    hora_salida: '',
    hora_llegada: '',
    cod_camion: '',
    cod_ruta: ''
  });

  // Estados base predefinidos
  const estadosBase = [
    { numero: 1, descripcion: 'Preparando carga' },
    { numero: 2, descripcion: 'En tránsito' },
    { numero: 3, descripcion: 'Entregado' },
    { numero: 4, descripcion: 'Retrasado' },
    { numero: 5, descripcion: 'Cancelado' }
  ];

  useEffect(() => {
    cargarDatos();
    
    // Suscribirse a cambios en los estados de envío
    const unsubscribe = subscribeToEstadoChanges(cargarDatos);
    return () => unsubscribe();
  }, []);

  const cargarDatos = async () => {
    try {
      const [enviosData, camionesData, estadosEnvioData] = await Promise.all([
        getEnvios(),
        getCamionesDisponibles(),
        getEstadosEnvio()
      ]);

      // Combinar los datos
      const enviosConEstados = enviosData.map(envio => {
        const estadosEnvio = estadosEnvioData
          .filter(ee => ee.num_envio == envio.numero)
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        const ultimoEstado = estadosEnvio[0];
        const estadoDescripcion = ultimoEstado 
          ? estadosBase.find(e => e.numero == ultimoEstado.num_estado)?.descripcion 
          : 'Sin estado';

        return {
          ...envio,
          estado: estadoDescripcion,
          cod_estado: ultimoEstado?.num_estado
        };
      });

      setEnvios(enviosConEstados);
      setCamiones(camionesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const manejarCambioFormulario = (campo, valor) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const guardarEnvio = async () => {
    try {
      if (editandoId) {
        await actualizarEnvio(editandoId, { hora_llegada: formulario.hora_llegada });
        Alert.alert('Éxito', 'Envío actualizado correctamente');
      } else {
        await crearEnvio(formulario);
        Alert.alert('Éxito', 'Envío creado correctamente');
      }
      
      await cargarDatos();
      resetearFormulario();
    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un error al guardar');
    }
  };

  const eliminarEnvioConfirmado = async (num_envio) => {
    try {
      const resultado = await eliminarEnvio(num_envio);
      if (resultado.success) {
        Alert.alert('Éxito', 'Envío eliminado');
        await cargarDatos();
      } else {
        Alert.alert('Error', resultado.error || 'No se pudo eliminar');
      }
    } catch (error) {
      Alert.alert('Error', 'Solo se pueden eliminar envíos en estado Entregado o Cancelado');
    }
  };

  const editarEnvio = (envio) => {
    setFormulario({
      numero: envio.numero,
      fecha_progr: envio.fecha_progr,
      hora_salida: envio.hora_salida,
      hora_llegada: envio.hora_llegada,
      cod_camion: envio.cod_camion,
      cod_ruta: envio.cod_ruta
    });
    setEditandoId(envio.numero);
    setMostrarFormulario(true);
    setMostrarConsulta(false);
  };

  const resetearFormulario = () => {
    setFormulario({
      numero: '',
      fecha_progr: '',
      hora_salida: '',
      hora_llegada: '',
      cod_camion: '',
      cod_ruta: ''
    });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Preparando carga': return '#3498DB';
      case 'En tránsito': return '#F39C12';
      case 'Entregado': return '#2ECC71';
      case 'Cancelado': return '#E74C3C';
      case 'Retrasado': return '#9B59B6';
      default: return '#95A5A6';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Gestión de Envíos</Text>

      <View style={styles.contenedorBotones}>
        <TouchableOpacity
          style={styles.botonPrincipal}
          onPress={() => {
            setMostrarConsulta(true);
            setMostrarFormulario(false);
            cargarDatos();
          }}
        >
          <Icon name="search" size={20} color="#fff" />
          <Text style={styles.textoBoton}>Consultar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonPrincipal}
          onPress={() => {
            resetearFormulario();
            setMostrarFormulario(true);
            setMostrarConsulta(false);
          }}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.textoBoton}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {mostrarFormulario && (
        <View style={styles.formulario}>
          <Text style={styles.subtitulo}>
            {editandoId ? 'Editar Envío' : 'Nuevo Envío'}
          </Text>

          {!editandoId ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Número"
                value={formulario.numero}
                onChangeText={(text) => manejarCambioFormulario('numero', text)}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Fecha programada (YYYY-MM-DD)"
                value={formulario.fecha_progr}
                onChangeText={(text) => manejarCambioFormulario('fecha_progr', text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Hora salida (HH:MM:SS)"
                value={formulario.hora_salida}
                onChangeText={(text) => manejarCambioFormulario('hora_salida', text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Hora llegada (HH:MM:SS)"
                value={formulario.hora_llegada}
                onChangeText={(text) => manejarCambioFormulario('hora_llegada', text)}
              />

              <View style={styles.grupoFormulario}>
                <Text style={styles.etiqueta}>Selecciona Camión:</Text>
                <View style={styles.contenedorSelector}>
                  <Picker
                    selectedValue={formulario.cod_camion}
                    onValueChange={(value) => manejarCambioFormulario('cod_camion', value)}
                    style={styles.selector}
                  >
                    <Picker.Item label="Seleccione un camión" value="" />
                    {camiones.map(camion => (
                      <Picker.Item 
                        key={camion.codigo} 
                        label={`${camion.matricula} (${camion.codigo})`} 
                        value={camion.codigo} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Código ruta"
                value={formulario.cod_ruta}
                onChangeText={(text) => manejarCambioFormulario('cod_ruta', text)}
                keyboardType="numeric"
              />
            </>
          ) : (
            <>
              <Text style={styles.etiqueta}>Hora de llegada:</Text>
              <TextInput
                style={styles.input}
                placeholder="Hora llegada (HH:MM:SS)"
                value={formulario.hora_llegada}
                onChangeText={(text) => manejarCambioFormulario('hora_llegada', text)}
              />
            </>
          )}

          <TouchableOpacity 
            style={styles.botonGuardar} 
            onPress={guardarEnvio}
          >
            <Text style={styles.textoBoton}>
              {editandoId ? 'Actualizar' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {mostrarConsulta && (
        <View style={styles.listado}>
          <Text style={styles.subtitulo}>Envíos Registrados</Text>
          
          {envios.length === 0 ? (
            <Text style={styles.sinDatos}>No hay envíos registrados</Text>
          ) : (
            envios.map((envio) => (
              <View key={envio.numero} style={styles.tarjeta}>
                <View style={styles.encabezadoTarjeta}>
                  <Icon name="truck" size={24} color="#005398" />
                  <Text style={styles.tituloTarjeta}>Envío #{envio.numero}</Text>
                  <View style={[styles.badgeEstado, { backgroundColor: obtenerColorEstado(envio.estado) }]}>
                    <Text style={styles.textoBadge}>{envio.estado || 'Sin estado'}</Text>
                  </View>
                </View>
                
                <View style={styles.cuerpoTarjeta}>
                  <View style={styles.filaInfo}>
                    <Icon name="calendar-alt" size={16} color="#005398" />
                    <Text style={styles.textoTarjeta}>Fecha: {envio.fecha_progr}</Text>
                  </View>
                  <View style={styles.filaInfo}>
                    <Icon name="clock" size={16} color="#005398" />
                    <Text style={styles.textoTarjeta}>Salida: {envio.hora_salida}</Text>
                  </View>
                  <View style={styles.filaInfo}>
                    <Icon name="clock" size={16} color="#005398" />
                    <Text style={styles.textoTarjeta}>Llegada: {envio.hora_llegada}</Text>
                  </View>
                  <View style={styles.filaInfo}>
                    <Icon name="truck" size={16} color="#005398" />
                    <Text style={styles.textoTarjeta}>Camión: {envio.cod_camion}</Text>
                  </View>
                  <View style={styles.filaInfo}>
                    <Icon name="route" size={16} color="#005398" />
                    <Text style={styles.textoTarjeta}>Ruta: {envio.cod_ruta}</Text>
                  </View>
                </View>

                <View style={styles.pieTarjeta}>
                  <TouchableOpacity 
                    style={[styles.botonAccion, {backgroundColor: '#3498DB'}]} 
                    onPress={() => editarEnvio(envio)}
                  >
                    <Icon name="edit" size={16} color="#fff" />
                    <Text style={styles.textoBotonAccion}> Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.botonAccion, {backgroundColor: '#E74C3C'}]} 
                    onPress={() => {
                      if (envio.estado === 'Entregado' || envio.estado === 'Cancelado') {
                        eliminarEnvioConfirmado(envio.numero);
                      } else {
                        Alert.alert(
                          'No se puede eliminar',
                          'Solo puedes eliminar envíos en estado "Entregado" o "Cancelado"'
                        );
                      }
                    }}
                  >
                    <Icon name="trash-alt" size={16} color="#fff" />
                    <Text style={styles.textoBotonAccion}> Eliminar</Text>
                  </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
    textAlign: 'center',
  },
  contenedorBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  botonPrincipal: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formulario: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
  grupoFormulario: {
    marginBottom: 15,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#005398',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6EAF8',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  contenedorSelector: {
    borderWidth: 1,
    borderColor: '#D6EAF8',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  selector: {
    width: '100%',
    height: 50,
  },
  botonGuardar: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  listado: {
    marginTop: 10,
  },
  sinDatos: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginTop: 20,
  },
  tarjeta: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
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
    flex: 1,
  },
  badgeEstado: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  textoBadge: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cuerpotarjeta: {
    marginBottom: 10,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  textoTarjeta: {
    fontSize: 16,
    color: '#34495E',
    marginLeft: 10,
  },
  pieTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonAccion: {
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 3,
  },
  textoBotonAccion: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default Envios;