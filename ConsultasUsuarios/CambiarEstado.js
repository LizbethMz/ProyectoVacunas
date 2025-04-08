import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getEnviosPorConductor, cambiarEstadoEnvio } from '../apiUsuarios/EnviosApi';

const CambiarEstado = ({ route, navigation }) => {
  const [envios, setEnvios] = useState([]);
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { conductorId } = route.params;

  const estadosDisponibles = [
    { id: 1, nombre: 'Preparando carga', icono: 'box-open' },
    { id: 2, nombre: 'En tránsito', icono: 'truck-moving' },
    { id: 3, nombre: 'Entregado', icono: 'check-circle' },
    { id: 4, nombre: 'Retrasado', icono: 'clock' },
    { id: 5, nombre: 'Cancelado', icono: 'times-circle' },
  ];

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      console.log('Cargando envíos para conductor:', conductorId);
      const response = await getEnviosPorConductor(conductorId);
      console.log('Respuesta de envíos:', response);
      
      if (response.success) {
        // Filtrar envíos duplicados, manteniendo el más reciente
        const enviosUnicos = response.data.reduce((acc, envio) => {
          const key = envio.numero;
          if (!acc[key] || new Date(envio.fecha_progr) > new Date(acc[key].fecha_progr)) {
            acc[key] = envio;
          }
          return acc;
        }, {});
        
        const enviosFiltrados = Object.values(enviosUnicos);
        console.log('Envíos filtrados:', enviosFiltrados);
        setEnvios(enviosFiltrados);
      } else {
        Alert.alert('Error', response.message || 'No se pudieron cargar los envíos');
      }
    } catch (error) {
      console.error('Error al cargar envíos:', error);
      Alert.alert('Error', 'No se pudieron cargar los envíos');
    }
  };

  const handleCambiarEstado = async () => {
    if (!envioSeleccionado || !estadoSeleccionado) {
      Alert.alert('Error', 'Por favor selecciona un envío y un estado');
      return;
    }

    try {
      console.log('Intentando cambiar estado:', {
        envioId: envioSeleccionado.numero,
        nuevoEstado: estadoSeleccionado
      });

      const response = await cambiarEstadoEnvio(envioSeleccionado.numero, estadoSeleccionado);
      console.log('Respuesta recibida:', response);

      if (response.success) {
        Alert.alert('Éxito', 'Estado actualizado correctamente');
        setModalVisible(false);
        setEstadoSeleccionado('');
        
        // Actualizar el estado del envío en la lista local
        const enviosActualizados = envios.map(envio => {
          if (envio.numero === envioSeleccionado.numero) {
            return {
              ...envio,
              estado: estadoSeleccionado
            };
          }
          return envio;
        });
        
        setEnvios(enviosActualizados);
        
        // Recargar los envíos para asegurar que tenemos los datos más recientes
        await cargarEnvios();
      } else {
        Alert.alert('Error', response.message || 'No se pudo actualizar el estado');
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el estado');
    }
  };

  const renderEnvio = (envio, index) => (
    <TouchableOpacity
      key={`${envio.numero}-${envio.fecha_progr}-${envio.hora_salida}-${envio.cod_camion}-${envio.cod_sucursal}-${index}`}
      style={styles.envioCard}
      onPress={() => {
        setEnvioSeleccionado(envio);
        setModalVisible(true);
      }}
    >
      <View style={styles.envioHeader}>
        <Text style={styles.envioTitle}>Envío #{envio.numero}</Text>
        <Text style={styles.envioDate}>
          {new Date(envio.fecha_progr).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.envioContent}>
        <Text style={styles.envioLabel}>Origen:</Text>
        <Text style={styles.envioText}>{envio.planta_nombre || 'No disponible'}</Text>
        
        <Text style={styles.envioLabel}>Destino:</Text>
        <Text style={styles.envioText}>{envio.sucursal_nombre || 'No disponible'}</Text>
        
        <Text style={styles.envioLabel}>Estado actual:</Text>
        <Text style={[styles.envioText, { color: obtenerColorEstado(envio.estado) }]}>
          {envio.estado || 'Sin estado'}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#005398" />
        </TouchableOpacity>
        <Text style={styles.title}>Cambiar Estado de Envíos</Text>
      </View>

      <ScrollView style={styles.content}>
        {envios.length > 0 ? (
          envios.map((envio, index) => renderEnvio(envio, index))
        ) : (
          <Text style={styles.noEnviosText}>No hay envíos asignados</Text>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar Estado</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="times" size={24} color="#005398" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.envioSeleccionado}>
                Envío #{envioSeleccionado?.numero}
              </Text>
              
              <Text style={styles.label}>Selecciona el nuevo estado:</Text>
              <View style={styles.estadosContainer}>
                {estadosDisponibles.map((estado) => (
                  <TouchableOpacity
                    key={estado.id}
                    style={[
                      styles.estadoButton,
                      estadoSeleccionado === estado.nombre && styles.estadoButtonSelected
                    ]}
                    onPress={() => setEstadoSeleccionado(estado.nombre)}
                  >
                    <Icon 
                      name={estado.icono} 
                      size={24} 
                      color={estadoSeleccionado === estado.nombre ? '#fff' : '#005398'} 
                    />
                    <Text style={[
                      styles.estadoButtonText,
                      estadoSeleccionado === estado.nombre && styles.estadoButtonTextSelected
                    ]}>
                      {estado.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleCambiarEstado}
              >
                <Text style={styles.submitButtonText}>Actualizar Estado</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  envioCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  envioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  envioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
  },
  envioDate: {
    fontSize: 14,
    color: '#666',
  },
  envioContent: {
    marginTop: 10,
  },
  envioLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  envioText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  noEnviosText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  envioSeleccionado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  estadosContainer: {
    marginBottom: 20,
  },
  estadoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#005398',
  },
  estadoButtonSelected: {
    backgroundColor: '#005398',
  },
  estadoButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#005398',
  },
  estadoButtonTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CambiarEstado;